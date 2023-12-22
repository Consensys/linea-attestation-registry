import { ConnectKitButton } from "connectkit";
import React from "react";
import "./ConnectWallet.css";

const ConnectWallet: React.FC = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button className="connect-wallet" onClick={show}>
            {isConnected ? ensName ?? truncatedAddress : "CONNECT WALLET"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWallet;
