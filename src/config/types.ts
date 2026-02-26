import { LucideIcon } from "lucide-react";
import { Store } from "@/types/unified";

export interface PanelBranding {
    /** App name shown in the sidebar header */
    appName: string;
    /** Tagline/subtitle shown below the app name */
    tagline: string;
}

export interface PanelAdmin {
    /** Display name shown in the sidebar footer */
    displayName: string;
    /** Email shown in the sidebar footer */
    email: string;
    /** Initials shown in the avatar circle (max 2 chars) */
    initials: string;
}

export interface PanelMetadata {
    /** Next.js <title> tag */
    title: string;
    /** Next.js <meta name="description"> */
    description: string;
}

export interface NavLink {
    href: string;
    label: string;
    /** A Lucide icon component */
    icon: LucideIcon;
}

export interface PageTitle {
    title: string;
    desc: string;
}

export interface PanelConfig {
    /** Client branding shown in the sidebar */
    branding: PanelBranding;
    /** Admin user info shown in the sidebar footer */
    admin: PanelAdmin;
    /** HTML page metadata */
    metadata: PanelMetadata;
    /** Stores available in the store-switcher */
    stores: Store[];
    /** ID of the store that is active on first load */
    defaultStoreId: string;
    /** Sidebar navigation links */
    navigation: NavLink[];
    /** Route → { title, desc } map used by the Topbar */
    pageTitles: Record<string, PageTitle>;
    /**
     * When true, data hooks return local mock data (great for demos/dev).
     * When false, hooks call the real API routes.
     */
    useMockData: boolean;
}
