"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import hasMounted from "@/lib/hooks/has-mounted";

interface ThemeSwitcherProps extends HTMLAttributes<HTMLButtonElement> {}

export function ThemeSwitcher({ ...props }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={cn(props.className)}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {hasMounted() && theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
