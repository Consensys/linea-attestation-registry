import axios from "axios";

export const getContent = async (ipfsHash: string): Promise<string> => {
  // Use the Cloudflare IPFS gateway URL
  const ipfsGatewayUrl = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;
  // Make a request to the IPFS gateway
  const response = await axios.get(ipfsGatewayUrl);
  return response.data
};
