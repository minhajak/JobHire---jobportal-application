import { Route } from "react-router-dom";

import NotFound from "../pages/error/NotFoundPage";
import { ForgotPasswordPage, ResetPasswordPage } from "../pages";

export const PublicGroup = (
  <>
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
 

    <Route path="/404" element={<NotFound />} />
  </>
);
