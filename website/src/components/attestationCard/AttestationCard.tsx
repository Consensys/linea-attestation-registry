import React from "react";
import { IssuerAttestation } from "../../types";
import "./AttestationCard.css";
import { Link } from "react-router-dom";
import clique from "../../assets/attestations/clique.png";
import dauthOpenid3 from "../../assets/attestations/openid3.png";
import gitcoinPassport from "../../assets/attestations/gitcoin-passport.png";
import nomis from "../../assets/attestations/nomis.png";
import padoLabs from "../../assets/attestations/pado-labs.png";
import trustaPoh from "../../assets/attestations/trusta.png";
import trustaReputation from "../../assets/attestations/trusta.png";
import voyageNft from "../../assets/attestations/voyage-nft.png";
import zkPassCoinbaseKyc from "../../assets/attestations/zkPass.png";
import zkPassOkxKyc from "../../assets/attestations/zkPass.png";
import zkPassUberTrips from "../../assets/attestations/zkPass.png";
import zeroXScore from "../../assets/attestations/0xscore.png";

const LOGOS = {
  clique: clique,
  "dauth-openid3": dauthOpenid3,
  "gitcoin-passport": gitcoinPassport,
  nomis: nomis,
  "pado-labs": padoLabs,
  "trusta-poh-attestation": trustaPoh,
  "trusta-reputation-attestation": trustaReputation,
  "voyage-nft": voyageNft,
  "zk-pass-coinbase-kyc": zkPassCoinbaseKyc,
  "zk-pass-okx-kyc": zkPassOkxKyc,
  "zk-pass-uber-trips": zkPassUberTrips,
  "0x-score": zeroXScore,
};

const displayName = (name: string) => {
  return name === "Testnet Voyage NFT" ? "Testnet Voyage NFT original recipient" : name;
};

const getLink = (link: string) => {
  return link === "https://nomis.cc/linea" ? "https://nomis.cc/linea-voyage" : link;
};

const AttestationCard: React.FC<IssuerAttestation> = (props) => {
  const { issuerLogoUrl, issuerName, issuerWebsiteUrl, issuerSlugName, validated } = props;

  return (
    <div className={`attestation_card ${validated ? "attestation_card-validated" : ""}`}>
      <Link to={getLink(issuerWebsiteUrl)} target="_blank" className="attestation_card-name">
        {displayName(issuerName)}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.5837 3.14175L10.2789 0.83695L3.41964 0.836914L3.41963 2.59727L9.54972 2.5973L9.56426 2.61183L0.58371 11.5924L1.82847 12.8371L10.809 3.85659L10.8233 3.87091V9.95027L12.5837 9.95027V3.14175Z"
            fill="#C0C0C0"
          />
        </svg>
      </Link>
      <div className={`attestation_card-logo ${LOGOS[issuerSlugName as keyof typeof LOGOS] ? "static-image" : ""}`}>
        <img src={LOGOS[issuerSlugName as keyof typeof LOGOS] || issuerLogoUrl} alt={issuerName} />
      </div>
    </div>
  );
};

export default AttestationCard;
