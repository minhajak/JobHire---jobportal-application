import { type JSX } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import Header from "../components/layout/Header";
import profileImage from "../assets/profile.jpg"

export default function MyNetworkLayout(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className=" bg-[#FAFAFA] md:rounded-2xl">
      <Header navigate={navigate} profileImage={profileImage} />
      <nav className="flex justify-center md:justify-start bg-white border-b md:mb-3 md:rounded-b-[5px] md:pt-3 md:pl-3">
        <NavLink
          to="/networks/grow"
          className={({ isActive }) =>
            `px-4 py-3 font-semibold text-sm underline-offset-15 ${
              isActive ? "text-green-600 md:underline" : "text-gray-700"
            }`
          }
        >
          Grow
        </NavLink>

        <NavLink
          to="/networks/catchup"
          className={({ isActive }) =>
            `px-4 py-3 font-semibold text-sm underline-offset-15 ${
              isActive ? "text-green-600 md:underline  " : "text-gray-700"
            }`
          }
        >
          Catch up
        </NavLink>
      </nav>

      <main className=" bg-white">
        <div className="py-0  md:rounded-t-[5px]  border-t">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
