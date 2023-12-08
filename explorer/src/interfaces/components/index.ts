export interface NavigationProps {
  name: string;
  route?: string;
  submenu?: JSX.Element;
}

export type Page = "schema" | "portal" | "attestation" | "module";

export type ColonsOptions = Record<
  number,
  Partial<{ width: number; minWidth: number; maxWidth: number; isRandomWidth: boolean }>
>;
