// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RevenueShareToken (RST)
 * @dev Revenue-sharing token for platform profit distribution
 * 
 * Tokenomics:
 * - Total Supply: 10,000,000 RST
 * - Revenue Distribution: 10% of monthly profits
 * - Staking: Lock tokens, earn from profit pool
 * - Governance: Vote on platform decisions
 * 
 * Like: Real estate tokenization, revenue-based financing
 */
contract RevenueShareToken is ERC20, Ownable, ReentrancyGuard {
    
    // Token economics
    uint256 public constant MAX_SUPPLY = 10000000 * 10**18; // 10M tokens
    uint256 public constant REVENUE_SHARE_PERCENTAGE = 10; // 10% of profits
    
    // Staking
    struct Stake {
        uint256 amount;
        uint256 stakedAt;
        uint256 unlocksAt;
        uint256 rewardDebt;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    uint256 public rewardPool;
    uint256 public accRewardPerShare; // Accumulated rewards per staked token
    
    // Revenue tracking
    uint256 public totalRevenueDistributed;
    uint256 public monthlyRevenue;
    mapping(uint256 => uint256) public monthlyDistributions; // month => amount
    
    // Governance
    mapping(address => uint256) public votingPower;
    
    // Events
    event RevenueDistributed(uint256 amount, uint256 timestamp);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("Revenue Share Token", "RST") {
        // Initial supply to owner (for distribution)
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    /**
     * @dev Distribute monthly revenue to token holders
     * Called by platform owner after calculating monthly profits
     */
    function distributeRevenue() external payable onlyOwner {
        require(msg.value > 0, "No revenue to distribute");
        require(totalStaked > 0, "No tokens staked");
        
        // Add to reward pool
        rewardPool += msg.value;
        
        // Update accumulated reward per share
        accRewardPerShare += (msg.value * 1e18) / totalStaked;
        
        // Track distribution
        uint256 currentMonth = block.timestamp / 30 days;
        monthlyDistributions[currentMonth] += msg.value;
        totalRevenueDistributed += msg.value;
        
        emit RevenueDistributed(msg.value, block.timestamp);
        
        console.log("💰 Revenue distributed:", msg.value, "wei to", totalStaked, "staked tokens");
    }
    
    /**
     * @dev Stake tokens to earn revenue share
     * @param amount Amount of tokens to stake
     * @param lockPeriod Lock period in days (30, 90, 180, 365)
     */
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(
            lockPeriod == 30 || lockPeriod == 90 || lockPeriod == 180 || lockPeriod == 365,
            "Invalid lock period"
        );
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update stake
        Stake storage userStake = stakes[msg.sender];
        userStake.amount += amount;
        userStake.stakedAt = block.timestamp;
        userStake.unlocksAt = block.timestamp + (lockPeriod * 1 days);
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e18;
        
        // Update total staked
        totalStaked += amount;
        
        // Grant voting power
        votingPower[msg.sender] = userStake.amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No tokens staked");
        require(block.timestamp >= userStake.unlocksAt, "Tokens still locked");
        
        uint256 amount = userStake.amount;
        
        // Claim rewards
        uint256 rewards = _claimRewards(msg.sender);
        
        // Return staked tokens
        _transfer(address(this), msg.sender, amount);
        
        // Clear stake
        totalStaked -= amount;
        userStake.amount = 0;
        votingPower[msg.sender] = 0;
        
        emit Unstaked(msg.sender, amount, rewards);
    }
    
    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        uint256 rewards = _claimRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(address user) private returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        // Calculate pending rewards
        uint256 accumulatedRewards = (userStake.amount * accRewardPerShare) / 1e18;
        uint256 pending = accumulatedRewards - userStake.rewardDebt;
        
        if (pending > 0) {
            // Transfer ETH rewards to user
            (bool sent, ) = user.call{value: pending}("");
            require(sent, "Reward transfer failed");
            
            // Update reward debt
            userStake.rewardDebt = accumulatedRewards;
            rewardPool -= pending;
            
            emit RewardsClaimed(user, pending);
        }
        
        return pending;
    }
    
    /**
     * @dev View pending rewards
     */
    function pendingRewards(address user) external view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 accumulatedRewards = (userStake.amount * accRewardPerShare) / 1e18;
        return accumulatedRewards - userStake.rewardDebt;
    }
    
    /**
     * @dev Calculate APY for staking
     */
    function calculateAPY() external view returns (uint256) {
        if (totalStaked == 0 || monthlyRevenue == 0) return 0;
        
        // Annual revenue share
        uint256 annualDistribution = monthlyRevenue * 12;
        
        // APY = (annual distribution / total staked) * 100
        return (annualDistribution * 100 * 1e18) / totalStaked / 1e18;
    }
    
    /**
     * @dev Update monthly revenue (called by platform)
     */
    function updateMonthlyRevenue(uint256 revenue) external onlyOwner {
        monthlyRevenue = revenue;
    }
}

