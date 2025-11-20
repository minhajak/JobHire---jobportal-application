import { useAppSelector } from "./redux";

export const useAuthUser = () => {
  return useAppSelector((state) => state.auth.accessToken);
};