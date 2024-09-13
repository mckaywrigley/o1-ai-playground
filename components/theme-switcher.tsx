"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { Button } from "./ui/button";

interface ThemeSwitcherProps extends HTMLAttributes<HTMLButtonElement> {}

export function ThemeSwitcher({ ...props }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={cn(props.className)}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
