"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { Button } from "./ui/button";

// Define props interface extending HTMLButtonElement attributes
interface ThemeSwitcherProps extends HTMLAttributes<HTMLButtonElement> {}

// ThemeSwitcher component for toggling between light and dark themes
export function ThemeSwitcher({ ...props }: ThemeSwitcherProps) {
  // Use the useTheme hook to access and modify the current theme
  const { theme, setTheme } = useTheme();

  return (
    <Button
      // Merge custom className with default Button styles
      className={cn(props.className)}
      size="icon"
      // Toggle theme between light and dark on click
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* Display Sun icon for dark theme, Moon icon for light theme */}
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
