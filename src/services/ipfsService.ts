import { IPFSFile } from '@/lib/types';

// IPFS Service for decentralized file storage
class IPFSService {
  private ipfsGateways = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/'
  ];

  private pinataApiUrl = 'https://api.pinata.cloud';
  private pinataJWT: string | null = null;

  constructor() {
    // In production, you would set your Pinata JWT token here
    // For demo purposes, we'll use mock functionality
  }

  /**
   * Upload file to IPFS network
   * @param file - File to upload
   * @param options - Upload options
   * @returns Promise<IPFSFile>
   */
  async uploadFile(
    file: File, 
    options: { 
      fileName?: string; 
      description?: string;
      isPublic?: boolean;
    } = {}
  ): Promise<IPFSFile> {
    try {
      // Mock IPFS upload for demonstration
      // In production, this would use actual IPFS node or Pinata
      return this.mockUpload(file, options);
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error(`Failed to upload to IPFS: ${error}`);
    }
  }

  /**
   * Upload JSON metadata to IPFS
   * @param metadata - JSON object to upload
   * @param fileName - Optional filename
   * @returns Promise<IPFSFile>
   */
  async uploadJSON(metadata: any, fileName = 'metadata.json'): Promise<IPFSFile> {
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], fileName, { type: 'application/json' });
    
    return this.uploadFile(file, { fileName, description: 'NFT Metadata' });
  }

  /**
   * Get IPFS file URL using the fastest available gateway
   * @param hash - IPFS hash
   * @param preferredGateway - Preferred gateway index
   * @returns string
   */
  getFileUrl(hash: string, preferredGateway = 0): string {
    const gateway = this.ipfsGateways[preferredGateway] || this.ipfsGateways[0];
    return `${gateway}${hash}`;
  }

  /**
   * Download file from IPFS
   * @param hash - IPFS hash
   * @returns Promise<ArrayBuffer>
   */
  async downloadFile(hash: string): Promise<ArrayBuffer> {
    for (const gateway of this.ipfsGateways) {
      try {
        const response = await fetch(`${gateway}${hash}`, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
          },
        });
        
        if (response.ok) {
          return await response.arrayBuffer();
        }
      } catch (error) {
        console.warn(`Failed to fetch from gateway ${gateway}:`, error);
        continue;
      }
    }
    
    throw new Error(`Failed to download file ${hash} from any IPFS gateway`);
  }

  /**
   * Pin file to ensure it stays available on IPFS network
   * @param hash - IPFS hash to pin
   * @returns Promise<boolean>
   */
  async pinFile(hash: string): Promise<boolean> {
    if (!this.pinataJWT) {
      console.warn('No Pinata JWT configured - file will not be pinned');
      return false;
    }

    try {
      const response = await fetch(`${this.pinataApiUrl}/pinning/pinByHash`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hashToPin: hash,
          pinataMetadata: {
            name: `Cyberpunk-Product-${hash}`,
            keyvalues: {
              environment: 'cyberpunk-ecommerce',
              type: 'product-asset'
            }
          }
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to pin file:', error);
      return false;
    }
  }

  /**
   * Mock IPFS upload for demonstration
   * This simulates the upload process and returns a mock IPFS hash
   * In production, replace with actual IPFS client
   */
  private async mockUpload(
    file: File, 
    options: { fileName?: string; description?: string; isPublic?: boolean }
  ): Promise<IPFSFile> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate mock IPFS hash (QmHash format)
    const randomPart = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    const hash = `Qm${randomPart.padEnd(44, '0')}`;

    const ipfsFile: IPFSFile = {
      hash,
      url: this.getFileUrl(hash),
      fileName: options.fileName || file.name,
      fileSize: file.size,
      mimeType: file.type
    };

    console.log('🌐 Mock IPFS upload completed:', ipfsFile);
    return ipfsFile;
  }

  /**
   * Validate IPFS hash format
   * @param hash - Hash to validate
   * @returns boolean
   */
  isValidHash(hash: string): boolean {
    // Basic validation for IPFS hash formats
    const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48})$/;
    return ipfsHashRegex.test(hash);
  }

  /**
   * Get file info from IPFS hash
   * @param hash - IPFS hash
   * @returns Promise<{size: number, type: string}>
   */
  async getFileInfo(hash: string): Promise<{ size: number; type: string }> {
    try {
      const response = await fetch(this.getFileUrl(hash), { method: 'HEAD' });
      return {
        size: parseInt(response.headers.get('content-length') || '0'),
        type: response.headers.get('content-type') || 'application/octet-stream'
      };
    } catch (error) {
      throw new Error(`Failed to get file info: ${error}`);
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
export default ipfsService;