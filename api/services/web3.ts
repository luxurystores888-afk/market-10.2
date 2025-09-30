import { ethers } from 'ethers';

const REVIEW_CONTRACT_ADDRESS = '0xYourDeployedAddress'; // Replace with actual
const REVIEW_ABI = [ // Basic ABI for submitReview function
  'function submitReview(string calldata productId, uint8 rating, string calldata content) external'
];

async function submitBlockchainReview(productId: string, rating: number, content: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(REVIEW_CONTRACT_ADDRESS, REVIEW_ABI, signer);
  const tx = await contract.submitReview(productId, rating, content);
  await tx.wait();
  return tx.hash;
}
