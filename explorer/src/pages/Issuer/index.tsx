import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { APP_ROUTES } from "@/routes/constants";

import { Attestations } from "./components/Attestations";
import { Banner } from "./components/Banner";
import { Description } from "./components/Description";
import { Schemas } from "./components/Schemas";
import { issuersData } from "../Home/data";

export const Issuer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();

  const { name, description, CTALink, CTATitle, logo, logoDark, keywords, address, attestationDefinitions } =
    issuersData.find((issuer) => issuer.address === id) || {};

  const IssuerLogo = isDarkMode && logoDark ? logoDark : logo;

  if (!name || !description || !IssuerLogo || !keywords || !address || !CTATitle) {
    navigate(APP_ROUTES.HOME, { state: { from: location.pathname } });
    return null;
  }

  return (
    <div className="flex flex-col gap-14 md:gap-12 mt-5 md:mt-6 container">
      <Banner name={name} CTALink={CTALink} CTATitle={CTATitle} logo={IssuerLogo} keywords={keywords} />
      <Description description={description} />
      <Attestations address={address} />
      <Schemas issuerSchemas={attestationDefinitions} CTALink={CTALink} />
    </div>
  );
};
