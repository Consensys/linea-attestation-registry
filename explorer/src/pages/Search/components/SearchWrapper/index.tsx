import { SearchWrapperProps } from "../interfaces";

export const SearchWrapper: React.FC<SearchWrapperProps> = ({ title, items, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl text-text-primary font-semibold dark:text-whiteDefault">{`${items} ${title}`}</p>
      {children}
    </div>
  );
};
