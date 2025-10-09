import Web3 from 'web3';

export class BlockchainService {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'); // Replace with actual key
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  // Add more methods for payments, NFTs, etc.
}
