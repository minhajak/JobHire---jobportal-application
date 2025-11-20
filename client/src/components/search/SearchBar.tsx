import type { NavigateFunction } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage, MessageIcon } from "..";
import useSearch from "../../hooks/useSearch";
import type { ProfileSchemaType } from "../../lib/types/profileType";
import SearchExtendedCard from "./SearchExtendedCard";
import SearchInput from "./SearchInput";

const SearchBar = ({
  profileImage,
  navigate,
}: {
  profileImage: string;
  navigate: NavigateFunction;
}) => {
  const {
    clearSearch,
    onKeyDown,
    handleSuggestionClick,
    isExpanded,
    searchQuery,
    setIsExpanded,
    setSearchQuery,
    searchRef,
    suggestions,
    activeIndex,
  } = useSearch(navigate);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar className="flex-shrink-0 w-10 h-10">
          <AvatarImage
            src={profileImage}
            alt="Profile"
            className="rounded-[10px] object-cover"
          />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>

        {/* Search Bar (animated) */}
        <div
          ref={searchRef}
          className={`relative transition-all duration-300 ${"flex-1 max-w-[640px]"}`}
        >
          <SearchInput
            clearSearch={clearSearch}
            onKeyDown={onKeyDown}
            searchQuery={searchQuery}
            setIsExpanded={setIsExpanded}
            setSearchQuery={setSearchQuery}
          />

          {/* Suggestions Dropdown with enter/exit animation */}

          {isExpanded && suggestions.length > 0 && (
            <div
              key="suggestions"
              className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 z-50 transition-all duration-150"
            >
              {suggestions.map((user: ProfileSchemaType, index) => {
                return (
                  <SearchExtendedCard
                    activeIndex={activeIndex}
                    handleSuggestionClick={handleSuggestionClick}
                    index={index}
                    user={user}
                    key={user.fullName ?? index}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Messages Button */}
        <button
          onClick={() => navigate("/chatlist-page")}
          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
          aria-label="Messages"
          type="button"
        >
          <MessageIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
