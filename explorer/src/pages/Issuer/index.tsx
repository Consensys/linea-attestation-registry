import { useNavigate, useParams } from "react-router-dom";

import { APP_ROUTES } from "@/routes/constants";

import { Banner } from "./components/Banner";
import { Description } from "./components/Description";
import { Portals } from "./components/Portals";
import { issuersData } from "../Home/data";

export const Issuer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { name, description, CTALink, CTATitle, logo, keywords, address } =
    issuersData.find((issuer) => issuer.address === id) || {};

  if (!name || !description || !logo || !keywords || !address || !CTATitle) {
    navigate(APP_ROUTES.HOME);
    return null;
  }

  return (
    <div className="flex flex-col px-5 md:px-14 xl:px-[60px] gap-14 md:gap-12 mt-5 md:mt-6 mb-14 md:mb-[4.5rem]">
      <Banner name={name} CTALink={CTALink} CTATitle={CTATitle} logo={logo} />
      <Description description={description} keywords={keywords} />
      <Portals address={address} />
    </div>
  );
};
