import { useEffect, useState } from "react";
import "./SDKDemo.css";
import { ConnectKitButton } from "connectkit";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount, useNetwork } from "wagmi";

function SDKDemo() {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [attestationsCounter, setAttestationsCounter] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain && address) {
      const sdkConf = chain.id === 59144 ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
      const sdk = new VeraxSdk(sdkConf, address);
      setVeraxSdk(sdk);
    }
  }, [chain, address]);

  const shortenHexString = (longString: string) => {
    return `${longString.slice(0, 5)}...${longString.slice(longString.length - 4, longString.length)}`;
  };

  const getSomeAttestations = async () => {
    if (veraxSdk) {
      setAttestations(await veraxSdk.attestation.findBy(2, 1234));
    } else {
      console.error("SDK not instantiated");
    }
  };

  const getAttestationCounter = async () => {
    if (veraxSdk) {
      setAttestationsCounter((await veraxSdk.utils.getAttestationIdCounter()) as number);
    } else {
      console.error("SDK not instantiated");
    }
  };

  const createAnAttestation = async () => {
    if (veraxSdk) {
      try {
        const hash = await veraxSdk.portal.attest(
          "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
          {
            schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
            expirationDate: 1693583329,
            subject: "0x068579b2398992629df8dDbcB048D26d863f7A70",
            attestationData: [{ isBuidler: true }],
          },
          [],
        );
        setTxHash(hash);
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          setError(`Oops, something went wrong: ${e.message}`);
        }
      }
    } else {
      console.error("SDK not instantiated");
    }
  };


  return (
    <>
      <h1>Verax - SDK Demo</h1>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectKitButton />
      </div>

      <div className="card">
        <button onClick={getSomeAttestations}>Get 2 attestations from the subgraph</button>
        {attestations.length > 0 && (
          <>
            {attestations.map((attestation) => (
              <pre
                key={attestation.id}>ID = {shortenHexString(attestation.id)} - Subject = {shortenHexString(attestation.subject)}</pre>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <button onClick={getAttestationCounter}>Count attestations from the contract</button>
        {attestationsCounter > 0 && <p>{`We have ${attestationsCounter} attestations at the moment`}</p>}
      </div>

      <div className="card">
        <button onClick={createAnAttestation} disabled={!isConnected}>Create an attestation via a Portal</button>
        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}

export default SDKDemo;
