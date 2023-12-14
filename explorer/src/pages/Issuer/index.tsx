import { useNavigate, useParams } from "react-router-dom";

import { APP_ROUTES } from "@/routes/constants";

import { Banner } from "./components/Banner";
import { Description } from "./components/Description";
import { issuersData } from "../Home/data";

export const Issuer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { name, description, landingPage, logo } = issuersData.find((issuer) => issuer.id === id) || {};

  if (!name || !description || !logo) {
    navigate(APP_ROUTES.HOME);
    return null;
  }

  return (
    <div className="flex flex-col px-5 md:px-14 xl:px-[60px] gap-14 md:gap-12 mt-5 md:mt-6 mb-14 md:mb-[4.5rem]">
      <Banner name={name} landingPage={landingPage} logo={logo} />
      <Description description={description} />
      {/* TODO: uncomment when data will be available */}
      {/* <Portals /> */}
    </div>
  );
};
