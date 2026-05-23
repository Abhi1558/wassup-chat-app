import React from "react";
import { THEMES } from "./constants";
import { useThemeStore } from "../store/useThemeStore";
import { Palette } from "lucide-react";
const Theme = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    
      <div className="menu dropdown dropdown-end ">
        <div tabIndex={0} role="button" className="btn btn-sm m-1">
          <Palette className="size-5" />
          <span className="hidden sm:inline">Themes</span>
        </div>
          <div
            tabIndex="-1"
            className="dropdown-content bg-base-300 rounded-box z-[50] w-52 max-h-60  p-2 shadow-2xl overflow-y-auto "
          >
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                theme-controller group flex   w-full items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50 "}
              `}
                onClick={() => setTheme(t)}
              >
                <span className="text-[11px] font-medium truncate w-full text-center hidden sm:inline">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
                <div className="relative h-8  w-full rounded-md overflow-hidden">
                  <div
                    data-theme={t}
                    className="h-full w-full grid grid-cols-4 gap-px p-1"
                  >
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        
      </div>
  
  );
};

export default Theme;
