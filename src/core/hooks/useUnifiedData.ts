import { useQuery } from "@tanstack/react-query";
import panelConfig from "@/config/panel.config";
import { mockProducts, mockOrders, mockCustomers, mockKPI, mockAnalytics } from "@/lib/mock-data";

const { useMockData } = panelConfig;

export function useUnifiedProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            if (useMockData) {
                await new Promise((r) => setTimeout(r, 600));
                return mockProducts;
            }
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });
}

export function useUnifiedOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            if (useMockData) {
                await new Promise((r) => setTimeout(r, 700));
                return mockOrders;
            }
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
        },
    });
}

export function useUnifiedCustomers() {
    return useQuery({
        queryKey: ["customers"],
        queryFn: async () => {
            if (useMockData) {
                await new Promise((r) => setTimeout(r, 650));
                return mockCustomers;
            }
            const res = await fetch("/api/customers");
            if (!res.ok) throw new Error("Failed to fetch customers");
            return res.json();
        },
    });
}

export function useKPI() {
    return useQuery({
        queryKey: ["kpi"],
        queryFn: async () => {
            if (useMockData) {
                await new Promise((r) => setTimeout(r, 400));
                return mockKPI;
            }
            const res = await fetch("/api/kpi");
            if (!res.ok) throw new Error("Failed to fetch KPI");
            return res.json();
        },
    });
}

export function useAnalytics() {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            if (useMockData) {
                await new Promise((r) => setTimeout(r, 500));
                return mockAnalytics;
            }
            const res = await fetch("/api/analytics");
            if (!res.ok) throw new Error("Failed to fetch analytics");
            return res.json();
        },
    });
}
