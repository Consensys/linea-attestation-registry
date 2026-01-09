import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import { APP_ROUTES } from "./constants";
import { LineaRedirect } from "./LineaRedirect";
import { NotFoundPage } from "./NotFoundPage";

import { Attestation } from "@/pages/Attestation";
import { Attestations } from "@/pages/Attestations";
import { Home } from "@/pages/Home";
import { Issuer } from "@/pages/Issuer";
import { Module } from "@/pages/Module";
import { Modules } from "@/pages/Modules";
import { MyAttestations } from "@/pages/MyAttestations";
import { Portal } from "@/pages/Portal";
import { Schema } from "@/pages/Schema";
import { Schemas } from "@/pages/Schemas";
import { Search } from "@/pages/Search";
import { Subject } from "@/pages/Subject";
import { Providers } from "@/providers";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.ISSUER_BY_ID} element={<Issuer />} />
      <Route path={APP_ROUTES.ATTESTATIONS} element={<Attestations />} />
      <Route path={APP_ROUTES.MY_ATTESTATIONS} element={<MyAttestations />} />
      <Route path={APP_ROUTES.ATTESTATIONS_BY_SUBJECT} element={<Subject />} />
      <Route path={APP_ROUTES.ATTESTATION_BY_ID} element={<Attestation />} />
      <Route path={APP_ROUTES.SCHEMAS} element={<Schemas />} />
      <Route path={APP_ROUTES.SCHEMA_BY_ID} element={<Schema />} />
      <Route path={APP_ROUTES.MODULES} element={<Modules />} />
      <Route path={APP_ROUTES.MODULE_BY_ID} element={<Module />} />
      <Route path={APP_ROUTES.SEARCH} element={<Search />} />
      <Route path={APP_ROUTES.PORTAL_BY_ID} element={<Portal />} />
      <Route path="/linea/*" element={<LineaRedirect />} />
      <Route path={APP_ROUTES.DEFAULT} element={<NotFoundPage />} />
    </Route>,
  ),
);
