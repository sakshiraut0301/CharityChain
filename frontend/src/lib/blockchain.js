import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

const ABI = ["function donate(uint256 campaignId) payable", "function createCampaign(uint256 targetAmount, uint256 deadline, string metadataURI) returns (uint256)", "function campaigns(uint256) view returns (address organization, uint256 targetAmount, uint256 raisedAmount, uint256 deadline, bool active, bool paused, string metadataURI)", "function pauseCampaign(uint256 campaignId)", "function closeCampaign(uint256 campaignId)", "event CampaignCreated(uint256 indexed campaignId, address indexed organization, uint256 targetAmount, uint256 deadline, string metadataURI)", "event DonationMade(uint256 indexed campaignId, address indexed donor, address indexed organization, uint256 amount, uint256 timestamp)"];
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const expectedChainId = Number(import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111);

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask is not installed. Install the MetaMask extension to continue.");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== expectedChainId) throw new Error("Please switch MetaMask to the Sepolia test network.");
  const signer = await provider.getSigner();
  return signer.address;
}

export async function getWalletBalance() {
  const address = await connectWallet();
  const provider = new BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(address);
  return { address, balance: Number(formatEther(balance)) };
}

export async function getCampaignOnChain(chainCampaignId) {
  if (!contractAddress || contractAddress.includes("YourDeployed") || !window.ethereum) return null;
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== expectedChainId) return null;
  const campaign = await new Contract(contractAddress, ABI, provider).campaigns(chainCampaignId);
  return { goal: Number(formatEther(campaign.targetAmount)), raised: Number(formatEther(campaign.raisedAmount)), endDate: new Date(Number(campaign.deadline) * 1000).toISOString().slice(0, 10), status: !campaign.active ? "closed" : campaign.paused ? "paused" : "active" };
}

export async function donateOnChain(chainCampaignId, ethAmount) {
  if (!contractAddress || contractAddress.includes("YourDeployed")) throw new Error("Set VITE_CONTRACT_ADDRESS after deploying CharityChain to Sepolia.");
  if (!window.ethereum) throw new Error("MetaMask is not installed. Install the MetaMask extension to continue.");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== expectedChainId) throw new Error("Please switch MetaMask to the Sepolia test network.");
  const signer = await provider.getSigner();
  const value = parseEther(String(ethAmount));
  const balance = await provider.getBalance(signer.address);
  if (balance < value) throw new Error(`Insufficient ETH balance. Your wallet has ${formatEther(balance)} ETH.`);
  const contract = new Contract(contractAddress, ABI, signer);
  const transaction = await contract.donate(chainCampaignId, { value });
  const receipt = await transaction.wait();
  if (receipt.status !== 1) throw new Error("The donation transaction was not confirmed.");
  return { hash: transaction.hash, blockNumber: receipt.blockNumber, wallet: signer.address };
}

export async function createCampaignOnChain(targetEth, deadline, metadataURI = "") {
  if (!contractAddress || contractAddress.includes("YourDeployed")) throw new Error("Set VITE_CONTRACT_ADDRESS after deploying CharityChain to Sepolia.");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== expectedChainId) throw new Error("Please switch MetaMask to the Sepolia test network.");
  const contract = new Contract(contractAddress, ABI, await provider.getSigner());
  const transaction = await contract.createCampaign(parseEther(String(targetEth)), Math.floor(new Date(deadline).getTime() / 1000), metadataURI);
  const receipt = await transaction.wait();
  const event = receipt.logs.map((log) => { try { return contract.interface.parseLog(log); } catch { return null; } }).find((log) => log?.name === "CampaignCreated");
  return { chainCampaignId: event.args.campaignId.toString(), hash: transaction.hash };
}

async function changeCampaignOnChain(method, chainCampaignId) {
  if (!contractAddress || contractAddress.includes("YourDeployed")) throw new Error("Set VITE_CONTRACT_ADDRESS after deploying CharityChain to Sepolia.");
  if (!window.ethereum) throw new Error("MetaMask is not installed.");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== expectedChainId) throw new Error("Please switch MetaMask to the Sepolia test network.");
  const contract = new Contract(contractAddress, ABI, await provider.getSigner());
  const transaction = await contract[method](chainCampaignId);
  const receipt = await transaction.wait();
  if (receipt.status !== 1) throw new Error("The campaign status transaction was not confirmed.");
  return { hash: transaction.hash, blockNumber: receipt.blockNumber };
}

export const pauseCampaignOnChain = (chainCampaignId) => changeCampaignOnChain("pauseCampaign", chainCampaignId);
export const closeCampaignOnChain = (chainCampaignId) => changeCampaignOnChain("closeCampaign", chainCampaignId);
