"use client";

import { useState } from "react";

// Define the props interface for the useCopyToClipboard hook
export interface useCopyToClipboardProps {
  timeout?: number; // Optional timeout for resetting the copied state
}

/**
 * A custom React hook for copying text to the clipboard
 * @param timeout - The duration (in ms) for which the copied state remains true
 * @returns An object containing the copied state and a function to copy text
 */
export function useCopyToClipboard({ timeout = 2000 }: useCopyToClipboardProps) {
  // State to track whether text has been copied
  const [isCopied, setIsCopied] = useState<boolean>(false);

  /**
   * Copies the provided value to the clipboard
   * @param value - The string to be copied to the clipboard
   */
  const copyToClipboard = (value: string) => {
    // Check if we're in a browser environment and clipboard API is available
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    // Don't proceed if the value is empty
    if (!value) {
      return;
    }

    // Copy the text to clipboard
    navigator.clipboard.writeText(value).then(() => {
      // Set the copied state to true
      setIsCopied(true);

      // Reset the copied state after the specified timeout
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  // Return the current copied state and the function to copy text
  return { isCopied, copyToClipboard };
}
