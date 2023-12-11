import { Route, createHashRouter, createRoutesFromElements } from "react-router-dom";

import { Attestation } from "@/pages/Attestation";
import { Attestations } from "@/pages/Attestations";
import { Home } from "@/pages/Home";
import { Module } from "@/pages/Module";
import { Modules } from "@/pages/Modules";
import { MyAttestations } from "@/pages/MyAttestations";
import { Schema } from "@/pages/Schema";
import { Schemas } from "@/pages/Schemas";
import { Providers } from "@/providers";
import { loaderNetworkProvider } from "@/providers/network-provider/loader";

import { APP_ROUTES } from "./constants";
import { NotFoundPage } from "./NotFoundPage";

export const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<Providers />} loader={loaderNetworkProvider}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.ATTESTATIONS} element={<Attestations />} />
      <Route path={APP_ROUTES.MY_ATTESTATIONS} element={<MyAttestations />} />
      <Route path={APP_ROUTES.ATTESTATION_BY_ID} element={<Attestation />} />
      <Route path={APP_ROUTES.SCHEMAS} element={<Schemas />} />
      <Route path={APP_ROUTES.SCHEMA_BY_ID} element={<Schema />} />
      <Route path={APP_ROUTES.MODULES} element={<Modules />} />
      <Route path={APP_ROUTES.MODULES_BY_ID} element={<Module />} />
      <Route path={APP_ROUTES.DEFAULT} element={<NotFoundPage />} />
    </Route>,
  ),
);
