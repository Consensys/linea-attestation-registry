import { t } from "i18next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Trans } from "react-i18next";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { Link } from "@/components/Link";
import { SearchInput } from "@/components/SearchInput";
import { veraxLink } from "@/constants";
import { APP_ROUTES } from "@/routes/constants";

export const Jumbotron: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_min-content] lg:auto-rows-auto">
      <p className="self-stretch text-text-primary text-[2rem] font-medium leading-[110%] lg:leading-[3rem] md:text-4xl lg:text-[2.75rem] md:font-semibold dark:text-whiteDefault lg:col-span-2">
        {t("home.title")}
      </p>
      <p className="self-stretch text-text-tertiary text-base not-italic font-normal leading-[140%] max-w-[32.5rem] lg:row-start-2">
        {t("home.description")}
      </p>
      <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4 lg:col-start-1 lg:row-start-3">
        <Button
          name={t("common.actions.learnMore")}
          handler={() => window.open(veraxLink, "_blank")}
          buttonType={EButtonType.PRIMARY_LIME}
          iconRight={<ArrowUpRight />}
          height="h-10"
        />
        <p className="text-text-tertiary text-base not-italic font-normal leading-[140%]">
          <Trans i18nKey="home.exploreEcosystem" components={{ bold: <strong /> }} />
        </p>
      </div>
      <SearchInput
        className="mt-2 pl-2 pr-1 py-2 md:max-w-full lg:w-[30rem] lg:mt-0 lg:col-start-2 lg:row-start-2 xl:w-[35.5625rem] lg:justify-self-end"
        height="h-10"
      />
      <Link
        to={APP_ROUTES.MY_ATTESTATIONS}
        className="flex w-fit justify-center items-center gap-2 rounded-md text-text-tertiary text-base not-italic font-semibold lg:row-start-3 lg:justify-self-end transition-opacity hover:underline hover:opacity-80"
      >
        {t("common.actions.viewMyAttestations")}
        <ChevronRight />
      </Link>
    </div>
  );
};
