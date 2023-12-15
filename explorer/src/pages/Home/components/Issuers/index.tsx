import { t } from "i18next";

import { issuersData } from "../../data";
import { Issuer } from "../Issuer";

export const Issuers: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <h2 className="text-center text-2xl md:text-[2rem] font-semibold text-blackDefault">{t("home.issuers.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issuersData.map((issuer) => (
          <Issuer issuer={issuer} key={issuer.address} />
        ))}
      </div>
    </div>
  );
};
