import { ethers } from 'ethers';
import contractInfo from '../contracts/MementoProofRegistry.json';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractInfo.address;
const CONTRACT_ABI = contractInfo.abi;

// Sepolia network configuration
const SEPOLIA_CHAIN_ID = 11155111;

export class MementoContractService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeContract();
  }

  private async initializeContract() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await provider.getSigner();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      } catch (error) {
        console.error('Failed to initialize contract:', error);
      }
    }
  }

  /**
   * Create a new proof on the blockchain
   */
  async createProof(fileHash: string, metadataHash: string = ethers.ZeroHash) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Convert hex string to bytes32
      const fileHashBytes32 = ethers.getBytes(fileHash);
      const metadataHashBytes32 = ethers.getBytes(metadataHash);

      const tx = await this.contract.createProof(fileHashBytes32, metadataHashBytes32);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed.toString()
      };
    } catch (error: any) {
      console.error('Error creating proof:', error);
      
      // Handle specific contract errors
      if (error.message.includes('ProofAlreadyExists')) {
        throw new Error('A proof for this file already exists');
      } else if (error.message.includes('InvalidHash')) {
        throw new Error('Invalid file hash provided');
      } else {
        throw new Error('Failed to create proof: ' + error.message);
      }
    }
  }

  /**
   * Check if a proof exists for a file hash
   */
  async proofExists(fileHash: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const fileHashBytes32 = ethers.getBytes(fileHash);
      return await this.contract.proofExists(fileHashBytes32);
    } catch (error) {
      console.error('Error checking proof existence:', error);
      return false;
    }
  }

  /**
   * Get proof details for a file hash
   */
  async getProof(fileHash: string) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const fileHashBytes32 = ethers.getBytes(fileHash);
      const proof = await this.contract.getProof(fileHashBytes32);
      
      return {
        creator: proof.creator,
        timestamp: Number(proof.timestamp),
        metadataHash: proof.metadataHash
      };
    } catch (error: any) {
      if (error.message.includes('ProofNotFound')) {
        return null;
      }
      throw new Error('Failed to get proof: ' + error.message);
    }
  }

  /**
   * Get basic proof info (creator and timestamp only - cheaper gas)
   */
  async getBasicProof(fileHash: string) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const fileHashBytes32 = ethers.getBytes(fileHash);
      const [creator, timestamp] = await this.contract.getBasicProof(fileHashBytes32);
      
      return {
        creator,
        timestamp: Number(timestamp)
      };
    } catch (error: any) {
      if (error.message.includes('ProofNotFound')) {
        return null;
      }
      throw new Error('Failed to get basic proof: ' + error.message);
    }
  }

  /**
   * Get the number of proofs created by an address
   */
  async getCreatorProofCount(address: string): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await this.contract.creatorProofCount(address);
    } catch (error) {
      console.error('Error getting creator proof count:', error);
      return 0;
    }
  }

  /**
   * Get the current signer address
   */
  async getSignerAddress(): Promise<string | null> {
    if (!this.signer) {
      return null;
    }
    
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting signer address:', error);
      return null;
    }
  }

  /**
   * Switch to Sepolia network
   */
  async switchToSepolia(): Promise<boolean> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      // If the chain is not added, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Get transaction URL for block explorer
   */
  getTransactionUrl(txHash: string): string {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }

  /**
   * Get contract URL for block explorer
   */
  getContractUrl(): string {
    return `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;
  }
}

// Create singleton instance
export const mementoContract = new MementoContractService();
