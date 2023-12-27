import { t } from "i18next";
import { FileText } from "lucide-react";

import VeraxIcon from "@/assets/icons/verax.svg?react";

export const infoData = [
  {
    icon: <FileText />,
    title: t("home.info.issueYourAttestation"),
    button: {
      name: t("common.actions.getStarted"),
      url: "https://github.com/Consensys/linea-attestation-registry",
    },
    additionalClass: "bg-surface-secondary dark:bg-surface-secondaryDark",
  },
  {
    icon: <VeraxIcon className="h-6 w-6 dark:[&>path]:fill-whiteDefault" />,
    title: t("home.info.aboutVerax"),
    button: {
      name: t("common.actions.learnMore"),
      url: "https://docs.ver.ax/verax-documentation/",
    },
    additionalClass: "bg-surface-darkGrey dark:bg-surface-darkGreyDark",
  },
];
