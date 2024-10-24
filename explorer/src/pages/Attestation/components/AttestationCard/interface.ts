export interface IAttestationCardProps {
  id: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  logoDark?: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  description?: string;
  issuerName: string;
  issuanceDate: number;
}
