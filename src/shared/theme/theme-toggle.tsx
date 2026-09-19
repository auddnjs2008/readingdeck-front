"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {  useTheme } from "./theme-provider";



export  default function ThemeToggle() {
  const {theme, toggleTheme} = useTheme()

  if(!theme) return <div/>

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}


