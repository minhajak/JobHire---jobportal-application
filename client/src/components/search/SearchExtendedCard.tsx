
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "..";
import type { ProfileSchemaType } from "../../lib/types/profileType";

const SearchExtendedCard = ({
  user,
  index,
  activeIndex,
  handleSuggestionClick,
}: {
  user: ProfileSchemaType;
  index: number;
  activeIndex: number|null;
  handleSuggestionClick: (user: ProfileSchemaType) => void;
}) => {
  return (
    <div
      key={(user as any)._id ?? (user as any).userId ?? user.fullName ?? index}
      className={cn(
        `flex items-center px-4 py-3 hover:bg-gray-50`,
        `cursor-pointer transition-all duration-150`,
        activeIndex === index ? `text-lg` : ``
      )}
      onClick={() => handleSuggestionClick(user)}
    >
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage
          src={user.imageUrl}
          alt={user.fullName}
          className="rounded-[10px] object-cover"
        />
        <AvatarFallback>{user.fullName?.charAt(0) ?? "U"}</AvatarFallback>
      </Avatar>

      <div>
        <div className="font-medium text-gray-900">{user.fullName}</div>
      </div>
    </div>
  );
};

export default SearchExtendedCard;
