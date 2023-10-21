// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";

/**
 * @title ECDSA Module
 * @author Consensys x DappSheriff
 * @notice This contract illustrates a valid Module that is used to verify ECDSA signatures of payload
 */
contract ECDSAModule is AbstractModule, Ownable {
  address public signer;
  mapping(uint256 => bool) public usedNonces; // nonce => used

  constructor(address initialOwner, address _signer) {
    signer = _signer;
  }

  /// @dev This empty method prevents Foundry from counting this contract in code coverage
  function test() public {}

  /**
   * @notice This method is used to run the module's validation logic
   * @param attestationPayload - AttestationPayload containing the user address as `subject` and nonce as `attestationData`
   * @param validationPayload - Payload encoded with abi.encode(uint256).toEthSignedMessageHash().sign(signer)
   */
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address /*txSender*/,
    uint256 /*value*/
  ) public override {
    address signee = abi.decode(attestationPayload.subject, (address));
    uint256 nonce = abi.decode(attestationPayload.attestationData, (uint256));
    if (usedNonces[nonce]) {
      revert("Nonce already used");
    }

    bytes32 hash = ECDSA.toEthSignedMessageHash(abi.encodePacked(signee, nonce));
    require(ECDSA.recover(hash, validationPayload) == signer, "Wrong signature");

    usedNonces[nonce] = true;
  }

  function setSigner(address _signer) external onlyOwner {
    signer = _signer;
  }
}
