import { useState } from "react";
import {
  getCatchupUpdates,
  likeCatchupUpdate,
  commentOnCatchupUpdate,
  congratulateCatchupUpdate,
  deleteComment,
} from "../../../lib/axios/networkUpdateInstance";
import type { CatchupUpdate } from "../../../lib/types/networkUpdateType";

export default function useNetworkUpdate() {
  const [updates, setUpdates] = useState<CatchupUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("all");

  const fetchUpdates = async (type?: string) => {
    try {
      setLoading(true);
      setError(null);
      const filterType = type !== undefined ? type : currentFilter;
      setCurrentFilter(filterType);
      const data = await getCatchupUpdates(filterType);
      setUpdates(data);
    } catch (err: any) {
      console.error("Error fetching catchup updates:", err);
      setError(err.message || "Failed to fetch updates");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (updateId: string) => {
    // Optimistic update - show change immediately
    setUpdates((prevUpdates) =>
      prevUpdates.map((update) => {
        if (update._id === updateId) {
          const isCurrentlyLiked = update.likes.length > 0;
          return {
            ...update,
            likes: isCurrentlyLiked ? [] : ["temp-like"],
          };
        }
        return update;
      })
    );

    try {
      await likeCatchupUpdate(updateId);
      // Refetch to sync with backend
      await fetchUpdates();
    } catch (err: any) {
      console.error("Error liking update:", err);
      // Revert optimistic update on error
      await fetchUpdates();
      throw err;
    }
  };

  const handleComment = async (updateId: string, content: string) => {
    // Optimistic update - show comment immediately
    const tempComment = {
      _id: `temp-${Date.now()}`,
      userId: "current-user",
      content: content,
      createdAt: new Date().toISOString(),
    };

    setUpdates((prevUpdates) =>
      prevUpdates.map((update) => {
        if (update._id === updateId) {
          return {
            ...update,
            comments: [...update.comments, tempComment],
          };
        }
        return update;
      })
    );

    try {
      const result = await commentOnCatchupUpdate(updateId, content);
      // Refresh updates to get the actual comment from backend
      await fetchUpdates();
      return result;
    } catch (err: any) {
      console.error("Error commenting on update:", err);
      // Revert optimistic update on error
      await fetchUpdates();
      throw err;
    }
  };

  const handleCongratulate = async (updateId: string) => {
    // Optimistic update - show change immediately
    setUpdates((prevUpdates) =>
      prevUpdates.map((update) => {
        if (update._id === updateId) {
          const isCurrentlyCongratulated = update.congratulations.length > 0;
          return {
            ...update,
            congratulations: isCurrentlyCongratulated ? [] : ["temp-congrat"],
          };
        }
        return update;
      })
    );

    try {
      await congratulateCatchupUpdate(updateId);
      // Refetch to sync with backend
      await fetchUpdates();
    } catch (err: any) {
      console.error("Error congratulating update:", err);
      // Revert optimistic update on error
      await fetchUpdates();
      throw err;
    }
  };

  const handleDeleteComment = async (updateId: string, commentId: string) => {
    try {
      await deleteComment(updateId, commentId);
      // Refetch to sync with backend
      await fetchUpdates();
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      throw err;
    }
  };

  return {
    updates,
    loading,
    error,
    fetchUpdates,
    handleLike,
    handleComment,
    handleCongratulate,
    handleDeleteComment,
  };
}
