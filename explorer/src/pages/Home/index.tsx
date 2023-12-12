import { Info } from "./components/Info";
import { Issuers } from "./components/Issuers";
import { TitleSearch } from "./components/TitleSearch";

export const Home = () => {
  return (
    <div className="flex flex-col px-5 md:px-14 xl:px-[60px] gap-14 md:gap-[4.5rem]">
      <TitleSearch />
      <Issuers />
      <Info />
    </div>
  );
};
