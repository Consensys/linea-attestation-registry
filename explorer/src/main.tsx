import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/Main';
import './index.css';
import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';

import { Header } from './components/Header';
import { config } from './config';
import { NetworkContextProvider } from './providers/network-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NetworkContextProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <Header>
            <Main />
          </Header>
        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContextProvider>
  </React.StrictMode>
);
