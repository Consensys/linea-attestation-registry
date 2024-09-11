import axios from "axios";

export const getIPFSContent = async (ipfsHash: string): Promise<string> => {
  const ipfsGatewayUrl = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;
  const response = await axios.get(ipfsGatewayUrl);
  return response.data;
};
