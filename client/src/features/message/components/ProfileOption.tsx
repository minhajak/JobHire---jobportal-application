import { useRef, useEffect } from "react";
import {
  Share2,
  Info,
  Trash2,
  Ban,
  CircleHelp,
} from "lucide-react";

interface ProfileOptionProps {
  onClose: () => void;
  onShare: () => void;
  onReport: () => void;
  onClearChat: () => void;
  onBlock: () => void;
  isBlocked: boolean;
  onAbout: () => void;
}

const ProfileOption = ({
  onClose,
  onShare,
  onReport,
  onClearChat,
  onBlock,
  isBlocked,
  onAbout,
}: ProfileOptionProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef}
      className="absolute right-2 lg:right-80 mt-2 w-56 rounded-xl bg-white shadow-lg border z-50" >
      <button onClick={() => {
        onShare();
        onClose();
      }}
        className="flex w-full items-center px-4 py-2 hover:bg-gray-100">
        <Share2 className="mr-2 h-4 w-4" /> Share Profile
      </button>

      <button onClick={() => {
        onReport();
        onClose();
      }}
        className="flex w-full items-center px-4 py-2 hover:bg-gray-100">
        <Info className="mr-2 h-4 w-4" /> Report
      </button>

      <button onClick={() => {
        onClearChat();
        onClose();
      }}
        className="flex w-full items-center px-4 py-2 hover:bg-gray-100">
        <Trash2 className="mr-2 h-4 w-4" /> Clear Chat
      </button>

      <button onClick={() => {
        onBlock();
        onClose();
      }}
        className="flex w-full items-center px-4 py-2 hover:bg-gray-100">
        <Ban className="mr-2 h-4 w-4" /> {isBlocked ? "Unblock" : "Block"}
      </button>

      <button onClick={() => {
        onAbout();
        onClose();
      }}
        className="flex w-full items-center px-4 py-2 hover:bg-gray-100">
        <CircleHelp className="mr-2 h-4 w-4" /> About Profile
      </button>
    </div>
  );
};

export default ProfileOption;


