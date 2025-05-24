import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleNetworkError(error: unknown): string {
  if (error instanceof Error) {
    // Check for MongoDB connection errors
    if (error.message.includes('Server selection timeout') || 
        error.message.includes('I/O error: timed out') ||
        error.message.includes('connect ECONNREFUSED')) {
      return 'Unable to connect to server. Please check your internet connection or try changing your network.'
    }
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}