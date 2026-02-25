"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Command, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/core/store/useUIStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const pageTitles: Record<string, { title: string; desc: string }> = {
    "/": { title: "Dashboard", desc: "Overview of your store performance" },
    "/products": { title: "Products", desc: "Manage your product catalog" },
    "/categories": { title: "Categories", desc: "Manage product categories" },
    "/variants": { title: "Variants", desc: "Manage product variants and options" },
    "/orders": { title: "Orders", desc: "Track and manage customer orders" },
    "/customers": { title: "Customers", desc: "Customer profiles and management" },
    "/analytics": { title: "Analytics", desc: "Revenue and performance insights" },
    "/settings": { title: "Settings", desc: "Store configuration and preferences" },
};

export function Topbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { setCommandBarOpen } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const page = pageTitles[pathname] || { title: "Nexus AI", desc: "" };

    return (
        <header className="h-16 flex items-center px-6 bg-zinc-950/80 backdrop-blur-md shrink-0 z-40">
            {/* <div className="flex-1 min-w-0">
                <h1 className="text-sm font-semibold text-zinc-100">{page.title}</h1>
                <p className="text-xs text-zinc-500 truncate">{page.desc}</p>
            </div> */}

            <div className="flex justify-end w-full gap-2">
                {/* CMD+K trigger */}
                <button
                    onClick={() => setCommandBarOpen(true)}
                    className={cn(
                        "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500",
                        "border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300",
                        "bg-zinc-900 hover:bg-zinc-800 transition-all duration-150"
                    )}
                >
                    <Command size={12} />
                    <span>Search</span>
                    <kbd className="ml-1 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
                </button>

                {/* Notification */}
                <button className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                </button>

                {/* Theme toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    aria-label="Toggle theme"
                >
                    {mounted ? (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <span className="w-4 h-4 block" />}
                </button>
            </div>
        </header>
    );
}