import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

export const useAuthentication = () => {
  return useAppSelector((state) => state.auth.accessToken);
};

export const useAuthRedirect = (): void => {
  const isAuthenticated = useAuthentication();
  const navigate = useNavigate();
  if (isAuthenticated) navigate("/dashboard");
};
