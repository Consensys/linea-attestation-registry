import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { Dispatch, ReactNode, Reducer } from 'react';
import { createContext, useEffect, useReducer, useState } from 'react';

import type { Snap } from '../types';
import { getSnapsProvider, getSnap, isFlask } from '../utils';

export type MetamaskState = {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
};

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<{
  state: MetamaskState;
  dispatch: Dispatch<MetamaskDispatch>;
  provider: MetaMaskInpageProvider | null;
}>({
  state: initialState,
  dispatch: () => {
    /* no op */
  },
  provider: null,
});

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetSnapsDetected = 'SetSnapsDetected',
  SetError = 'SetError',
  SetIsFlask = 'SetIsFlask',
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };

    case MetamaskActions.SetSnapsDetected:
      return {
        ...state,
        snapsDetected: action.payload,
      };
    case MetamaskActions.SetIsFlask:
      return {
        ...state,
        isFlask: action.payload,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getSnapsProvider().then(setProvider).catch(console.error);
  }, []);

  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  useEffect(() => {
    /**
     * Detect if the Snap is installed and set the result it in state.
     */
    async function detectSnapInstalled() {
      dispatch({
        type: MetamaskActions.SetInstalled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        payload: await getSnap(provider!),
      });
    }

    /**
     * Detect if the provider is Flask and set the result it in state.
     */
    async function checkIfFlask() {
      dispatch({
        type: MetamaskActions.SetIsFlask,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        payload: await isFlask(provider!),
      });
    }

    dispatch({
      type: MetamaskActions.SetSnapsDetected,
      payload: provider !== null,
    });

    if (provider) {
      detectSnapInstalled().catch(console.error);
      checkIfFlask().catch(console.error);
    }
  }, [provider]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  return (
    <MetaMaskContext.Provider value={{ state, dispatch, provider }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
