import { useEffect, useState } from "react";
import "./Poh.css";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

type IssuerAttestation = {
  validated: boolean;
  issuerName: string;
  issuerSlugName: string;
  issuerDescription: string;
  issuerWebsiteUrl: string;
  issuerLogoUrl: string;
  group: number;
};

type POHResponse = {
  poh: boolean;
  attestations: IssuerAttestation[];
};

function Poh() {
  const [pohGroupA, setPohGroupA] = useState<IssuerAttestation[]>();
  const [pohGroupB, setPohGroupB] = useState<IssuerAttestation[]>();
  const [isPoh, setIsPoh] = useState<boolean>();
  const [didCallPoh, setDidCallPoh] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  const initPage = () => {
    setDidCallPoh(false);
    setIsPoh(false);
    setPohGroupA(undefined);
    setPohGroupB(undefined);
  };

  useEffect(() => {
    const getMyPoh = async () => {
      const { data } = await axios.get<POHResponse>(`https://linea-xp-poh-api.linea.build/poh/${address}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setDidCallPoh(true);
      setIsPoh(data.poh);
      setPohGroupA(data.attestations.filter((attestation) => attestation.group === 1));
      setPohGroupB(data.attestations.filter((attestation) => attestation.group === 2));
    };

    isConnected && address ? getMyPoh() : initPage();
  }, [isConnected, address]);

  const displayPohGroup = (pohGroup?: IssuerAttestation[]) => {
    return (
      <>
        {pohGroup?.map((poh) => (
          <div key={poh.issuerSlugName} className="card">
            <Link to={poh.issuerWebsiteUrl} target={"_blank"}>
              {poh.issuerName}
            </Link>
            {poh.validated ? ` ✅` : ` ❌`}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <h1>Linea - POH</h1>
      {!didCallPoh && <p>To check your Proof-of-Humanity status, please connect your wallet.</p>}
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectKitButton />
      </div>

      {didCallPoh && (
        <>
          <div className="card">Global POH status {isPoh ? ` ✅` : ` ❌`}</div>

          <div className="responsive-two-column-grid">
            <div>
              <div className="card">Group 1</div>
              {displayPohGroup(pohGroupA)}
            </div>
            <div>
              <div className="card">Group 2</div>
              {displayPohGroup(pohGroupB)}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Poh;
