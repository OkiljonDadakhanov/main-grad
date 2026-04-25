import { cn } from "@/lib/utils";

interface InitialChipProps {
  name: string;
  className?: string;
  // Optional override; when omitted, a stable color is derived from the name.
  seedColor?: string;
}

const PALETTE = [
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function InitialChip({ name, className, seedColor }: InitialChipProps) {
  const trimmed = name?.trim() ?? "";
  const initial = trimmed ? trimmed.charAt(0).toUpperCase() : "?";
  const colorClass = seedColor ?? PALETTE[hashName(trimmed) % PALETTE.length];

  return (
    <div
      role="img"
      aria-label={trimmed || "No name"}
      className={cn(
        "flex items-center justify-center rounded-full font-semibold select-none",
        colorClass,
        className,
      )}
    >
      <span className="leading-none">{initial}</span>
    </div>
  );
}
