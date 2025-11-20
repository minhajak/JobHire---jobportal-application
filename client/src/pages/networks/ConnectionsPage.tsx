import { useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowRightIcon } from "../../components";
import { MyConnections } from "../../features/networks";

export default function ConnectionPage() {
    const navigate: NavigateFunction = useNavigate();

  return (
    <div className="grid grid-rows-1 w-full border-0 shadow-0  bg-[#fafafa]">
        <div className="border-b flex items-center gap-3 pl-5 py-3 bg-white md:mb-3 md:rounded-b-[5px] md:border-b">
        <div
          className="cursor-pointer flex items-center justify-center"
          onClick={() => navigate("/networks/manage")}
        >
          <ArrowRightIcon />
        </div>

        <span className="text-lg font-semibold text-gray-800">
          My Connections
        </span>
      </div>
      <MyConnections />
    </div>
  );
}
