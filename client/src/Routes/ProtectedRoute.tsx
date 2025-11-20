// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const MainLayout = React.lazy(() => import("../layout/MainLayout"));
import { useAppDispatch } from "../hooks";
import { AuthSpinner } from "../components";
import { refresh } from "../lib/axios/authInstance";
import { setCredentials } from "../store/slices/authSlice";

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await refresh();

        if (isMounted) {
          dispatch(setCredentials({ accessToken: data.accessToken }));
          setIsAuthenticated(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Authentication check failed:", err);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (loading || isAuthenticated === null) {
    return <AuthSpinner />;
  }

  return isAuthenticated ? <MainLayout /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
