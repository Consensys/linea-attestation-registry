import { Navigate } from "react-router-dom";

import { APP_ROUTES } from "./constants";

export const NotFoundPage = () => {
  return <Navigate replace to={APP_ROUTES.HOME} />;
};
