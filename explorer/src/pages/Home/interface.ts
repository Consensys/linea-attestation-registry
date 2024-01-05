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
}
