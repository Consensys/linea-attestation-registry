export interface IIssuer {
  id: string;
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  landingPage: string | null;
}
