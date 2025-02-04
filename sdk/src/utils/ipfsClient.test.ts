import axios from "axios";
import { getIPFSContent } from "./ipfsClient";

jest.mock("axios");

describe("ipfsClient", () => {
  describe("getIPFSContent", () => {
    const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkddHjMGJkGivK";
    const mockIPFSData = "Mock IPFS content";

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should fetch and return content from IPFS", async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: mockIPFSData,
      });

      const content = await getIPFSContent(ipfsHash);
      expect(axios.get).toHaveBeenCalledWith(`https://cloudflare-ipfs.com/ipfs/${ipfsHash}`);
      expect(content).toBe(mockIPFSData);
    });

    it("should throw an error when the request fails", async () => {
      const mockError = new Error("Network error");

      (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getIPFSContent(ipfsHash)).rejects.toThrow("Network error");
      expect(axios.get).toHaveBeenCalledWith(`https://cloudflare-ipfs.com/ipfs/${ipfsHash}`);
    });
  });
});
