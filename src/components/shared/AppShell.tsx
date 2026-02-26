"use client";

import { useUIStore } from "@/core/store/useUIStore";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { CommandBar } from "@/components/modules/CommandBar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed, commandBarOpen, setCommandBarOpen } = useUIStore();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandBarOpen(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [setCommandBarOpen]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-50">
            <Sidebar />
            <div
                className={cn(
                    "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
                    "ml-0", // mobile default
                    sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[260px]"
                )}
            >
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
            {commandBarOpen && <CommandBar />}
        </div>
    );
}
