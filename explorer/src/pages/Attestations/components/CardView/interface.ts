import { Portal, Schema } from "@verax-attestation-registry/verax-sdk";

export interface ICardViewProps {
  attestationsList: Array<{
    id: string;
    schema: Schema;
    portal: Portal;
    attestedDate: number;
    expirationDate?: number;
    revoked: boolean;
  }>;
}
