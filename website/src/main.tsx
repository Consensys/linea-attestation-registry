<<<<<<< HEAD:explorer/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes';

import './index.css';
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createConfig, WagmiConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { linea, lineaTestnet } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    appName: "Verax Website",
    chains: [linea, lineaTestnet],
  }),
);
>>>>>>> a464ff0bb67bfecb1e815a72d6c269e50b559ffb:website/src/main.tsx

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
