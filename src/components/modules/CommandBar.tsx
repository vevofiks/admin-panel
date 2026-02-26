"use client";

import { useUIStore } from "@/core/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ShoppingBag, ClipboardList, Users, BarChart3, Settings,
    Sun, Moon, Search, ArrowRight, Store, Command, X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type CommandItem = {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    group: string;
    action: () => void;
    keywords?: string[];
};

export function CommandBar() {
    const { setCommandBarOpen, stores, setActiveStore, activeStore } = useUIStore();
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = (path: string) => {
        router.push(path);
        setCommandBarOpen(false);
    };

    const allCommands: CommandItem[] = [
        { id: "nav-dash", label: "Go to Dashboard", icon: <LayoutDashboard size={14} />, group: "Navigation", action: () => navigate("/"), keywords: ["home", "overview"] },
        { id: "nav-prod", label: "Go to Products", icon: <ShoppingBag size={14} />, group: "Navigation", action: () => navigate("/products"), keywords: ["catalog", "items"] },
        { id: "nav-ord", label: "Go to Orders", icon: <ClipboardList size={14} />, group: "Navigation", action: () => navigate("/orders"), keywords: ["purchases", "sales", "fulfillment"] },
        { id: "nav-cust", label: "Go to Customers", icon: <Users size={14} />, group: "Navigation", action: () => navigate("/customers"), keywords: ["users", "buyers", "clients"] },
        { id: "nav-ana", label: "Go to Analytics", icon: <BarChart3 size={14} />, group: "Navigation", action: () => navigate("/analytics"), keywords: ["reports", "charts", "revenue"] },
        { id: "nav-set", label: "Go to Settings", icon: <Settings size={14} />, group: "Navigation", action: () => navigate("/settings"), keywords: ["config", "preferences"] },
        {
            id: "theme-toggle", label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
            icon: theme === "dark" ? <Sun size={14} /> : <Moon size={14} />, group: "Actions",
            action: () => { setTheme(theme === "dark" ? "light" : "dark"); setCommandBarOpen(false); },
            keywords: ["dark", "light", "theme", "mode"],
        },
        ...stores.map((store) => ({
            id: `store-${store.id}`,
            label: `Switch to ${store.name}`,
            description: store.domain,
            icon: <Store size={14} />,
            group: "Stores",
            action: () => { setActiveStore(store.id); setCommandBarOpen(false); },
            keywords: ["workspace", "switch", store.provider],
        })),
    ];

    const filtered = query.trim()
        ? allCommands.filter((cmd) => {
            const q = query.toLowerCase();
            return (
                cmd.label.toLowerCase().includes(q) ||
                cmd.description?.toLowerCase().includes(q) ||
                cmd.keywords?.some((k) => k.includes(q))
            );
        })
        : allCommands;

    const groups = Array.from(new Set(filtered.map((c) => c.group)));

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 50);
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setCommandBarOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [setCommandBarOpen]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
                onClick={() => setCommandBarOpen(false)}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg mx-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
                        <Search size={16} className="text-zinc-500 shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search commands, pages, or stores..."
                            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none"
                        />
                        <div className="flex items-center gap-1.5">
                            <kbd className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500">ESC</kbd>
                            <button onClick={() => setCommandBarOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                                <X size={12} className="text-zinc-500" />
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-y-auto py-2">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-zinc-500">
                                No commands found for &quot;{query}&quot;
                            </div>
                        ) : (
                            groups.map((group) => (
                                <div key={group} className="mb-1">
                                    <p className="px-4 py-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{group}</p>
                                    {filtered
                                        .filter((c) => c.group === group)
                                        .map((cmd) => (
                                            <button
                                                key={cmd.id}
                                                onClick={cmd.action}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left group"
                                            >
                                                <span className="text-zinc-500 group-hover:text-indigo-400 transition-colors">{cmd.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate">{cmd.label}</p>
                                                    {cmd.description && (
                                                        <p className="text-xs text-zinc-600 truncate">{cmd.description}</p>
                                                    )}
                                                </div>
                                                <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
                                            </button>
                                        ))}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4 text-[10px] text-zinc-600">
                        <span className="flex items-center gap-1.5"><kbd className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded font-mono">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1.5"><kbd className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded font-mono">↵</kbd> Select</span>
                        <span className="flex items-center gap-1.5"><Command size={9} /><kbd className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded font-mono">K</kbd> Toggle</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
