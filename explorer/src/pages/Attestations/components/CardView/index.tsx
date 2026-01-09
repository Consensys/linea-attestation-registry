import { ICardViewProps } from "./interface";

import { AttestationCard } from "@/pages/Attestation/components/AttestationCard";

export const CardView: React.FC<ICardViewProps> = ({ attestationsList }) => {
  return (
    <div className="flex flex-col gap-14 md:gap-[4.5rem] container mt-14 md:mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {attestationsList?.map((attestation) => {
          return (
            <AttestationCard
              key={attestation.id}
              id={attestation.id}
              schema={attestation.schema}
              portal={attestation.portal}
              issuanceDate={attestation.attestedDate}
              expiryDate={attestation.expirationDate}
              revoked={attestation.revoked}
            />
          );
        })}
      </div>
    </div>
  );
};
