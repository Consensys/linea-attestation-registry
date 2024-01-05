import { Info } from "./components/Info";
import { Issuers } from "./components/Issuers";
import { Jumbotron } from "./components/Jumbotron";

export const Home = () => {
  return (
    <div className="flex flex-col gap-14 md:gap-[4.5rem] container mt-14 md:mt-12">
      <Jumbotron />
      <Issuers />
      <Info />
    </div>
  );
};
