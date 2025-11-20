import { XCircleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components";

export function DeleteDialog({
  handleUnfollow,
  fullName,
  followerId,
}: {
  handleUnfollow: (followerId: string) => void;
  fullName: string;
  followerId: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-2 mr-2 rounded-[10px] outline outline-slate-800 hover:outline-[1.5px] hover:bg-slate-100 transition-all duration-75">
          following
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0 rounded-[5px] bg-white w-[90%] md:w-[30%]  shadow-lg z-[1000]">
        <AlertDialogHeader className="flex items-center justify-between border-b px-4 py-2 font-medium  flex-row">
          <AlertDialogTitle>Unfollow</AlertDialogTitle>
          <button
            aria-label="Close"
            className="p-0 m-0 bg-white border-none hover:bg-white shadow-none"
            onClick={(e) => e.currentTarget.closest("dialog")?.close()} // Close dialog
          >
            <XCircleIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </AlertDialogHeader>

        <AlertDialogDescription className="px-4 py-3 text-sm text-slate-800">
          You are about to unfollow{" "}
          <span className="font-semibold">{fullName}</span>.
        </AlertDialogDescription>

        <AlertDialogFooter className="flex flex-row  justify-end gap-2 border-t px-4 py-2">
          <AlertDialogCancel
            className="py-1 border-none shadow-none px-3 rounded-2xl text-[#0a66c2] outline-4 outline-[#0a66c2] hover:text-[#094f96] hover:outline-[#094f96] hover:bg-blue-50 transition-all"
            onClick={(e) => e.currentTarget.closest("dialog")?.close()}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => handleUnfollow(followerId)}
            className="py-1 px-3 rounded-2xl bg-[#0a66c2] hover:bg-[#094f96] text-white font-medium transition-all"
          >
            Unfollow
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
