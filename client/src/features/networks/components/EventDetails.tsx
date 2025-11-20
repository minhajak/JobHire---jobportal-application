import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Globe,
  ExternalLink,
  Users,
  Edit,
  Trash2,
  MapPin,
  ArrowLeft,
  Share2,
  User,
  Building,
  MoreVertical,
} from "lucide-react";
import useEvent from "../hooks/useEvent";
import Loader from "./Loader";
import { formatDateTime } from "../../../lib/InputValidator";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { handleEventDetails, eventDetails,isCreator, isLoading } = useEvent();

  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (eventId) {
      handleEventDetails(eventId);
    }
  }, [eventId, handleEventDetails]);

  const getEventTypeIcon = useCallback((type: string) => {
    const iconClass = "w-3.5 h-3.5";
    switch (type?.toLowerCase()) {
      case "online":
        return <Globe className={iconClass} />;
      case "hybride":
        return <Building className={iconClass} />;
      case "offline":
        return <MapPin className={iconClass} />;
      default:
        return <Users className={iconClass} />;
    }
  }, []);

  const getEventTypeColor = useCallback((type: string) => {
    switch (type?.toLowerCase()) {
      case "virtual":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "conference":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "meetup":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }, []);

  const handleMenuToggle = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  // Show loading while fetching data
  if (isLoading) {
    return <Loader />;
  }

  // Show error if event not found after fetch attempt
  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center max-w-[600px] mx-auto">
        <div className="text-center max-w-md p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-4 text-xs">
            This event doesn't exist or was removed.
          </p>
          <button
            onClick={() => navigate("/networks/event")}
            className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const attendeesCount = eventDetails?.attendeesCount || 0;
  const hasAttendees = attendeesCount > 0;

  return (
    <div className="min-h-screen bg-white max-w-[600px] mx-auto">
      {/* Fixed Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-base font-semibold text-gray-900">
            Event Details
          </h1>

          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="More options"
              aria-expanded={showMenu}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left">
                  <Share2 className="w-3.5 h-3.5" />
                  Share Event
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-16">
        {/* Cover Image */}
        <div className="relative w-full h-40 bg-gray-100">
          {eventDetails?.coverImageUrl && !imageError ? (
            <img
              src={eventDetails.coverImageUrl}
              alt={eventDetails.eventName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <Calendar className="w-10 h-10 text-white opacity-80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Event Header */}
        <div className="px-3 pt-4">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getEventTypeColor(
                eventDetails?.eventType as string
              )}`}
            >
              {getEventTypeIcon(eventDetails?.eventType as string)}
              {eventDetails?.eventType || "Event"}
            </span>
            {isCreator && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <User className="w-3 h-3" />
                Organizer
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
            {eventDetails?.eventName}
          </h2>

          <div className="flex items-center gap-1 text-gray-600 text-xs mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{attendeesCount} attending</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-3 mb-4">
          {isCreator ? (
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium">
                <Edit className="w-3.5 h-3.5" />
                Edit Event
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 text-sm font-medium">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          ) : (
            <button className="w-full py-2.5 px-[23px] bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium">
              Register for Event
            </button>
          )}
        </div>

        {/* Event Details */}
        <div className="px-3 space-y-3 mb-4">
          {/* Date & Time */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                Date & Time
              </h3>
              <p className="text-gray-800 font-medium text-xs">
                {formatDateTime(eventDetails?.startDateTime as string)}
              </p>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {formatDateTime(eventDetails?.startDateTime as string)}
                </span>
                {eventDetails?.endDateTime && (
                  <>
                    <span>-</span>
                    <span>
                      {formatDateTime(eventDetails.endDateTime as string)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                Time Zone
              </h3>
              <p className="text-gray-800 font-medium text-xs">
                {eventDetails?.timeZone || "Not specified"}
              </p>
            </div>
          </div>

          {/* Event Location Type */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                {getEventTypeIcon(eventDetails?.eventType as string)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                Event Format
              </h3>
              <p className="text-gray-800 font-medium text-xs capitalize">
                {eventDetails?.eventType || "General"} Event
              </p>
            </div>
          </div>

          {/* External Link */}
          {eventDetails?.externalLink && (
            <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  <Globe className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                  Event Link
                </h3>
                <a
                  href={eventDetails.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs group"
                >
                  <span className="truncate">Visit event website</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        {eventDetails?.description && (
          <section className="px-3 mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              About This Event
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-xs">
              {eventDetails.description}
            </p>
          </section>
        )}

        {/* Attendees Section */}
        <section className="px-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Attendees</h2>
            <span className="text-gray-600 text-xs">
              {attendeesCount} registered
            </span>
          </div>

          {!hasAttendees ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
              <p className="text-gray-600 text-xs">No attendees yet</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Be the first to register
              </p>
            </div>
          ) : (
            <div className="flex -space-x-1.5">
              {[...Array(Math.min(attendeesCount, 7))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs"
                  title={`Attendee ${i + 1}`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {attendeesCount > 7 && (
                <div
                  className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white shadow-sm flex items-center justify-center text-gray-700 font-bold text-xs"
                  title={`${attendeesCount - 7} more attendees`}
                >
                  +{attendeesCount - 7}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer Info */}
        <footer className="px-3 mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-xs text-center">
            Event created on
            {new Date(eventDetails?.createdAt || Date.now()).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] bg-opacity-0 z-40 transition-all"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default EventDetails;
