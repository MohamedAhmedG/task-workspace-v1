import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DATE_DISPLAY: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
}

export function formatDate(dateStr: string): string {
  if (dateStr.includes("T")) {
    return new Date(dateStr).toLocaleDateString("en-US", DATE_DISPLAY)
  }

  // YYYY-MM-DD due dates are calendar dates; parse as local to avoid UTC shift.
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year!, month! - 1, day!).toLocaleDateString(
    "en-US",
    DATE_DISPLAY,
  )
}
