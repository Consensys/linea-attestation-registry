import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { Providers } from "@/providers";
import { Home } from "@/pages/Home";
import { Attestations } from "@/pages/Attestations";
import { Attestation } from "@/pages/Attestation";
import { loaderNetworkProvider } from "@/providers/network-provider/loader";

import { APP_ROUTES } from "./constants";
import { NotFoundPage } from "./NotFoundPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />} loader={loaderNetworkProvider}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.ATTESTATIONS} element={<Attestations />} />
      <Route path={APP_ROUTES.ATTESTATION_BY_ID} element={<Attestation />} />
      <Route path={APP_ROUTES.DEFAULT} element={<NotFoundPage />} />
    </Route>,
  ),
);
