import React, { useEffect, useRef } from "react";
import useEvent from "../../features/networks/hooks/useEvent";
import Loader from "../../features/networks/components/Loader";
import type { eventType, Pagination } from "../../lib/types/eventType";
import { EventCards } from "../../features/networks";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowRightIcon } from "../../components";

const EventPage: React.FC = () => {
  const {
    isLoading,
    setIsLoading,
    fetchUserCreatedEvents,
    userEvents,
    pagination,
    setPage,
    page,
    setUserEvents,
  } = useEvent();
  const didFetch = useRef(false);
  // Show / hide the create-event form
  const navigate: NavigateFunction = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    if (didFetch.current) return; // prevents second fetch
    didFetch.current = true;
    setUserEvents([]); // reset events
    fetchUserCreatedEvents(1);
  }, [fetchUserCreatedEvents]);

  const handleFetchMoreEvents = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUserCreatedEvents(nextPage);
  };

  return (
    <div className="bg-[#FAFAFA] font-sans">
      <div className="flex flex-row items-center justify-between p-5 border-b bg-white">
        <div className="flex flex-row items-center gap-2 justify-center">
         <Link to={`/networks/manage`}> <ArrowRightIcon /></Link>
          <h3 className="font-sans text-gray-800 text-[18px] font-[500] -translate-y-[1px]">
            Events
          </h3>
        </div>
        <button
          className="font-sans text-[14px] font-[600] bg-white text-[#0077b5] outline-button-blue hover:bg-slate-100 focus:bg-slate-200 outline-1 hover:outline-[1.5px] rounded-[20px] px-[8px] py-1 transition-all ease-linear"
          onClick={() => navigate(`/networks/event/create`)}
        >
          Create an event
        </button>
      </div>
      <div className="bg-white mt-[23px]">
        {isLoading ? (
          <Loader />
        ) : (
          <EventCards
            events={userEvents as eventType[]}
            page={page as number}
            pagination={pagination as Pagination}
            handleFetchMore={handleFetchMoreEvents}
          />
        )}
      </div>
    </div>
  );
};

export default EventPage;
