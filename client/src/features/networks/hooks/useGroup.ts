import { useEffect, useState } from "react";
import { getUserGroups, leaveGroup } from "../../../lib/axios/groupInstance";
import {
  type PaginationType,
  type ApiGroupType,
} from "../../../lib/types/groupType";

export default function useGroup() {
  const [userGroups, setUserGroups] = useState<ApiGroupType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 0,
    limit: 0,
    totalJoined: 0,
    totalPages: 0,
  });

  const handleCloseCard = async (groupId: string) => {
    setUserGroups((prev) => prev?.filter((group) => group.id !== groupId));
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      setIsLeaving(true);
      await leaveGroup(groupId);
      handleCloseCard(groupId);
    } catch (error) {
      console.log(`error leaving group`, error);
    } finally {
      setIsLeaving(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserGroups();
      console.log(data.joinedGroups);
      setUserGroups(data.joinedGroups as ApiGroupType[]);
      setPagination(data.pagination as PaginationType);
      console.log(userGroups);
      console.log(pagination);
    } catch (err) {
      console.error("error fetching user groups", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);
  return {
    userGroups,
    isLoading,
    isLeaving,
    handleLeaveGroup,
    pagination,
    handleCloseCard
  };
}
