import { t } from "i18next";

import { APP_ROUTES } from "@/routes/constants";

export const options = [
  {
    to: APP_ROUTES.ATTESTATIONS,
    text: t("attestation.list.switch.all"),
  },
  {
    to: APP_ROUTES.MY_ATTESTATIONS,
    text: t("attestation.list.switch.my"),
  },
];
