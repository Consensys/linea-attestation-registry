import { t } from "i18next";
import { PropsWithChildren } from "react";

import { ListSwitcher } from "../ListSwitcher";

export const TitleAndSwitcher = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter text-text-primary dark:text-whiteDefault">
          {t("attestation.list.title")}
        </h1>
      </div>
      <div>
        <ListSwitcher />
        {children}
      </div>
    </div>
  );
};
