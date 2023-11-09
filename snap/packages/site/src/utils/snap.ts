import { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (provider?: MetaMaskInpageProvider): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find((snap) => snap.id === defaultSnapOrigin && (!version || snap.version === version));
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  });
};

export const sendTx = async (to: string) => {
  console.log('sendTx to', to);
  await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: await getAccount(0),
        to,
        value: '16345785D8A0000',
      },
    ],
  });
};

async function getAccount(id: number) {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err) => {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to MetaMask.');
    } else {
      console.error(err);
    }
  });
  return accounts[id];
}

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
