import { Info } from "./components/Info";
import { Issuers } from "./components/Issuers";
import { TitleSearch } from "./components/TitleSearch";

export const Home = () => {
  return (
    <div className="flex flex-col gap-14 md:gap-[4.5rem] container">
      <TitleSearch />
      <Issuers />
      <Info />
    </div>
  );
};
