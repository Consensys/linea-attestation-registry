import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/Main';
import './index.css';
import { createConfig, WagmiConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { lineaTestnet } from 'wagmi/chains';
import { Header } from './components/Header';

const chains = [lineaTestnet];

const config = createConfig(
  getDefaultConfig({
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
    appName: 'Verax Explorer',
    chains,
  })
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <Header>
          <Main />
        </Header>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
