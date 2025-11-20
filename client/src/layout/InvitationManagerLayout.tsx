import {
  NavLink,
  Outlet,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { ArrowRightIcon } from "../components";

const InvitationManagerLayout = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="bg-[#FAFAFA]">
      <div className="">
        <div className="flex items-center gap-2 p-5 bg-white ">
          <div onClick={() => navigate("/networks/grow")}>
            <ArrowRightIcon className="cursor-pointer" />
          </div>
          <span className=" pl-2 text-sm font-semibold text-gray-800">
            Invitation Manager
          </span>
        </div>

        <nav className=" md:pl-7 flex justify-center md:justify-start border-b md:mb-3  bg-white md:rounded-b-[5px] overflow-hidden">
          <NavLink
            to="/networks/recieved"
            className={({ isActive }) =>
              `px-4 py-3 font-semibold text-sm ${
                isActive
                  ? "text-green-600 underline underline-offset-15"
                  : "text-gray-700"
              }`
            }
          >
            Recieved
          </NavLink>

          <NavLink
            to="/networks/sent"
            className={({ isActive }) =>
              `px-4 py-3 font-semibold text-sm ${
                isActive
                  ? "text-green-600  underline underline-offset-15"
                  : "text-gray-700"
              }`
            }
          >
            Sent
          </NavLink>
        </nav>
      </div>

      <div className="border-t md:rounded-t-[5px] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default InvitationManagerLayout;
