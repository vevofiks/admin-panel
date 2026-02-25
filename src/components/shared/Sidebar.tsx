"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Users,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Store as StoreIcon,
    Zap,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/core/store/useUIStore";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/categories", label: "Categories", icon: ClipboardList },
    { href: "/variants", label: "Variants", icon: Settings },
    { href: "/orders", label: "Orders", icon: ClipboardList },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

const providerColors: Record<string, string> = {
    shopify: "bg-emerald-500",
    medusa: "bg-violet-500",
    custom: "bg-amber-500",
};

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { sidebarCollapsed, toggleSidebar, stores, activeStore, setActiveStore } = useUIStore();
    const [storeMenuOpen, setStoreMenuOpen] = useState(false);

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 68 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen flex flex-col z-50 overflow-hidden
        bg-zinc-950 border-r border-zinc-800"
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    {!sidebarCollapsed && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                        <Zap size={16} className="text-white" />
                    </div>
                    )}
                    {!sidebarCollapsed && (
                    <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="min-w-0"
                            >
                                <span className="font-semibold text-sm text-zinc-50 tracking-tight whitespace-nowrap">Nexus AI</span>
                                <p className="text-[10px] text-zinc-500 whitespace-nowrap">Mission Control</p>
                            </motion.div>
                    </AnimatePresence>
                    )}
                </div>
                <button
                    onClick={toggleSidebar}
                    className="ml-auto p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0"
                >
                    {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Store Switcher */}
            <div className="px-3 py-3 border-b border-zinc-800/50">
                <button
                    onClick={() => !sidebarCollapsed && setStoreMenuOpen((o) => !o)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors text-left"
                >
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", providerColors[activeStore.provider])}>
                        <StoreIcon size={12} className="text-white" />
                    </div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0 flex items-center justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-200 truncate">{activeStore.name}</p>
                                    <p className="text-[10px] text-zinc-500 truncate capitalize">{activeStore.provider}</p>
                                </div>
                                <ChevronDown size={12} className={cn("text-zinc-500 transition-transform", storeMenuOpen && "rotate-180")} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <AnimatePresence>
                    {storeMenuOpen && !sidebarCollapsed && (
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
                                            : "hover:bg-zinc-800/60 text-zinc-400"
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
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                                isActive
                                    ? "bg-indigo-500/15 text-indigo-400"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
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
                                {!sidebarCollapsed && (
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

            {/* Bottom user area */}
            <div className="px-3 py-3 border-t border-zinc-800">
                <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">NA</span>
                    </div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="min-w-0"
                            >
                                <p className="text-xs font-medium text-zinc-300 truncate">Admin User</p>
                                <p className="text-[10px] text-zinc-500 truncate">admin@nexus.ai</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
