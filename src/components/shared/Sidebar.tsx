"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Store as StoreIcon,
    Zap,
    ChevronDown,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/core/store/useUIStore";
import { useState } from "react";
import panelConfig from "@/config/panel.config";

const providerColors: Record<string, string> = {
    shopify: "bg-emerald-500",
    medusa: "bg-violet-500",
    custom: "bg-amber-500",
};

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar, stores, activeStore, setActiveStore, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
    const [storeMenuOpen, setStoreMenuOpen] = useState(false);

    const { branding, admin, navigation } = panelConfig;
    const isExpanded = !sidebarCollapsed || mobileSidebarOpen;

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 68 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                "fixed left-0 top-0 h-screen flex flex-col z-50 overflow-hidden",
                "bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800",
                "transition-transform duration-300",
                "max-md:!w-full",
                mobileSidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    {isExpanded && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                            <Zap size={16} className="text-white" />
                        </div>
                    )}
                    {isExpanded && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="min-w-0"
                            >
                                <span className="font-semibold text-sm text-zinc-50 tracking-tight whitespace-nowrap">
                                    {branding.appName}
                                </span>
                                <p className="text-[10px] text-zinc-500 whitespace-nowrap">
                                    {branding.tagline}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                {mobileSidebarOpen && (
                    <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="ml-auto md:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                        <X size={14} />
                    </button>
                )}
                <button
                    onClick={toggleSidebar}
                    className="ml-auto hidden md:block p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                >
                    {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Store Switcher */}
            <div className="px-3 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <button
                    onClick={() => isExpanded && setStoreMenuOpen((o) => !o)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-colors text-left"
                >
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", providerColors[activeStore.provider])}>
                        <StoreIcon size={12} className="text-white" />
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0 flex items-center justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{activeStore.name}</p>
                                    <p className="text-[10px] text-zinc-500 truncate capitalize">{activeStore.provider}</p>
                                </div>
                                <ChevronDown size={12} className={cn("text-zinc-500 transition-transform", storeMenuOpen && "rotate-180")} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <AnimatePresence>
                    {storeMenuOpen && isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 space-y-0.5 overflow-hidden"
                        >
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => { setActiveStore(store.id); setStoreMenuOpen(false); }}
                                    className={cn(
                                        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors",
                                        activeStore.id === store.id
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                                    )}
                                >
                                    <div className={cn("w-4 h-4 rounded flex items-center justify-center", providerColors[store.provider])}>
                                        <StoreIcon size={9} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium truncate">{store.name}</p>
                                        <p className="text-[10px] text-zinc-500 capitalize">{store.provider}</p>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navigation.map(({ href, label, icon: Icon }) => {
                    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                                isActive
                                    ? "bg-indigo-500/15 text-indigo-400"
                                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <Icon size={16} className="shrink-0 relative z-10" />
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="relative z-10 whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom admin user area */}
            <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">{admin.initials}</span>
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="min-w-0"
                            >
                                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{admin.displayName}</p>
                                <p className="text-[10px] text-zinc-500 truncate">{admin.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
