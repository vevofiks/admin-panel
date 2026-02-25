import { useQuery } from "@tanstack/react-query";
import { mockProducts, mockOrders, mockCustomers, mockKPI, mockAnalytics } from "@/lib/mock-data";

export function useUnifiedProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 600));
            return mockProducts;
        },
    });
}

export function useUnifiedOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 700));
            return mockOrders;
        },
    });
}

export function useUnifiedCustomers() {
    return useQuery({
        queryKey: ["customers"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 650));
            return mockCustomers;
        },
    });
}

export function useKPI() {
    return useQuery({
        queryKey: ["kpi"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 400));
            return mockKPI;
        },
    });
}

export function useAnalytics() {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 500));
            return mockAnalytics;
        },
    });
}
