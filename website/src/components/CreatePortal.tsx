import { type FunctionComponent, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount } from "wagmi";
import { Hex } from "viem";

export type SDKDemoProps = {
  veraxSdk: VeraxSdk;
  getTxHash: (hash: Hex) => void;
};

const CreatePortal: FunctionComponent<SDKDemoProps> = ({ veraxSdk, getTxHash }) => {
  const [txHash, setTxHash] = useState<Hex>();
  const [error, setError] = useState<string>("");

  const { isConnected } = useAccount();

  const createPortal = async () => {
    try {
      const receipt = await veraxSdk.portal.deployDefaultPortal(
        [],
        "Tutorial Portal",
        "This Portal is used for the tutorial",
        true,
        "Verax Tutorial",
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
  };

  return (
    <>
      <button onClick={createPortal} disabled={!isConnected || !txHash}>
        Send transaction
      </button>
      {txHash && <p>{`Transaction with hash ${txHash} sent!`}</p>}
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default CreatePortal;
