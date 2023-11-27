import { useState } from "react";
import "./Poh.css";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import { useAccount } from "wagmi";

function Poh() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [poh, setPoh] = useState<any[]>();
  const [isPoh, setIsPoh] = useState<boolean>();
  const [didCallPoh, setDidCallPoh] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  const getMyPoh = async () => {
    const { data } = await axios.get(
      `https://linea-xp-poh-api.dev.linea.build/poh/${address}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    setDidCallPoh(true);
    setIsPoh(data.poh);
    setPoh(data.attestations);
  };

  return (
    <>
      <h1>Linea - POH</h1>
      <p>To check your Proof-of-Humanity status: connect your wallet then click on "Get my POH status".</p>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectKitButton />
      </div>

      {isConnected &&
        <div className="card">
          <button onClick={getMyPoh}>Get my POH status</button>
        </div>
      }

      {didCallPoh &&
        <div className="card">
          POH status: {isPoh ? `✅` : `❌`}
        </div>
      }

      {poh?.map((poh, index) => (<div key={`${poh.issuerSlugName}-${index}`} className="card">
        {poh.issuerName}: {poh.validated ? `✅` : `❌`}
      </div>))
      }
    </>
  );
}

export default Poh;
