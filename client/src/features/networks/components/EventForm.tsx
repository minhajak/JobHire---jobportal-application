import { useEffect, useMemo, type JSX } from "react";
import useEvent from "../hooks/useEvent";
import image from "../../../assets/networks/coverImage.svg";
import { cn } from "../../../lib/utils";
import {
  type EventType,
  type TimeZone,
  eventTypes,
} from "../../../lib/types/eventType";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../../../components";
import { User2 } from "lucide-react";
import { Link } from "react-router-dom";

// Extracted common Tailwind classes
const COMMON_CLASSES = {
  input:
    "w-full px-3 py-2 border-b border-b-blue-200 rounded-none ring-0 transition-colors",
  select:
    "w-full px-3 py-2 border-b border-x-0 border-b-blue-200  border-t-0 shadow-none rounded-none ring-0 transition-colors",
  selectTrigger: "text-gray-500 border-gray-300 border-b-blue-200 ",
  label: "text-sm font-medium text-gray-900",
  fieldWrapper: "space-y-2",
  gridTwo: "grid grid-cols-1 md:grid-cols-2 gap-6",
};

// Reusable FormField component
const FormField = ({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className={COMMON_CLASSES.fieldWrapper}>
    <label htmlFor={htmlFor} className={COMMON_CLASSES.label}>
      {label} {required && "*"}
    </label>
    {children}
  </div>
);

const EventForm = ({}: {}): JSX.Element => {
  const {
    coverImage,
    description,
    endDateTime,
    eventName,
    eventType,
    externalLink,
    inputId,
    setDescription,
    setSpeakerId,
    setStartDateTime,
    setTimeZone,
    speakerId,
    startDateTime,
    timeZone,
    timeZones,
    setEventName,
    setEndDateTime,
    setExternalLink,
    setEventType,
    handleSubmit,
    handleImageChange,
    isLoading,
  } = useEvent();

  // Memoize object URL to avoid recreating it
  const imagePreviewUrl = useMemo(() => {
    if (coverImage) {
      return URL.createObjectURL(coverImage);
    }
    return image;
  }, [coverImage]);

  // Clean up object URL
  useEffect(() => {
    if (coverImage) {
      return () => URL.revokeObjectURL(imagePreviewUrl);
    }
  }, [coverImage, imagePreviewUrl]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white md:rounded-t-[5px] font-inter overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative w-full h-64 overflow-hidden md:rounded-t-[5px] group transition-all">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          name="image"
          className="hidden"
          id={inputId}
        />

        <label
          htmlFor={inputId}
          className="cursor-pointer w-full h-full block "
        >
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="w-full h-full object-cover group-hover:blur-[2px] transition-opacity"
          />

          <div className="absolute text-[12px] font-inter font-[500] hover:bg-slate-200 transition-all bottom-3 right-2 bg-white px-3 py-1 rounded-full shadow cursor-pointer mr-4">
            change image
          </div>
          <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 translate-y-8 group-hover:-translate-y-25 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out rounded-full border p-2 bg-white">
            <User2 size={25} />
          </div>
        </label>
        <div className="absolute left-1 bottom-4">
          <p className="text-xs text-white bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-3 py-1 ml-4">
            JPG, PNG, WebP • Max 5MB
          </p>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Event Name */}
          <FormField label="Event Name" htmlFor="eventName" required>
            <Input
              id="eventName"
              type="text"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className={COMMON_CLASSES.input}
            />
          </FormField>

          {/* Event Type and Time Zone in Grid */}
          <div className={COMMON_CLASSES.gridTwo}>
            <FormField label="Event Type" htmlFor="eventType" required>
              <Select
                value={eventType}
                onValueChange={(value) => setEventType(value as EventType)}
                required
              >
                <SelectTrigger
                  className={cn(
                    COMMON_CLASSES.select,
                    COMMON_CLASSES.selectTrigger
                  )}
                >
                  <SelectValue placeholder="Select Event Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Time Zone" htmlFor="timeZone" required>
              <Select
                value={timeZone}
                onValueChange={(value) => setTimeZone(value as TimeZone)}
                required
              >
                <SelectTrigger
                  className={cn(
                    COMMON_CLASSES.select,
                    COMMON_CLASSES.selectTrigger
                  )}
                >
                  <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Start and End DateTime in Grid */}
          <div className={COMMON_CLASSES.gridTwo}>
            <FormField
              label="Start Date & Time"
              htmlFor="start-datetime"
              required
            >
              <Input
                id="start-datetime"
                type="datetime-local"
                value={startDateTime as string}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
                className={cn(COMMON_CLASSES.input, "text-gray-500")}
              />
            </FormField>

            <FormField label="End Date & Time" htmlFor="end-datetime">
              <Input
                id="end-datetime"
                type="datetime-local"
                value={endDateTime as string}
                onChange={(e) => setEndDateTime(e.target.value)}
                className={cn(COMMON_CLASSES.input, "text-gray-700")}
              />
            </FormField>
          </div>
          {/* External Link */}
          <FormField label="External Link" htmlFor="external-link">
            <Input
              id="external-link"
              type="url"
              placeholder="https://example.com"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className={COMMON_CLASSES.input}
            />
          </FormField>

          {/* Speaker IDs */}
          <FormField label="Speaker IDs" htmlFor="speaker-ids">
            <Input
              id="speaker-ids"
              type="text"
              placeholder="Enter speaker IDs separated by commas"
              value={speakerId.join(", ")}
              onChange={(e) =>
                setSpeakerId(e.target.value.split(",").map((s) => s.trim()))
              }
              className={cn(COMMON_CLASSES.input, `truncate`)}
            />
            <p className="text-[11px] text-gray-700">
              * Separate multiple speaker IDs with commas
            </p>
          </FormField>

          {/* Description */}
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={cn(
                COMMON_CLASSES.input,
                "border-x-0 border-t-0 shadow-none focus:ring-0 resize-vertical"
              )}
            />
          </FormField>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full sm:w-auto md:w-[223px] bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-0 focus:ring-offset-0",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? "creating" : "Create Event"}
            </Button>
            <Link
              className="hover:bg-slate-200 text-slate-400 text-[14px] font-light p-2 rounded-[5px] transition-all w-full sm:w-auto text-center"
              to="/networks/event"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EventForm;
