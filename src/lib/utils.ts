import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL

export function getSupabaseImage(
  bucket: string,
  path?: string | null
) {
  if (!path) return "/placeholder.jpg";

  // already full url
  if (path.startsWith("http")) return path;

  return `${SUPABASE_URL}/object/public/${bucket}/${path}`;
}
