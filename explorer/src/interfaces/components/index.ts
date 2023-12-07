export interface NavigationProps {
  name: string;
  route?: string;
  submenu?: JSX.Element;
}

export type Page = "schema" | "portal" | "attestation";
