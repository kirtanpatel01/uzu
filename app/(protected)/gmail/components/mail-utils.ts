export function getInitials(name: string) {
  if (!name) return "?";
  const clean = name.replace(/<.*>/, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function getAvatarColor(name: string) {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600",
    "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
    "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
    "from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600",
    "from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600",
  ];
  return colors[hash % colors.length];
}

export function cleanSender(sender: string) {
  const match = sender.match(/^([^<]+)/);
  return match ? match[1].trim() : sender;
}

export function getSenderEmail(sender: string) {
  const match = sender.match(/<([^>]+)>/);
  return match ? match[1] : null;
}

export function formatShortDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  } catch (e) {}
  
  const parts = dateStr.split(',');
  if (parts.length > 1) {
    const subParts = parts[1].trim().split(/\s+/);
    if (subParts.length >= 2) {
      return `${subParts[0]} ${subParts[1]}`;
    }
  }
  return dateStr.slice(0, 10);
}

export function formatLongDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch (e) {}
  return dateStr;
}
