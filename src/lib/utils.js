import clsx from "clsx"; //clsx → Combines multiple class strings or objects conditionally
import { twMerge } from "tailwind-merge"; twMerge("px-2 px-4") // returns "px-4" → keeps the last conflicting Tailwind class

export function cn(...inputs) {  
  return twMerge(clsx(inputs)); 
}


// Why use cn

// Makes it easy to combine classes dynamically.

// Handles conditional classes cleanly (isActive && "class-name").

// Resolves Tailwind conflicts automatically.

// Works well with component variants (like CVA in your Button component).