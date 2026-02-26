"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Store } from "@/types/unified";
import panelConfig from "@/config/panel.config";

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
    /** Patch any fields on a store by id; keeps activeStore in sync */
    updateStore: (storeId: string, patch: Partial<Omit<Store, "id" | "provider">>) => void;
}

const defaultStore =
    panelConfig.stores.find((s) => s.id === panelConfig.defaultStoreId) ??
    panelConfig.stores[0];

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            sidebarCollapsed: false,
            commandBarOpen: false,
            mobileSidebarOpen: false,
            activeStoreId: defaultStore.id,
            stores: panelConfig.stores,
            activeStore: defaultStore,
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            setCommandBarOpen: (open) => set({ commandBarOpen: open }),
            setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
            setActiveStore: (storeId) => {
                const store = get().stores.find((s) => s.id === storeId);
                if (store) set({ activeStoreId: storeId, activeStore: store });
            },
            updateStore: (storeId, patch) => {
                const updatedStores = get().stores.map((s) =>
                    s.id === storeId ? { ...s, ...patch } : s
                );
                const updatedActive =
                    get().activeStore.id === storeId
                        ? { ...get().activeStore, ...patch }
                        : get().activeStore;
                set({ stores: updatedStores, activeStore: updatedActive });
            },
        }),
        {
            name: "nexus-ui-store", // localStorage key
            storage: createJSONStorage(() => localStorage),
            // Only persist the data that should survive a reload.
            // Ephemeral UI state (commandBar, mobileSidebar) is intentionally excluded.
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
                activeStoreId: state.activeStoreId,
                stores: state.stores,
                activeStore: state.activeStore,
            }),
        }
    )
);
