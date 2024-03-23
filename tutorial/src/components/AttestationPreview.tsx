import { type FunctionComponent, useEffect, useState } from "react";
import "./AttestationPreview.css";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import ReactJson from "react-json-view";

export type SDKDemoProps = {
  veraxSdk: VeraxSdk;
  attestationId: string;
};

const AttestationPreview: FunctionComponent<SDKDemoProps> = ({ veraxSdk, attestationId }) => {
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
      <ReactJson
        src={
          attestation
            ? JSON.parse(
                JSON.stringify(attestation, (_key, value) => (typeof value === "bigint" ? value.toString() : value)),
              )
            : {}
        }
        name={false}
        displayDataTypes={false}
        collapsed={false}
        enableClipboard={false}
        quotesOnKeys={false}
        sortKeys={false}
        theme={"hopscotch"}
        style={{ backgroundColor: "#12172C", padding: "1rem", borderRadius: "0.5rem" }}
      />
    </div>
  );
};

export default AttestationPreview;
