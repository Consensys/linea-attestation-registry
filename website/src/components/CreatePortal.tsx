import { type FunctionComponent, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount } from "wagmi";

export type SDKDemoProps = {
  veraxSdk: VeraxSdk;
  getTxHash: (hash: `0x${string}`) => void;
};

const CreatePortal: FunctionComponent<SDKDemoProps> = ({ veraxSdk, getTxHash }) => {
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { isConnected } = useAccount();

  const createPortal = async () => {
    try {
      const hash = await veraxSdk.portal.deployDefaultPortal(
        [],
        "Tutorial Portal",
        "This Portal is used for the tutorial",
        true,
        "Verax Tutorial",
      );
      setTxHash(hash);
      getTxHash(hash);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setError(`Oops, something went wrong: ${e.message}`);
      }
    }
  };

  return (
    <>
      <button onClick={createPortal} disabled={!isConnected && txHash !== ""}>
        Send transaction
      </button>
      {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default CreatePortal;
