import { Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { ArrowRight } from "lucide-react";

import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { toSchemaById } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

export const AttestationSchemaCard: React.FC<{ schema: Schema }> = ({ schema }) => {
  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <header className="justify-start items-center gap-2 inline-flex">
        <HelperIndicator type="schema" />
        <div className="text-text-primary dark:text-whiteDefault text-base font-semibold">{t("schema.title")}</div>
      </header>
      <div className="w-full flex-col justify-start items-start gap-3 flex">
        <div className="w-full justify-between items-start inline-flex text-text-secondary dark:text-text-secondaryDark text-base font-medium">
          <div>{schema.name}</div>
          <Link to={toSchemaById(schema.id)} className="hover:underline">
            {cropString(schema.id)}
          </Link>
        </div>
        <div className="text-text-tertiary dark:text-tertiary text-sm font-normal leading-tight">
          {schema.description}
        </div>
      </div>
      <Link
        to={toSchemaById(schema.id)}
        className="flex gap-2 text-text-primary dark:text-whiteDefault text-sm font-semibold hover:underline items-center"
      >
        {t("common.actions.details")}
        <ArrowRight width={16} height={16} />
      </Link>
    </div>
  );
};
