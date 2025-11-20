import type React from "react";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import type { eventType, Pagination } from "../../../lib/types/eventType";
import useInitials from "../../../hooks/useInitials";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from "../../../components";
import { formatDateTime } from "../../../lib/InputValidator";
import Loader from "./Loader";

interface EventCardsProps {
  events: eventType[];
  pagination: Pagination;
  page: number;
  handleFetchMore: () => void;
  isLoading?: boolean;
}

interface EventCardProps {
  event: eventType;
}

// Memoized individual event card component
const EventCard = memo<EventCardProps>(({ event }) => {
  const initials = useInitials(event.eventName ?? "Unknown Event");
  const dateLabel = formatDateTime(event.startDateTime as string);
  const eventId = event._id ?? "";
  const eventName = event.eventName ?? "Untitled Event";
  const attendeesText =
    event.attendeesCount === 1 ? "registered" : "registered";

  return (
    <Link
      to={`${eventId}`}
      className="group flex items-center gap-3 border-b px-3 py-3 hover:bg-slate-50 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      role="article"
      aria-label={`${eventName}, ${dateLabel}, ${event.attendeesCount} ${attendeesText}`}
    >
      {/* Avatar / Cover Image */}
      <Avatar className="size-14 rounded-md overflow-hidden flex-shrink-0">
        <AvatarImage
          src={event.coverImageUrl as string}
          alt=""
          className="w-full h-full object-cover"
        />
        <AvatarFallback className="text-sm font-medium bg-slate-200 text-slate-700">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Date */}
        <time
          className="text-xs text-slate-500 block mb-1"
          dateTime={event.startDateTime as string}
        >
          {dateLabel}
        </time>

        {/* Event Name */}
        <h3
          className="text-sm font-medium leading-snug text-slate-900 truncate mb-2 group-hover:text-slate-700"
          title={eventName}
        >
          {eventName}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-2 py-0.5 bg-slate-200 text-slate-700 border-0"
          >
            {event.eventType}
          </Badge>
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-2 py-0.5 bg-slate-200 text-slate-700 border-0"
          >
            {event.attendeesCount} {attendeesText}
          </Badge>
        </div>
      </div>
    </Link>
  );
});

EventCard.displayName = "EventCard";

// Main EventCards component
const EventCards: React.FC<EventCardsProps> = ({
  events,
  pagination,
  page,
  handleFetchMore,
}) => {
  const hasMorePages = pagination?.totalPages > page;
  const hasEvents = events && events.length > 0;

  const [localLoading, setLocalLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (localLoading || !hasMorePages) return;
    setLocalLoading(true);
    try {
      await handleFetchMore();
    } finally {
      setLocalLoading(false);
    }
  }, [localLoading, hasMorePages, handleFetchMore]);

  return (
    <section
      className="space-y-4 border-t flex flex-col py-2"
      aria-label="Events"
    >
      {/* Header */}
      <div className="px-2">
        <h2 className="text-sm font-normal text-slate-900">
          Your Events
          {hasEvents && (
            <span className="ml-2 text-slate-500">({events.length})</span>
          )}
        </h2>
      </div>

      {/* Events Grid */}
      <div className="border-t" role="list">
        {hasEvents ? (
          events.map((event) => (
            <div key={event._id} role="listitem">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">
            No events found
          </div>
        )}

        {localLoading && (
          <Loader/>
        )}
      </div>

      {/* Load More Button */}
      {hasMorePages && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            disabled={localLoading}
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-4 py-2"
            aria-label="Load more events"
          >
            {!localLoading && "Show more"}
          </button>
        </div>
      )}
    </section>
  );
};

export default memo(EventCards);
