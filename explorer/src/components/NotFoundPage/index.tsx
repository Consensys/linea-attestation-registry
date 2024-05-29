import { t } from "i18next";
import { ChevronLeft } from "lucide-react";

import archive from "@/assets/icons/archive.svg";
import { Link } from "@/components/Link";
import { displayAmountWithComma } from "@/utils/amountUtils";

import { NotFoundPageProps } from "./interfaces";
import { getNotFoundPageData } from "./utils";

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ id, page }) => {
  const pageData = getNotFoundPageData(page, id);
  const decodedId = typeof pageData.id === "string" ? pageData.id : displayAmountWithComma(pageData.id);
  return (
    <section className="container flex justify-center px-4">
      <div className="flex flex-col max-w-[1200px] w-full h-[644px] items-center justify-center gap-6 border border-solid mt-8 rounded-3xl">
        <img src={archive} className="!h-[32px] !w-[32px]" />
        <p className="flex gap-1 font-medium text-base text-center text-text-darkGrey">
          <span>{pageData.title}</span>
          {pageData.showId && (
            <span className="max-w-[100px] md:max-w-[200px] text-text-darkBlue overflow-hidden text-ellipsis dark:text-white">
              {decodedId}
            </span>
          )}
          <span>{t("common.messages.hasntBeenFound")}</span>
        </p>
        <Link
          to={pageData.to}
          className="flex gap-2 border border-solid rounded-md px-4 py-3 border-button-secondary-border hover:border-button-secondary-hover dark:text-white"
        >
          <ChevronLeft width={24} height={24} />
          {t("common.actions.goBackTo", { to: page })}
        </Link>
      </div>
    </section>
  );
};
