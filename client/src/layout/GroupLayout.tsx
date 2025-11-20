import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "../components";

const GroupLayout = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-3 font-[500] text-sm ${
      isActive
        ? "text-green-600 underline underline-offset-15"
        : "text-gray-700"
    }`;

  return (
    <div className="bg-[#FAFAFA]">
      <div>
        <div className="flex items-center gap-2 p-5 bg-white">
          <button onClick={() => navigate("/networks/manage")}>
            <ArrowRightIcon className="cursor-pointer" />
          </button>
          <span className="pl-2 text-sm font-semibold text-gray-800">
            Manage
          </span>
        </div>

        <div className="flex flex-row border-b bg-white items-center justify-between pr-3 md:mb-3 md:rounded-b-[5px] overflow-hidden">
          <nav className="md:pl-7 flex justify-center md:justify-start   bg-white ">
            {/* `end` makes this match only when pathname is exactly /networks/groups */}
            <NavLink to="/networks/groups/" end className={navClass}>
              Your groups
            </NavLink>

            <NavLink to="/networks/groups/requests" className={navClass}>
              Requests
            </NavLink>
          </nav>
          <Link className="py-1 px-2 outline-[#0A66C2] rounded-[12px] text-[#0A66C2] outline-1 hover:outline-2 font-[500] hover:bg-green-50 text-[12px] transition-all duration-75 ease-in-out"
          to={`/networks/groups/create`}
          >
            Create group
          </Link>
        </div>
      </div>

      <div className="border-t md:rounded-t-[5px] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default GroupLayout;
