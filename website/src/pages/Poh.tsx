import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import "./Poh.css";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export type PohProps = {
  title: string;
};

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

export const Poh: FunctionComponent<PohProps> = ({ title }) => {
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
    document.title = title;
  }, [title]);

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

  const displayName = (name: string) => {
    return name === "Testnet Voyage NFT" ? "Testnet Voyage NFT original recipient" : name;
  };

  const getLink = (link: string) => {
    return link === "https://nomis.cc/linea" ? "https://nomis.cc/linea-voyage" : link;
  };

  const displayPohGroup = (pohGroup?: IssuerAttestation[]) => {
    return (
      <>
        {pohGroup?.map((poh) => (
          <div key={poh.issuerSlugName} className="card">
            {poh.issuerWebsiteUrl !== "" ? (
              <Link to={getLink(poh.issuerWebsiteUrl)} target={"_blank"}>
                {displayName(poh.issuerName)}
              </Link>
            ) : (
              <>{displayName(poh.issuerName)}</>
            )}{" "}
            {poh.validated ? (
              <FontAwesomeIcon size={"lg"} color={"green"} icon={faCheck} />
            ) : (
              <FontAwesomeIcon size={"lg"} color={"red"} icon={faXmark} />
            )}
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
          <div className="card">
            <p style={{ margin: 0 }}>
              Proof of Humanity for the Linea DeFi Voyage uses Verax as the underlying infrastructure.
            </p>
            <p style={{ margin: 0 }}>In order to be able to verify your humanity:</p>
            <p style={{ margin: 0 }}>a. Receive ONE attestation from a partner of Group 1</p>
            <p style={{ margin: 0 }}>b. Receive TWO attestations from partners of Group 2</p>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <h2>
              Global POH status{" "}
              {isPoh ? (
                <FontAwesomeIcon size={"lg"} color={"green"} icon={faCheck} />
              ) : (
                <FontAwesomeIcon size={"lg"} color={"red"} icon={faXmark} />
              )}
            </h2>
          </div>

          <div className="responsive-two-column-grid">
            <div>
              <div className="card" style={{ padding: 0 }}>
                <h2>Group 1</h2>
              </div>
              {displayPohGroup(pohGroupA)}
            </div>
            <div>
              <div className="card" style={{ padding: 0 }}>
                <h2>Group 2</h2>
              </div>
              {displayPohGroup(pohGroupB)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Poh;
