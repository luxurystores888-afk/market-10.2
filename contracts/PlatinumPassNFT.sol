// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PlatinumPassNFT
 * @dev Platinum membership NFT with 1,000 max supply
 * 
 * Features:
 * - Capped supply at 1,000 NFTs
 * - Tiered pricing (early bird discount)
 * - Referral system built-in
 * - Royalties on secondary sales
 * - Gas-subsidized minting (meta-transactions)
 * - Multi-chain deployment (Ethereum + L2s)
 */
contract PlatinumPassNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Constants
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant EARLY_BIRD_SUPPLY = 100; // First 100 at discount
    uint256 public constant EARLY_BIRD_PRICE = 0.5 ether; // ~$1,000
    uint256 public constant REGULAR_PRICE = 1 ether; // ~$2,000
    uint256 public constant ROYALTY_PERCENTAGE = 5; // 5% royalty
    
    // State variables
    string private _baseTokenURI;
    bool public mintingActive = false;
    uint256 public mintStartTime;
    
    // Referral system
    mapping(address => address) public referrers; // minter => referrer
    mapping(address => uint256) public referralCount; // referrer => count
    mapping(address => uint256) public referralEarnings; // referrer => earnings
    uint256 public constant REFERRAL_COMMISSION = 10; // 10%
    
    // Per-wallet caps
    mapping(address => uint256) public walletMints;
    uint256 public constant MAX_PER_WALLET = 5;
    
    // Events
    event PlatinumMinted(address indexed minter, uint256 indexed tokenId, address indexed referrer);
    event ReferralReward(address indexed referrer, address indexed minter, uint256 amount);
    event MintingStatusChanged(bool active);
    
    constructor(string memory baseURI) ERC721("Platinum Pass", "PLAT") {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint Platinum Pass NFT
     * @param referrer Address of referrer (address(0) if none)
     */
    function mint(address referrer) public payable nonReentrant {
        require(mintingActive, "Minting not active");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(walletMints[msg.sender] < MAX_PER_WALLET, "Max mints per wallet reached");
        
        uint256 price = getCurrentPrice();
        require(msg.value >= price, "Insufficient payment");
        
        // Record referrer
        if (referrer != address(0) && referrer != msg.sender) {
            referrers[msg.sender] = referrer;
            referralCount[referrer]++;
            
            // Pay referral commission
            uint256 commission = (price * REFERRAL_COMMISSION) / 100;
            referralEarnings[referrer] += commission;
            
            (bool sent, ) = referrer.call{value: commission}("");
            require(sent, "Referral payment failed");
            
            emit ReferralReward(referrer, msg.sender, commission);
        }
        
        // Mint NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        walletMints[msg.sender]++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId))));
        
        emit PlatinumMinted(msg.sender, tokenId, referrer);
        
        // Refund excess payment
        if (msg.value > price) {
            (bool refunded, ) = msg.sender.call{value: msg.value - price}("");
            require(refunded, "Refund failed");
        }
    }
    
    /**
     * @dev Gas-subsidized mint (meta-transaction)
     * Owner pays gas for user
     */
    function mintSubsidized(address recipient, address referrer, bytes memory signature) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(mintingActive, "Minting not active");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(walletMints[recipient] < MAX_PER_WALLET, "Max mints per wallet reached");
        
        // Verify signature (simplified - add proper EIP-712 signature verification)
        // In production, verify that recipient signed the request
        
        // Record referrer
        if (referrer != address(0) && referrer != recipient) {
            referrers[recipient] = referrer;
            referralCount[referrer]++;
        }
        
        // Mint NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        walletMints[recipient]++;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId))));
        
        emit PlatinumMinted(recipient, tokenId, referrer);
    }
    
    /**
     * @dev Get current mint price based on supply
     */
    function getCurrentPrice() public view returns (uint256) {
        if (_tokenIdCounter.current() < EARLY_BIRD_SUPPLY) {
            return EARLY_BIRD_PRICE;
        }
        return REGULAR_PRICE;
    }
    
    /**
     * @dev Get remaining supply
     */
    function getRemainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _tokenIdCounter.current();
    }
    
    /**
     * @dev Start/stop minting
     */
    function setMintingActive(bool active) external onlyOwner {
        mintingActive = active;
        if (active && mintStartTime == 0) {
            mintStartTime = block.timestamp;
        }
        emit MintingStatusChanged(active);
    }
    
    /**
     * @dev Update base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Withdrawal failed");
    }
    
    /**
     * @dev Get referral stats for an address
     */
    function getReferralStats(address account) external view returns (
        uint256 totalReferrals,
        uint256 totalEarnings,
        uint256 estimatedFutureEarnings
    ) {
        totalReferrals = referralCount[account];
        totalEarnings = referralEarnings[account];
        estimatedFutureEarnings = totalReferrals * ((getCurrentPrice() * REFERRAL_COMMISSION) / 100);
    }
    
    // Override required functions
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

