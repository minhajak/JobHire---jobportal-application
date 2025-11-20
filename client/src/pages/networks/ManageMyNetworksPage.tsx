import { useNavigate, type NavigateFunction } from "react-router-dom";
import {
  ConnectionsIcon,
  EventIcon,
  GroupIcon,
  NewsLetterIcon,
  PageIcon,
  PeopleIcon,
  ArrowRightIcon,
} from "../../components";


const ManageMyNetworksPage = () => {
  const navigate: NavigateFunction = useNavigate();

  const items = [
    { icon: <ConnectionsIcon />, label: "Connections", link: "/networks/connections" },
    { icon: <PeopleIcon />, label: "People | Follow" ,link:"/networks/following/"},
    { icon: <GroupIcon />, label: "Groups" ,link:"/networks/groups/"},
    { icon: <EventIcon />, label: "Events" ,link:"/networks/event/"},
    { icon: <PageIcon />, label: "Pages" ,link:"/manage/"},
    { icon: <NewsLetterIcon />, label: "News Letters" ,link:"/manage/"},
  ];

  return (
    <div className="grid grid-rows-1 w-full border-0 shadow-0  bg-[#FAFAFA]">
      <div className="border-b flex items-center gap-3 pl-5 py-3 bg-white md:mb-3 md:border-b md:rounded-b-[5px]">
        <div
          className="cursor-pointer flex items-center justify-center"
          onClick={() => navigate("/networks/grow")}
        >
          <ArrowRightIcon />
        </div>

        <span className="text-[15px] font-semibold text-gray-800">
          Manage my networks
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col pl-5 pt-2 bg-white md:border-t md:rounded-t-[5px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 cursor-pointer text-gray-700  hover:text-black px-3 py-2 rounded-xl transition"
            onClick={() => navigate(item.link)}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMyNetworksPage;
