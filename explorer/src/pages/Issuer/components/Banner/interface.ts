export interface IBannerProps {
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
  CTALink?: string;
  CTATitle: string;
}
