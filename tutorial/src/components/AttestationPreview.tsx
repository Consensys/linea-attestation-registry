import { type Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useEffect, useState } from "react";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import "./AttestationPreview.css";

export type AttestationPreviewProps = {
  veraxSdk: VeraxSdk;
  attestationId: string;
};

const AttestationPreview = ({ veraxSdk, attestationId }: AttestationPreviewProps) => {
  const [attestation, setAttestation] = useState<Attestation>();

  useEffect(() => {
    const fetchAttestation = async () => {
      const attestation = (await veraxSdk.attestation.getAttestation(attestationId)) as Attestation;
      setAttestation(attestation);
    };

    fetchAttestation();
  }, [attestationId, veraxSdk.attestation]);

  return (
    <div className={"attestation-preview"}>
      <JsonView
        data={
          attestation
            ? JSON.parse(
                JSON.stringify(attestation, (_key, value) => (typeof value === "bigint" ? value.toString() : value)),
              )
            : {}
        }
        shouldExpandNode={allExpanded}
        style={darkStyles}
      />
    </div>
  );
};

export default AttestationPreview;
