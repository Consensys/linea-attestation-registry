import React, { useEffect, useState } from "react";
import "./Poh.css";
import axios from "axios";
import { useAccount } from "wagmi";
import Hero from "../components/hero/Hero";
import { IssuerAttestation } from "../types";
import AttestationCard from "../components/attestationCard/AttestationCard";

type POHResponse = {
  poh: boolean;
  attestations: IssuerAttestation[];
};

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

type Props = {
  title: string;
};

const Poh: React.FC<Props> = ({ title }) => {
  const [pohGroupA, setPohGroupA] = useState<IssuerAttestation[]>([]);
  const [pohGroupB, setPohGroupB] = useState<IssuerAttestation[]>([]);
  const [isPoh, setIsPoh] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const getMyPoh = async () => {
      const { data } = await axios.get<POHResponse>(
        `https://linea-xp-poh-api.linea.build/poh/${address || DEFAULT_ADDRESS}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setIsPoh(data.poh);
      setPohGroupA(data.attestations.filter((attestation) => attestation.group === 1));
      setPohGroupB(data.attestations.filter((attestation) => attestation.group === 2));
    };

    getMyPoh();
  }, [isConnected, address]);

  const displayPohGroup = (pohGroup?: IssuerAttestation[]) => {
    return (
      <div className="poh-group-grid">
        {pohGroup?.map((poh) => (
          <AttestationCard {...poh} key={poh.issuerSlugName} />
        ))}
      </div>
    );
  };

  return (
    <div className="page_poh">
      <Hero />

      <div className="container poh-body">
        <div className="poh_introduction">
          <h2>Linea Proof of Humanity Providers</h2>
          <p>
            In order to complete PoH, your account must complete one (1) attestation from Group A and two (2)
            attestations from Group B.
          </p>
        </div>
        {isConnected && (
          <div className="did-call-poh">
            <div className="poh_status-wrapper">
              <span>Your status: </span>
              <span className={`poh_status ${isPoh ? "poh_true" : "poh_false"}`}>{isPoh ? "True" : "False"}</span>
            </div>
          </div>
        )}

        <div className="poh-group">
          <h3 className="poh-group-name">
            <span>Group A |</span> Complete One Attestation
          </h3>
          {displayPohGroup(pohGroupA)}
        </div>
        <div className="poh-group">
          <h3 className="poh-group-name">
            <span>Group B |</span> Complete Two Attestations
          </h3>
          {displayPohGroup(pohGroupB)}
        </div>

        <p className="poh-learn-more">
          To learn more about Linea Voyage XP, Proof of Humanity, and Wallet Account Binding, read the FAQ{" "}
          <a href="https://linea.mirror.xyz/Q5uHbOJFPqwVjKTTwv1g8X08FIr-hrGGGSVcfrE5Rb0" target="_blank">
            here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Poh;
