import { useState } from "react";
import veraxLogo from "./assets/verax-logo-circle.svg";
import "./App.css";
import { ConnectKitButton } from "connectkit";
import VeraxSdk from "@verax-attestation-registry/verax-sdk";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attestations, setAttestations] = useState<any[]>([]);
  const [attestationsCounter, setAttestationsCounter] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getSomeAttestations = async () => {
    const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND);
    setAttestations(await veraxSdk.attestation.findBy(2));
  };
  const getAttestationCounter = async () => {
    const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND);
    setAttestationsCounter((await veraxSdk.utils.getAttestationIdCounter()) as number);
  };

  const createAnAttestation = async () => {
    const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND);
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
      setError(`Oops, something went wrong: ${e.message}`);
    }
  };

  return (
    <>
      <div>
        <a href="https://verax.gitbook.io/verax/" target="_blank">
          <img src={veraxLogo} className="logo" alt="Verax logo" />
        </a>
      </div>
      <h1>Verax Attestation Registry</h1>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectKitButton />
      </div>
      <div className="card">
        <button onClick={getSomeAttestations}>Get 2 attestations from the subgraph</button>
        {attestations.length > 0 && (
          <ul>
            {attestations.map((attestation) => (
              <li key={attestation.id}>{attestation.id}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="card">
        <button onClick={getAttestationCounter}>Count attestations from the contract</button>
        {attestationsCounter > 0 && <p>{`We have ${attestationsCounter} attestations at the moment`}</p>}
      </div>
      <div className="card">
        <button onClick={createAnAttestation}>Create an attestation via a Portal</button>
        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <p className="read-the-docs">Click on the Verax logo to learn more</p>
    </>
  );
}

export default App;
