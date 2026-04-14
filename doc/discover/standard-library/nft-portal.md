# NFT Portal

The NFT Portal is an example of how you can deploy a portal that remains compatible with the
[ERC-721 standard](https://eips.ethereum.org/EIPS/eip-721). This means that your portal will be compatible with any dApp
or protocol that is already set up to read NFTs. Many dApps and protocols leverage NFTs for membership gating or to
unlock certain features, or to allow voting etc. With an ERC-721 compatible portal, those dApps can now consume your
attestations without having to change a single line of their code.

## How it works

To create an NFT/SBT compatible portal, you can copy the
[default portal](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/DefaultPortalV2.sol) but
add in the implementation of the erc-721 interface, or even simpler, inherit
from[ OpenZeppellin's implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/ERC721.sol):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AbstractPortalV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractPortalV2.sol";
import { AttestationPayload } from "@verax-attestation-registry/verax-contracts/contracts/types/Structs.sol";

contract MyNFTPortal is AbstractPortalV2, ERC721 {
  /// @notice Creates an attestation with the given attestationPayload and validationPayload
  /// @dev Calls the inherited contract's attest function first, and then runs custom NFT logic
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) public payable override {
    super.attest(attestationPayload, validationPayload);

    address = _attestationRegistryAddress = 0xabcd;
    AttestationRegistry attestationRegistry = AttestationRegistry(_attestationRegistryAddress);

    uint256 = attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    bytes32 attestationId = bytes32(abi.encode(attestationIdCounter));

    _safeMint(address(attestationPayload.subject), attestationRegistry);
  }
}
```

This example implementation will give you out-of-the-box functionality such as the following standard and widely
supported NFT methods:

```solidity
/// @notice Count all NFTs assigned to an owner
/// @param _owner An address for whom to query the balance
/// @return The number of NFTs owned by `_owner`, possibly zero
function balanceOf(address _owner) external view returns (uint256);

/// @notice Find the owner of an NFT
/// @param _tokenId The identifier for an NFT
/// @return The address of the owner of the NFT
function ownerOf(uint256 _tokenId) external view returns (address);
```

If you want to, you can even implement some extensions, such as the
[IERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/extensions/IERC721Enumerable.sol)
contract. Another extension that OpenZeppelin implements by default is the `ERC721Metadata` standard:

```solidity
interface ERC721Metadata {
  /// @notice A descriptive name for a collection of NFTs in this contract
  function name() external view returns (string _name);

  /// @notice An abbreviated name for NFTs in this contract
  function symbol() external view returns (string _symbol);

  /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
  function tokenURI(uint256 _tokenId) external view returns (string);
}
```

If the tokenURI points to an indexer returning the decoded attestation data, bear in mind that you need to publish your
schema in a way that adheres to the "ERC721 Metadata JSON Schema",
[defined in the standard](https://eips.ethereum.org/EIPS/eip-721) as so:

```json
{
  "title": "Asset Metadata",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Identifies the asset to which this NFT represents"
    },
    "description": {
      "type": "string",
      "description": "Describes the asset to which this NFT represents"
    },
    "image": {
      "type": "string",
      "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
    }
  }
}
```

The Verax schema for the above would look like:

```
title string, type string, properties {
  name { type string, description string },
  description { type string, description string },
  image { type string, description string }
}
```

## Future Work

Verax is exploring if we can add native support for the ERC-1155 standard in the future. This way, dApps and protocols
could leverage ERC-1155 for interacting with the registry, without the individual issuers being required to add any
custom functionality in to their portal. This would probably involve overloading the ERC-1155 `balanceOf` function with
the following implementation (in the `AttestationRegistry` contract):

```solidity
/**
 * @notice Get the balance of an account's tokens.
 * @param _owner The address of the token holder
 * @param _id ID of the token
 * @return The _owner's balance of the token type requested
 */
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```

The erc-1155 token standard is also seeing widespread adoption, and is implemented widely, especially in the gaming
sector. This standard aligns more with the attestation registry, as the addition of the `_id` parameter will allow us to
specify a schema ID (when cast from `bytes32` to `uint256`) which effectively allows a dApp to query if a user has been
given an attestation on a specific schema.
