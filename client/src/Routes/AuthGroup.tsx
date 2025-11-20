import { Route } from "react-router-dom";
import { AuthLayout } from "../layout";
import { SignInPage, SignUpPage } from "../pages";

export const AuthGroup = (
  <>
    <Route element={<AuthLayout />}>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Route>
  </>
);
