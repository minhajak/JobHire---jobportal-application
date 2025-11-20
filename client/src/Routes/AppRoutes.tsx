import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGroup } from "./AuthGroup";
import { PublicGroup } from "./PublicGroup";
import { ProtectedGroup } from "./ProtectedGroup";
import { ToastContainer } from "react-toastify";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {AuthGroup}
        {PublicGroup}
        {ProtectedGroup}

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default AppRoutes;
