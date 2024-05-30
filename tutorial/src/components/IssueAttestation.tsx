import { type FunctionComponent, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount } from "wagmi";
import { Address, Hex } from "viem";

export type SDKDemoProps = {
  veraxSdk: VeraxSdk;
  getTxHash: (hash: Hex) => void;
  schemaId: Address;
  portalId: Address;
};

const IssueAttestation: FunctionComponent<SDKDemoProps> = ({ veraxSdk, getTxHash, schemaId, portalId }) => {
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { address, isConnected } = useAccount();

  const issueAttestation = async () => {
    if (address) {
      try {
        const receipt = await veraxSdk.portal.attest(
          portalId,
          {
            schemaId,
            expirationDate: Math.floor(Date.now() / 1000) + 2592000,
            subject: address,
            attestationData: [{ hasCompletedTutorial: true }],
          },
          [],
        );
        if (receipt.transactionHash) {
          setTxHash(receipt.transactionHash);
          getTxHash(receipt.transactionHash);
        } else {
          setError(`Oops, something went wrong!`);
        }
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          setError(`Oops, something went wrong: ${e.message}`);
        }
      }
    }
  };

  return (
    <>
      <button onClick={issueAttestation} disabled={!isConnected}>
        Send transaction
      </button>
      {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default IssueAttestation;
