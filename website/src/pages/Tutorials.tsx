import { type FunctionComponent, useEffect, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount, useNetwork } from "wagmi";
import ConnectWallet from "../components/ConnectWallet.tsx";
import IssueAttestation from "../components/IssueAttestation.tsx";
import AttestationPreview from "../components/AttestationPreview.tsx";
import { waitForTransactionReceipt } from "viem/actions";
import { Address, getPublicClient } from "@wagmi/core";
import CreateSchema from "../components/CreateSchema.tsx";
import CreatePortal from "../components/CreatePortal.tsx";
import { decodeEventLog, parseAbi } from "viem";

export type SDKDemoProps = {
  title: string;
};

const Tutorials: FunctionComponent<SDKDemoProps> = ({ title }) => {
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [schemaId, setSchemaId] = useState<Address>();
  const [portalId, setPortalId] = useState<Address>();
  const [attestationId, setAttestationId] = useState<string>();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (chain && address) {
      const sdkConf =
        chain.id === 59144 ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
      const sdk = new VeraxSdk(sdkConf, address);
      setVeraxSdk(sdk);
    }
  }, [chain, address]);

  const handleSchemaTx = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(getPublicClient(), {
      hash,
    });
    setSchemaId(receipt.logs[0].topics[1]);
  };

  const handlePortalTx = async (hash: Address) => {
    const receipt = await waitForTransactionReceipt(getPublicClient(), {
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
    const receipt = await waitForTransactionReceipt(getPublicClient(), {
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

export default Tutorials;
