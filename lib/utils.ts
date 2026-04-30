// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de manera eficiente, 
 * resolviendo conflictos (ej: si pasas p-4 y p-2, prevalecerá la última).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}