import { useMemo } from "react";

export default function useInitials(fullName: string){
    const initials = useMemo(() => {
        return (fullName ?? "")
          .split(" ")
          .map((n) => (n ? n[0] : ""))
          .slice(0, 2)
          .join("")
          .toUpperCase();
      }, [fullName]);
      return initials;

}