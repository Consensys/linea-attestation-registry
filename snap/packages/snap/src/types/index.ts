export type RawAttestation = {
  id: string;
  schemaId: string;
  replacedBy: string;
  attester: string;
  portal: string;
  attestedDate: string;
  expirationDate: string;
  revocationDate: string;
  version: string;
  revoked: string;
  subject: string;
  attestationData: string;
  schemaString: string;
  decodedData: string;
};

export type Attestation = {
  id: string;
  content: string;
  from: string;
  attestationDate: number;
  expiryDate: number;
};

export type Portal = {
  id: string;
  description: string;
  isRevocable: string;
  modules: string;
  name: string;
  ownerAddress: string;
  ownerName: string;
};

export type Schema = {
  id: string;
  name: string;
  description: string;
  context: string;
  schema: string;
};

export type Captions = {
  locale: string;
  noAttestations: string;
  detail: {
    caption: string;
    from: string;
    attestedOn: string;
    expiry: string;
    content: string;
  };
};

export type SnapState = {
  captions?: Captions;
  attestations?: Attestation[];
};
