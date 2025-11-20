import { useEffect, useState } from "react";
import type { ApiGroupType } from "../../../lib/types/groupType";
import { getRequestedGroups } from "../../../lib/axios/groupInstance";

export default function useGroupRequest() {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [requestedGroups, setRequestedGroups] = useState<ApiGroupType[]>();

  const handleWithdrawRequest = async () => {
    try {
    //   setIsLoading(true);
    //   const res = await getRequestedGroups();
    //   setRequestedGroups(res.data.groups as ApiGroupType[]);
    } catch (err) {
      console.log("error in fetching requested groups", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequestedGroups = async () => {
    try {
      setIsLoading(true);
      const res = await getRequestedGroups();
      setRequestedGroups(res.data.groups as ApiGroupType[]);
    } catch (err) {
      console.log("error in fetching requested groups", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRequestedGroups();
  }, []);
  return { isLoading, requestedGroups,handleWithdrawRequest };
}
