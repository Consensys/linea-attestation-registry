export interface IInfoListItem {
  title: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  url: string;
}

export interface NavigationProps {
  name: string;
  route?: string;
  submenu?: JSX.Element;
}

export type Page = "schema" | "portal" | "attestation" | "module";

export type ColumnsOptions = Record<
  number,
  Partial<{ width: number; minWidth: number; maxWidth: number; isRandomWidth: boolean }>
>;

export interface ResultParseSearch {
  address: Array<string>; // `0x${string}` with 42 characters
  attestationIds: Array<string>; // bigint with 66 characters
  schemasIds: Array<string>; // `0x${string}` with 66 characters
  nameOrDescription: string;
  schema: string;
  schemaString: string;
  urls: Array<string>;
}

export type SearchElementProps = Record<Page, { count: number; loaded: boolean }>;

export interface SearchDataFunction {
  (count: number, loaded: boolean): void;
}
