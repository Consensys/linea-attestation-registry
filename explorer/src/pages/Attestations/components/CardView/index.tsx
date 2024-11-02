import { AttestationCard } from "@/pages/Attestation/components/AttestationCard";

import { ICardViewProps } from "./interface";

export const CardView: React.FC<ICardViewProps> = ({ attestationsList }) => {
  return (
    <div className="flex flex-col gap-14 md:gap-[4.5rem] container mt-14 md:mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {attestationsList?.map((attestation) => {
          return (
            <AttestationCard
              key={attestation.id}
              id={attestation.id}
              schemaId={attestation.schema.id}
              portalId={attestation.portal.id}
              issuanceDate={attestation.attestedDate}
              expiryDate={attestation.expirationDate}
            />
          );
        })}
      </div>
    </div>
  );
};
