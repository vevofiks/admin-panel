"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/core/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Key, Bell, Shield, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
    { code: "USD", label: "USD – US Dollar" },
    { code: "EUR", label: "EUR – Euro" },
    { code: "GBP", label: "GBP – British Pound" },
    { code: "JPY", label: "JPY – Japanese Yen" },
    { code: "AUD", label: "AUD – Australian Dollar" },
    { code: "CAD", label: "CAD – Canadian Dollar" },
    { code: "INR", label: "INR – Indian Rupee" },
];

const providerColors: Record<string, string> = {
    shopify: "bg-emerald-500",
    medusa: "bg-violet-500",
    custom: "bg-amber-500",
};

export default function SettingsPage() {
    const { stores, activeStore, updateStore } = useUIStore();

    // Local form state — synced to activeStore whenever it changes
    const [storeName, setStoreName] = useState(activeStore.name);
    const [domain, setDomain] = useState(activeStore.domain);
    const [currency, setCurrency] = useState(activeStore.currency);

    const [notifyOrders, setNotifyOrders] = useState(true);
    const [notifyLowStock, setNotifyLowStock] = useState(true);
    const [notifyCustomers, setNotifyCustomers] = useState(false);

    const [saved, setSaved] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Reset form when user switches stores in the sidebar
    useEffect(() => {
        setStoreName(activeStore.name);
        setDomain(activeStore.domain);
        setCurrency(activeStore.currency);
        setDirty(false);
    }, [activeStore.id]);

    // Sync form after Zustand persist rehydrates from localStorage on reload.
    // Only runs when the user hasn't started editing (dirty=false).
    useEffect(() => {
        if (!dirty) {
            setStoreName(activeStore.name);
            setDomain(activeStore.domain);
            setCurrency(activeStore.currency);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStore.name, activeStore.domain, activeStore.currency]);

    // Mark dirty whenever the user edits anything
    const markDirty = () => setDirty(true);

    const handleSave = () => {
        updateStore(activeStore.id, {
            name: storeName.trim() || activeStore.name,
            domain: domain.trim() || activeStore.domain,
            currency,
        });
        setSaved(true);
        setDirty(false);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleCancel = () => {
        setStoreName(activeStore.name);
        setDomain(activeStore.domain);
        setCurrency(activeStore.currency);
        setDirty(false);
    };

    return (
        <div className="max-w-5xl space-y-7 mx-auto">
            <div className="mb-2">
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Configure your store and preferences</p>
            </div>

            {/* Store Profile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                            <Store size={14} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Store Profile</h2>
                            <p className="text-[10px] text-zinc-500">Editing: <span className="text-indigo-400 font-medium capitalize">{activeStore.provider}</span> · {activeStore.id}</p>
                        </div>
                    </div>
                    <AnimatePresence>
                        {saved && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full"
                            >
                                <Check size={10} />
                                Changes saved
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-4">
                    {/* Store Name */}
                    <div>
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Store Name</label>
                        <input
                            value={storeName}
                            onChange={(e) => { setStoreName(e.target.value); markDirty(); }}
                            placeholder="My Store"
                            className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg
                                text-zinc-800 dark:text-zinc-200 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Domain */}
                    <div>
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Domain</label>
                        <input
                            value={domain}
                            onChange={(e) => { setDomain(e.target.value); markDirty(); }}
                            placeholder="mystore.myshopify.com"
                            className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg
                                text-zinc-800 dark:text-zinc-200 font-mono outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => { setCurrency(e.target.value); markDirty(); }}
                            className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg
                                text-zinc-800 dark:text-zinc-200 outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Connected Stores */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
            >
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Key size={14} className="text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Connected Stores</h2>
                </div>
                <div className="space-y-3">
                    {stores.map((store) => (
                        <div key={store.id} className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors",
                            store.id === activeStore.id
                                ? "bg-indigo-500/10 border border-indigo-500/20"
                                : "bg-zinc-100/60 dark:bg-zinc-800/60"
                        )}>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", providerColors[store.provider])}>
                                <Store size={14} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{store.name}</p>
                                <p className="text-xs text-zinc-500 font-mono truncate">{store.domain}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                                    {store.currency}
                                </span>
                                <span className="text-xs text-zinc-600 capitalize bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                                    {store.provider}
                                </span>
                                <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors">
                                    <ExternalLink size={12} className="text-zinc-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-3 w-full py-2 text-xs text-indigo-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg
                    hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
                    + Connect New Store
                </button>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
            >
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Bell size={14} className="text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "New Order Alerts", desc: "Get notified when new orders come in", value: notifyOrders, set: setNotifyOrders },
                        { label: "Low Stock Warnings", desc: "Alert when product stock falls below threshold", value: notifyLowStock, set: setNotifyLowStock },
                        { label: "New Customer Registrations", desc: "Notify on new customer sign-ups", value: notifyCustomers, set: setNotifyCustomers },
                    ].map(({ label, desc, value, set }) => (
                        <div key={label} className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
                                <p className="text-xs text-zinc-600">{desc}</p>
                            </div>
                            <button
                                onClick={() => set(!value)}
                                className={cn(
                                    "relative rounded-full transition-colors duration-200 shrink-0",
                                    value ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700"
                                )}
                                style={{ width: 40, height: 22 }}
                            >
                                <span
                                    className={cn(
                                        "absolute top-0.5 bg-white rounded-full shadow transition-all duration-200",
                                        value ? "left-[calc(100%-18px)]" : "left-0.5"
                                    )}
                                    style={{ width: 18, height: 18 }}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
            >
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Shield size={14} className="text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Security</h2>
                </div>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100/60 dark:bg-zinc-800/60 rounded-lg
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                        <div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Change Password</p>
                            <p className="text-xs text-zinc-600">Update your account password</p>
                        </div>
                        <ExternalLink size={13} className="text-zinc-600" />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100/60 dark:bg-zinc-800/60 rounded-lg
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                        <div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Two-Factor Authentication</p>
                            <p className="text-xs text-zinc-600">Add an extra layer of security</p>
                        </div>
                        <span className="text-xs bg-amber-500/15 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            Not enabled
                        </span>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100/60 dark:bg-zinc-800/60 rounded-lg
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                        <div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Keys</p>
                            <p className="text-xs text-zinc-600">Manage your store API credentials</p>
                        </div>
                        <ExternalLink size={13} className="text-zinc-600" />
                    </button>
                </div>
            </motion.div>

            {/* Save / Cancel */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={handleCancel}
                    disabled={!dirty}
                    className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!dirty}
                    className={cn(
                        "px-5 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                        saved
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    )}
                >
                    {saved ? "✓ Saved!" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
