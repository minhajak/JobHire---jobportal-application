import { useEffect, useState } from "react";
import type { ConnectType } from "../../../lib/types/connectType";
import { suggestionConnections } from "../../../lib/axios/connectionInstance";

export function useSuggestions(initial: ConnectType[] = []) {
  const [newSuggestions, setNewSuggestions] = useState<ConnectType[]>(initial);
  const [loading, SetLoading] = useState<boolean>(false);

  const fetchSuggestions = async () => {
    try {
      SetLoading(true);
      const res = await suggestionConnections();
      const { suggestions } = res.data;
      setNewSuggestions(Array.isArray(suggestions) ? suggestions : []);
    } catch (err: any) {
      new Error("Error Fetching suggestions");
    } finally {
      SetLoading(false);
    }
  };

  const handleRemoveConnection = (userId: string): void => {
    setNewSuggestions((prev) =>
      prev.filter((inv) => {
        if (!inv) return true;
        const user = inv.user || inv;
        return user.userId !== userId;
      })
    );
  };

  useEffect(() => {
    (async () => {
      await fetchSuggestions();
    })();
  }, []);

  return {
    newSuggestions,
    handleRemoveConnection,
    loading,
  };
}
