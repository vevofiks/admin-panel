/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║              DEVELOPER CONFIGURATION FILE                     ║
 * ║  Edit the values below to deploy this panel for a new client  ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * This is the single source of truth for all client-specific settings.
 * No other file should contain hardcoded client data.
 */

import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Users,
    BarChart3,
    Puzzle,
    Settings,
} from "lucide-react";
import { PanelConfig } from "./types";

const panelConfig: PanelConfig = {
    // ─── Branding ────────────────────────────────────────────────────────────────
    branding: {
        appName: "Nexus",
        tagline: "Mission Control",
    },

    // ─── Sidebar Admin User ───────────────────────────────────────────────────────
    admin: {
        displayName: "Admin User",
        email: "admin@nexus.ai",
        initials: "NA",
    },

    // ─── HTML Metadata ────────────────────────────────────────────────────────────
    metadata: {
        title: "Nexus AI – Universal eCommerce Admin",
        description:
            "Mission Control for your eCommerce ecosystem. Manage Shopify, MedusaJS, and custom stores from one unified interface.",
    },

    // ─── Store Switcher ───────────────────────────────────────────────────────────
    // Add or remove stores here. Each store will appear in the sidebar switcher.
    stores: [
        {
            id: "shopify-1",
            name: "Nexus Store",
            provider: "shopify",
            domain: "nexus-store.myshopify.com",
            currency: "USD",
        },
    ],

    // ID of the store that is selected by default on first load.
    defaultStoreId: "shopify-1",

    // ─── Sidebar Navigation ───────────────────────────────────────────────────────
    // Add, remove, or reorder nav links here.
    navigation: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/customers", label: "Customers", icon: Users },
        { href: "/products", label: "Products", icon: ShoppingBag },
        { href: "/categories", label: "Categories", icon: ClipboardList },
        { href: "/variants", label: "Variants", icon: Puzzle },
        { href: "/orders", label: "Orders", icon: ClipboardList },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/settings", label: "Settings", icon: Settings },
    ],

    // ─── Topbar Page Titles ───────────────────────────────────────────────────────
    pageTitles: {
        "/": { title: "Dashboard", desc: "Overview of your store performance" },
        "/products": { title: "Products", desc: "Manage your product catalog" },
        "/categories": { title: "Categories", desc: "Manage product categories" },
        "/variants": { title: "Variants", desc: "Manage product variants and options" },
        "/orders": { title: "Orders", desc: "Track and manage customer orders" },
        "/customers": { title: "Customers", desc: "Customer profiles and management" },
        "/analytics": { title: "Analytics", desc: "Revenue and performance insights" },
        "/settings": { title: "Settings", desc: "Store configuration and preferences" },
    },

    // ─── Data Source ──────────────────────────────────────────────────────────────
    // true  → data hooks return local mock data (demo / local development)
    // false → data hooks call real API routes (/api/products, /api/orders, etc.)
    useMockData: true,
};

export default panelConfig;
