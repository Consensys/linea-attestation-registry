// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title Abstract Module V2
 * @author Consensys
 * @notice Defines the minimal Module V2 interface
 */
abstract contract AbstractModuleV2 is ERC165 {
  /// @notice Error thrown when someone else than the portal's owner is trying to revoke
  error OnlyPortalOwner();

  /**
   * @notice Executes the module's custom logic
   * @param attestationPayload The incoming attestation data
   * @param validationPayload Additional data required for verification
   * @param initialCaller The address of the initial caller (transaction sender)
   * @param value The value (ETH) optionally passed in the attesting transaction
   * @param attester The address defined by the Portal as the attester for this payload
   * @param portal The issuing Portal's address
   */
  function run(
    AttestationPayload calldata attestationPayload,
    bytes calldata validationPayload,
    address initialCaller,
    uint256 value,
    address attester,
    address portal,
    OperationType operationType
  ) public virtual;

  /**
   * @notice Checks if the contract implements the Module interface.
   * @param interfaceID The ID of the interface to check.
   * @return A boolean indicating interface support.
   */
  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(AbstractModuleV2).interfaceId || super.supportsInterface(interfaceID);
  }
}
