import { PropsWithChildren } from "react";

import { ResultParseSearch, SearchDataFunction } from "@/interfaces/components";

export interface SearchWrapperProps extends PropsWithChildren {
  title: string;
  items: number;
}

export interface SearchComponentProps {
  getSearchData: SearchDataFunction;
  parsedString: Partial<ResultParseSearch>;
  search: string;
}
