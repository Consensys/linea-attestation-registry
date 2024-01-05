import { t } from "i18next";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { SearchInput } from "@/components/SearchInput";
import { veraxLink } from "@/constants";

export const Jumbotron: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 relative">
      <p className="self-stretch text-text-primary text-2xl not-italic font-medium leading-[102%] tracking-[-0.96px] md:text-4xl lg:text-[2.75rem] md:font-semibold dark:text-whiteDefault">
        {t("home.title")}
      </p>
      <p className="self-stretch text-text-tertiary text-base not-italic font-normal leading-[140%] max-w-[32.5rem]">
        {t("home.description")}
      </p>
      <div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4">
          <Button
            name={t("common.actions.learnMore")}
            handler={() => window.open(veraxLink, "_blank")}
            buttonType={EButtonType.PRIMARY_LIME}
            iconRight={<ArrowUpRight />}
          />
          <p className="text-text-tertiary text-base not-italic font-normal leading-[140%]">
            {t("home.exploreEcosystem")}
          </p>
        </div>
      </div>
      <SearchInput className="md:max-w-full lg:absolute lg:w-[30rem] lg:bottom-0 lg:right-0 xl:w-[35.5625rem]" />
    </div>
  );
};
