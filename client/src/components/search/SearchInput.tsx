import { Search, X } from "lucide-react";
import { Input } from "..";

const SearchInput = ({
  clearSearch,
  onKeyDown,
  searchQuery,
  setIsExpanded,
  setSearchQuery,
}: {
  clearSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div
      className={`relative ring-0 rounded-lg  outline-1  bg-white transition-all ease-in ${"bg-gray-100"}`}
      style={{ overflow: "visible" }}
    >
      <Search
        size={18}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
      />

      <Input
        type="search"
        placeholder="Search people..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`pl-12 pr-10 w-full border-0 bg-transparent transition-all duration-100 ease-in-out ${"py-2 rounded-full"}`}
        onKeyDown={onKeyDown}
        onFocus={() => setIsExpanded(true)}
        aria-label="Search people"
      />

      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
          type="button"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
