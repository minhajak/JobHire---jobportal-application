import { useEffect, useState } from "react";
import {
  HomeIcon,
  JobsIcon,
  MyNetworkIcon,
  NotificationsIcon,
  PostIcon,
} from "..";
import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";
import More from "./More";

const Menu = () => {
  const [active, setActive] = useState("home");
  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const menuItems = [
    { id: "home", icon: <HomeIcon />, link: "/" },
    {
      id: "network",
      icon: <MyNetworkIcon />,
      link: [
        "/networks/grow",
        "/networks/catchup",
        "/networks/invitation-manager",
        "/networks/recieved",
        "/networks/sent",
        "/grow",
        "/catchup",
        "/invitation-manager",
      ],    },
    { id: "post", icon: <PostIcon /> ,link:"/post" },
    { id: "notifications", icon: <NotificationsIcon />, link: "/notifications" },
    { id: "jobs", icon: <JobsIcon />, link: "/my-jobs" },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => {
      if (Array.isArray(item.link)) {
        return item.link.includes(location.pathname);
      }
      return item.link === location.pathname;
    });
    if (current) setActive(current.id);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col md:flex-col md:justify-between md:items-center md:py-3 md:w-[65px] md:h-full text-gray-400 bg-inherit z-50">
      {/* Logo - only visible on desktop */}
      <div className="hidden md:block text-black">
        <span>Logo</span>
      </div>

      {/* Menu Items */}
      <div className="flex flex-row items-center justify-center gap-6 py-2 md:flex-col md:gap-4 md:py-0">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.link) {
                // If link is array, navigate to first path by default
                navigate(Array.isArray(item.link) ? item.link[0] : item.link);
              }
              setActive(item.id);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-[10px] 
              hover:bg-gray-100 
              ${active === item.id ? "bg-gray-100 text-black" : "text-gray-400"}`}
          >
            {item.icon}
          </div>
        ))}
        <More className="md:hidden"/>
      </div>

      {/* More button */}
      <More className="hidden md:block" />
    </div>
  );
};

export default Menu;
