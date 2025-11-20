export const isEmail = (v: string) => /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(v);

export const minLength = (v: string, n = 6) => v.length >= n;

// timeAgo.ts
export function timeAgo(requestedAt: Date): string {
  const now = Date.now();
  const then = new Date(requestedAt).getTime();

  if (isNaN(then)) return "invalid date";

  const diffMs = now - then;
  if (diffMs < 0) return "in the future";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",     // full month name
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true       // 12-hour format with AM/PM
  });
}

