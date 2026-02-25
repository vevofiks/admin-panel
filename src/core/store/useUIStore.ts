"use client";

import { Store } from "@/types/unified";
import { create } from "zustand";

const mockStores: Store[] = [
    { id: "shopify-1", name: "Nexus Store", provider: "shopify", domain: "nexus-store.myshopify.com", currency: "USD" },
    { id: "medusa-1", name: "EU Warehouse", provider: "medusa", domain: "eu.nexus-store.com", currency: "EUR" },
    { id: "custom-1", name: "Wholesale Portal", provider: "custom", domain: "wholesale.nexus-store.com", currency: "USD" },
];

interface UIState {
    sidebarCollapsed: boolean;
    commandBarOpen: boolean;
    mobileSidebarOpen: boolean;
    activeStoreId: string;
    stores: Store[];
    activeStore: Store;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;
    setCommandBarOpen: (open: boolean) => void;
    setMobileSidebarOpen: (open: boolean) => void;
    setActiveStore: (storeId: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    sidebarCollapsed: false,
    commandBarOpen: false,
    mobileSidebarOpen: false,
    activeStoreId: mockStores[0].id,
    stores: mockStores,
    activeStore: mockStores[0],
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setCommandBarOpen: (open) => set({ commandBarOpen: open }),
    setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
    setActiveStore: (storeId) => {
        const store = get().stores.find((s) => s.id === storeId);
        if (store) set({ activeStoreId: storeId, activeStore: store });
    },
}));
