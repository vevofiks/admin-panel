"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Command, Bell, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/core/store/useUIStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import panelConfig from "@/config/panel.config";

const { pageTitles } = panelConfig;

export function Topbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { setCommandBarOpen, setMobileSidebarOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const page = pageTitles[pathname] || { title: "Nexus AI", desc: "" };

    return (
        <header className="h-16 flex items-center px-4 md:px-6 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md shrink-0 z-40">
            <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 mr-auto rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Menu size={20} />
            </button>

            {/* <div className="flex-1 min-w-0 hidden md:block">
                <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{page.title}</h1>
                <p className="text-xs text-zinc-500 truncate">{page.desc}</p>
            </div> */}

            <div className="flex justify-end gap-2 ml-auto">
                {/* CMD+K trigger */}
                <button
                    onClick={() => setCommandBarOpen(true)}
                    className={cn(
                        "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500",
                        "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300",
                        "bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150"
                    )}
                >
                    <Command size={12} />
                    <span>Search</span>
                    <kbd className="ml-1 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
                </button>

                {/* Notification */}
                <button className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                </button>

                {/* Theme toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Toggle theme"
                >
                    {mounted ? (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <span className="w-4 h-4 block" />}
                </button>
            </div>
        </header>
    );
}