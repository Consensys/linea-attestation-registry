const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeraxVotingNFT", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;

  let veraxVotingNFT;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const VeraxVotingNFT = await ethers.getContractFactory("VeraxVotingNFT");

    veraxVotingNFT = await upgrades.deployProxy(VeraxVotingNFT, [owner.address]);

    await veraxVotingNFT.waitForDeployment();
  });

  // Test case for initialization
  it("Should initialize with the correct name and symbol", async function () {
    expect(await veraxVotingNFT.name()).to.equal("Verax Voting NFT");
    expect(await veraxVotingNFT.symbol()).to.equal("VERAX");
  });

  // Test case for pausing and unpausing
  it("Should pause and unpause the contract", async function () {
    await veraxVotingNFT.pause();
    expect(await veraxVotingNFT.paused()).to.be.true;

    await veraxVotingNFT.unpause();
    expect(await veraxVotingNFT.paused()).to.be.false;
  });

  // Test case for minting
  it("Should mint a new NFT", async function () {
    const tokenId = 1;

    await veraxVotingNFT.safeMint(addr1.address, tokenId);

    expect(await veraxVotingNFT.ownerOf(tokenId)).to.equal(addr1.address);
  });

  // Test case for transferring (view function)
  it("Should not allow transfers", async function () {
    const tokenId = 1;

    // Attempting to transfer should revert
    await expect(veraxVotingNFT.transferFrom(addr1.address, addr2.address, tokenId)).to.be.revertedWith(
      "Transfer is not allowed",
    );

    // Attempting to transfer should revert
    await expect(veraxVotingNFT.safeTransferFrom(addr1.address, addr2.address, tokenId)).to.be.revertedWith(
      "Transfer is not allowed",
    );
  });
});
