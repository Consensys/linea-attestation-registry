import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useEffect, useMemo, useState } from "react";
import { type Address, decodeEventLog, parseAbi } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { useConnection } from "wagmi";

import AttestationPreview from "../components/AttestationPreview.tsx";
import ConnectWallet from "../components/ConnectWallet.tsx";
import CreatePortal from "../components/CreatePortal.tsx";
import CreateSchema from "../components/CreateSchema.tsx";
import IssueAttestation from "../components/IssueAttestation.tsx";
import { wagmiAdapter } from "../wagmiConfig.ts";

export type HomeProps = {
  title: string;
};

const Home = ({ title }: HomeProps) => {
  const [schemaId, setSchemaId] = useState<Address>();
  const [portalId, setPortalId] = useState<Address>();
  const [attestationId, setAttestationId] = useState<string>();

  const { address, isConnected, chain } = useConnection();

  useEffect(() => {
    document.title = title;
  }, [title]);

  const veraxSdk = useMemo(() => {
    if (!chain || !address) return undefined;
    let sdkConf;
    switch (chain.id) {
      case 84532:
        sdkConf = VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND;
        break;
      case 59141:
        sdkConf = VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND;
        break;
      case 421614:
        sdkConf = VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND;
        break;
      case 97:
        sdkConf = VeraxSdk.DEFAULT_BSC_TESTNET_FRONTEND;
        break;
      default:
        sdkConf = VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND;
        break;
    }
    return new VeraxSdk(sdkConf, address);
  }, [chain, address]);

  const handleSchemaTx = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig.getClient(), {
      hash,
    });
    setSchemaId(receipt.logs[0].topics[1]);
  };

  const handlePortalTx = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig.getClient(), {
      hash,
    });
    const decodedLogs = decodeEventLog({
      abi: parseAbi(["event PortalRegistered(string name, string description, address portalAddress)"]),
      data: receipt.logs[0].data,
      topics: receipt.logs[0].topics,
    });
    setPortalId(decodedLogs.args.portalAddress);
  };

  const handleAttestationTx = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig.getClient(), {
      hash,
    });
    setAttestationId(receipt.logs[0].topics[1]);
  };

  return (
    <>
      <h1>1. Connect your wallet</h1>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectWallet />
      </div>

      {veraxSdk && isConnected && (
        <>
          <h1>2. Create a Schema</h1>
          <div className="card">
            <CreateSchema veraxSdk={veraxSdk} getTxHash={handleSchemaTx} getSchemaId={setSchemaId} />
          </div>
        </>
      )}

      {veraxSdk && schemaId && (
        <>
          <h1>3. Create a Portal</h1>
          <div className="card">
            <CreatePortal veraxSdk={veraxSdk} getTxHash={handlePortalTx} />
          </div>
        </>
      )}

      {veraxSdk && schemaId && portalId && (
        <>
          <h1>4. Issue an attestation</h1>
          <div className="card">
            <IssueAttestation
              veraxSdk={veraxSdk}
              getTxHash={handleAttestationTx}
              schemaId={schemaId}
              portalId={portalId}
            />
          </div>
        </>
      )}

      {veraxSdk && attestationId && (
        <>
          <h1>5. Check the issued attestation</h1>
          <div className="card">
            {attestationId ? (
              <AttestationPreview veraxSdk={veraxSdk} attestationId={attestationId} />
            ) : (
              <p>Send the transaction and wait for it to be confirmed</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
