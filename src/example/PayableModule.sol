// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title Payable Module
 * @author Consensys
 * @notice This contract is an example of a module, able to charge a fee for attestations
 */
contract PayableModule is Ownable, AbstractModule {
  uint256 public attestationFee;

  /// @notice Error thrown when an invalid attestation fee is provided
  error InvalidAttestationFee();

  /**
   * @param _attestationFee The fee required to attest
   */
  constructor(uint256 _attestationFee, address _initialOwner) Ownable(_initialOwner) {
    attestationFee = _attestationFee;
  }

  /**
   * @notice Set the fee required to attest
   * @param _attestationFee The fee required to attest
   */
  function setFee(uint256 _attestationFee) public onlyOwner {
    attestationFee = _attestationFee;
  }

  /**
   * @notice The main method for the module, running the check
   * @param _value The value sent for the attestation
   */
  function run(
    AttestationPayload memory /*_attestationPayload*/,
    bytes memory /*_validationPayload*/,
    address /*_txSender*/,
    uint256 _value
  ) public view override {
    if (_value < attestationFee) revert InvalidAttestationFee();
  }
}
