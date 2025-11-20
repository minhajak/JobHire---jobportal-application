import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  // derive active tab from the pathname (single source of truth)
  const activeTab = useMemo<"signin" | "signup" | "none">(() => {
    const p = location.pathname.toLowerCase();
    if (p.startsWith("/signin")) return "signin";
    if (p.startsWith("/signup")) return "signup";
    return "none";
  }, [location.pathname]);

  // helper to compute tab classes
  const tabBase =
    "flex-1 flex items-center justify-center cursor-pointer font-semibold text-sm sm:text-base transition-all duration-150";

  const tabClass = (tab: "signin" | "signup") =>
    `${tabBase} ${
      activeTab === tab
        ? "text-gray-600 bg-container-theme hover:text-gray-800 rounded-none"
        : "bg-white text-gray-900"
    }`;

  const textClass = (tab: "signin" | "signup") =>
    activeTab === tab ? "text-link-dark" : "text-link-light";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-white ">
      <h1
        className="text-center bg-white font-bold font-sans pt-5 pb-5"
        style={{ color: "rgba(32, 32, 32, 1)", fontSize: "20px" }}
      >
        Logo
      </h1>
      <div className="w-screen h-auto  bg-container-theme rounded-2xl min-h-screen lg:max-w-96 lg:max-h-96 sm:min-h-fit flex flex-col overflow-hidden">
        {/* segmented control / nav */}
        <div>
          <div role="tablist" className="flex w-full h-8 sm:h-16 bg-white">
            <NavLink
              to="/signin"
              role="tab"
              aria-selected={activeTab === "signin"}
              className={() => tabClass("signin")}
            >
              <h2 className={textClass("signin")}>Log In</h2>
            </NavLink>

            <NavLink
              to="/signup"
              role="tab"
              aria-selected={activeTab === "signup"}
              className={() => tabClass("signup")}
            >
              <h2 className={textClass("signup")}>Sign Up</h2>
            </NavLink>
          </div>
          {/* content area */}
          <div className="flex-grow p-4 pt-7 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
