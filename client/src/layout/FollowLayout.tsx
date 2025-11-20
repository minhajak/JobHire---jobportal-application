import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '../components';

const FollowLayout = () => {
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
          <div onClick={() => navigate("/networks/manage")}>
            <ArrowRightIcon
             className="cursor-pointer" />
          </div>
          <span className="pl-2 text-sm font-semibold text-gray-800">
            Manage my network
          </span>
        </div>

        <div className="flex flex-row border-b bg-white items-center justify-between pr-3 md:mb-3 md:rounded-b-[5px] overflow-hidden">
          <nav className="md:pl-7 flex justify-center md:justify-start   bg-white ">
            {/* `end` makes this match only when pathname is exactly /networks/groups */}
            <NavLink to="/networks/following/" end className={navClass}>
              following
            </NavLink>

            <NavLink to="/networks/followers/" className={navClass}>
              followers
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="border-t md:rounded-t-[5px] overflow-hidden bg-white ">
        <Outlet />
      </div>
    </div>
  )
}

export default FollowLayout