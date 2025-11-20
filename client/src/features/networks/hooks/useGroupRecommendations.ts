import { useEffect, useState } from "react";
import { type ApiGroupType } from "../../../lib/types/groupType";
import {
  getGroupRecommendations,
  joinGroup,
} from "../../../lib/axios/groupInstance";

export default function useGroupRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecomendations] = useState<ApiGroupType[]>([]);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  const handleCloseCard = async (groupId: string) => {
    setRecomendations((prev) => prev.filter((g) => g.id !== groupId));
  };

  const fetchGroupRecommendations = async () => {
    try {
      setIsLoading(true);
      const res = await getGroupRecommendations();
      setRecomendations((res.data.recommendations as ApiGroupType[]) ?? []);
    } catch (error) {
      console.log(`error fetching group recommendations`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    try {
      setJoiningGroupId(groupId);
      await joinGroup(groupId);
      handleCloseCard(groupId);
    } catch (error) {
      console.log(`error joining group`, error);
    } finally {
      setJoiningGroupId(null);
    }
  };

  useEffect(() => {
    fetchGroupRecommendations();
  }, []);

  return { isLoading, recommendations, joiningGroupId, handleJoin,handleCloseCard };
}
