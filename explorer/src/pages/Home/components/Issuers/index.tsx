import { t } from "i18next";

import { issuersData } from "../../data";
import { Issuer } from "../Issuer";

export const Issuers: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-center text-2xl md:text-[2rem] font-semibold text-blackDefault dark:text-whiteDefault">
          {t("home.issuers.title")}
        </h2>
        <h3 className="w-[30rem] max-w-full m-auto text-center text-base text-text-darkGrey dark:text-tertiary">
          {t("home.issuers.description")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {issuersData.map((issuer) => (
          <Issuer issuer={issuer} key={issuer.address} />
        ))}
      </div>
    </div>
  );
};
