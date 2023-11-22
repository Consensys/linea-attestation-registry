import {
  createBrowserRouter,
} from "react-router-dom";

import { Providers } from "@/providers";
import { Main } from "@/pages/Main";
import { Attestations } from "@/pages/Attestations";
import { AttestationById } from "@/pages/AttestationById";

import { APP_ROUTES } from "./constants";

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <Providers />,
    children: [
      {
        path: APP_ROUTES.HOME,
        element: <Main />
      },
      {
        path: APP_ROUTES.ATTESTATIONS,
        element: <Attestations />
      },
      {
        path: APP_ROUTES.ATTESTATION_BY_ID,
        element: <AttestationById />
      },
    ]
  },
]);
