import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useState } from "react";
import { type Hex } from "viem";
import { useConnection } from "wagmi";

export type CreatePortalProps = {
  veraxSdk: VeraxSdk;
  getTxHash: (hash: Hex) => void;
};

const CreatePortal = ({ veraxSdk, getTxHash }: CreatePortalProps) => {
  const [txHash, setTxHash] = useState<Hex>();
  const [error, setError] = useState<string>("");

  const { isConnected } = useConnection();

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
        setError("Oops, something went wrong!");
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
      <button onClick={createPortal} disabled={!isConnected}>
        Send transaction
      </button>
      {txHash && <p>{`Transaction with hash ${txHash} sent!`}</p>}
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default CreatePortal;
