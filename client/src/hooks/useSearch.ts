import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { NavigateFunction } from "react-router-dom";
import { searchProfiles } from "../lib/axios/profileInstance";
import type { ProfileSchemaType } from "../lib/types/profileType";

interface SearchParams {
  q?: string;
  industry?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface SearchResult {
  profiles: ProfileSchemaType[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export default function useSearch(navigate: NavigateFunction) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const MAX_SUGGESTIONS = 5;

  const [data, setData] = useState<SearchResult | null>(null);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const list = data?.profiles ?? [];
    const filtered = list.filter((u) =>
      (u.fullName ?? "").toLowerCase().includes(q)
    );
    return filtered.slice(0, MAX_SUGGESTIONS);
  }, [data, searchQuery]);

  const setDataFromPayload = useCallback((payload: any) => {
    if (payload && Array.isArray(payload.profiles)) {
      setData(payload as SearchResult);
      return;
    }
    new Error("Invalid response format from server");
  }, []);

  const search = useCallback(
    async (params: SearchParams) => {

      try {
        // CALL your wrapper the same way you already used it
        const response = await searchProfiles({
          q: params.q,
          limit: params.limit,
          page: params.page,
        });

        const payload: any = response?.data;
        setDataFromPayload(payload);
      } catch (err: any) {
        if (err?.response) {
          new Error(
            err.response?.data?.message ||
              `Server error: ${err.response?.status}`
          );
        } else if (err?.request) {
          new Error("Network error - no response from server");
        } else {
          new Error(err?.message || "An unexpected error occurred");
        }
      } 
    },
    [setDataFromPayload]
  );

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setActiveIndex(null);
  }, []);

  // Keyboard navigation
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isExpanded) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) =>
          i === null ? 0 : Math.min(i + 1, suggestions.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) =>
          i === null ? suggestions.length - 1 : Math.max(i - 1, 0)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex != null && suggestions[activeIndex]) {
          const user = suggestions[activeIndex];
          const id = (user as any)._id ?? (user as any).id;
          console.log(id+" id")
          if (id) {
            navigate(`/profile/${encodeURIComponent(String(id))}`);
          } else {
            navigate(`/profile/${encodeURIComponent(user.fullName ?? "")}`);
          }
        } else {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
        setSearchQuery("");
        setIsExpanded(false);
        setActiveIndex(null);
      } else if (e.key === "Escape") {
        setIsExpanded(false);
        setActiveIndex(null);
      }
    },
    [activeIndex, suggestions, isExpanded, navigate, searchQuery]
  );

  const handleSuggestionClick = useCallback(
    (user: ProfileSchemaType) => {
      const id = (user as any).userId ?? (user as any).userId;
      if (id) {
        navigate(`/profile/${encodeURIComponent(String(id))}`);
      } else {
        navigate(`/profile/${encodeURIComponent(user.fullName ?? "")}`);
      }
      setSearchQuery("");
      setIsExpanded(false);
      setActiveIndex(null);
    },
    [navigate]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      search({ q: searchQuery, limit: 2 });
    } else {
      // optionally clear results when query is empty:
      setData(null);
    }
  }, [searchQuery, search]);

  return {
    searchQuery,
    setSearchQuery,
    isExpanded,
    setIsExpanded,
    suggestions,
    onKeyDown,
    handleSuggestionClick,
    clearSearch: resetSearch,
    searchRef,
    activeIndex
  };
}
