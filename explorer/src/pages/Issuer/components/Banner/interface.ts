export interface IBannerProps {
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  landingPage?: string | null;
}
