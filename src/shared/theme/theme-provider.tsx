"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "readingdeck-theme";

function applyThemeToDocument(theme:Theme){
    document.documentElement.classList.toggle("dark",theme === "dark")
}

function readStoredTheme():Theme | null{
    try{
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if(value === "dark") return "dark";
        if(value === "light") return "light";
        return null;
    }catch{
        return null
    }
}

function writeStoredTheme(theme:Theme){
    try{
        localStorage.setItem(THEME_STORAGE_KEY,theme);
    }catch{

    }
}

type ThemeContextValue = {
    theme:Theme;
    setTheme: (theme:Theme) => void;
    toggleTheme:() => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}:{children:React.ReactNode}){
    const [theme,_setTheme] = useState<Theme>("light");

    const setTheme = useCallback((next:Theme) => {
        _setTheme(next);
        applyThemeToDocument(next);
        writeStoredTheme(next);
    }, []);

    useEffect(() => {
        const domTheme: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const stored = readStoredTheme();
        const next = stored ?? domTheme;
        //eslint-disable-next-line
        _setTheme(next);
        applyThemeToDocument(next);
    },[]);

    const toggleTheme = useCallback(()=>{
        setTheme(theme === "dark" ? "light" : "dark");
    },[setTheme,theme])

    const value = useMemo(()=>({theme,setTheme,toggleTheme}),[theme,setTheme,toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export function useTheme(){
    const ctx = useContext(ThemeContext);
    if(!ctx){
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}

export function ThemeInitScript(){
    const code = `
        (() => {
         try{
          const key = "${THEME_STORAGE_KEY}"; 
          const stored = localStorage.getItem(key); 
          const theme = stored === "dark" ? "dark" : "light";
          document.documentElement.classList.toggle("dark",theme === "dark");
        }catch(_){}
        })();
    `.trim();


    return <script dangerouslySetInnerHTML={{__html:code}} />

}