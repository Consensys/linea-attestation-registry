import { ManageStateOperation } from '@metamask/snaps-sdk';

import type { SnapState } from './types';

/**
 * Get the snap state.
 * @returns Snap State.
 */
export async function getState() {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });
  return (snapState ?? {}) as SnapState;
}

/**
 * Set the snap state.
 * @param state - The new state to set.
 */
export async function setState(state: SnapState): Promise<void> {
  try {
    const currentState = await getState();
    const newState = {
      ...currentState,
      ...state,
    };
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState,
        encrypted: false,
      },
    });
  } catch (error) {
    console.error(`Failed to set the Snap's state`);
  }
}

/**
 * Get the address of the connected wallet.
 * @returns The address of the connected wallet.
 */
export async function getAccount() {
  const accounts = await ethereum.request<string[]>({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0 || !accounts[0]) {
    throw new Error('Something went wrong while getting the account.');
  }

  return accounts[0];
}

/**
 * Get the current chain ID.
 * @returns The current chain ID.
 */
export async function getChainId() {
  const chainId = await ethereum.request<string>({
    method: 'eth_chainId',
  });

  if (!chainId) {
    throw new Error('Something went wrong while getting the chain ID.');
  }

  return chainId;
}
