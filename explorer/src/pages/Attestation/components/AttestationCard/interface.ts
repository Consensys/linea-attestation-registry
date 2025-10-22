import { Portal, Schema } from "@verax-attestation-registry/verax-sdk";

export interface IAttestationCardProps {
  id: string;
  schema: Schema;
  portal: Portal;
  issuanceDate: number;
  expiryDate?: number;
  revoked: boolean;
}
