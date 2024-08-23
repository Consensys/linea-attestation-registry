import { Address } from "viem";

export interface IIssuer {
  address: Address;
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  logoDark?: React.FC<React.SVGProps<SVGSVGElement>>;
  keywords: string[];
  CTALink?: string;
  CTATitle: string;
  description: string;
  attestationDefinitions: AttestationDefinition[];
}

export interface AttestationDefinition {
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  description: string;
  portal: Address;
  schema: Address;
  url: string;
  chainId: string;
}
