"use client";

import { useUnifiedOrders } from "@/core/hooks/useUnifiedData";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { UnifiedOrder } from "@/types/unified";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const statusClass: Record<string, string> = {
    fulfilled: "badge-fulfilled",
    processing: "badge-processing",
    pending: "badge-pending",
    cancelled: "badge-cancelled",
    refunded: "badge-cancelled",
};

const paymentClass: Record<string, string> = {
    paid: "badge-fulfilled",
    pending: "badge-pending",
    refunded: "badge-cancelled",
    partially_refunded: "badge-at_risk",
};

const columns: ColumnDef<UnifiedOrder>[] = [
    {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ getValue }) => (
            <span className="text-sm font-mono font-medium text-indigo-400">{getValue<string>()}</span>
        ),
    },
    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div className="flex items-center gap-2.5">
                <img src={row.original.customer.avatarUrl} alt={row.original.customer.name}
                    className="w-7 h-7 rounded-full object-cover" />
                <div>
                    <p className="text-sm text-zinc-200">{row.original.customer.name}</p>
                    <p className="text-xs text-zinc-600">{row.original.customer.email}</p>
                </div>
            </div>
        ),
    },
    {
        id: "date",
        header: "Date",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-400">{formatDate(row.original.createdAt)}</span>
        ),
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-400">
                {row.original.shippingAddress.city}, {row.original.shippingAddress.country}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return (
                <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize", statusClass[val])}>
                    {val}
                </span>
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return (
                <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border", paymentClass[val])}>
                    {val.replace("_", " ")}
                </span>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => (
            <span className="text-sm font-semibold text-zinc-200">{formatCurrency(getValue<number>())}</span>
        ),
    },
];

export default function OrdersPage() {
    const { data, isLoading } = useUnifiedOrders();
    return (
        <div className="max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-100">Orders</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">{data?.length ?? 0} orders total</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                    + Create Order
                </button>
            </div>
            <DataTable
                columns={columns}
                data={data ?? []}
                isLoading={isLoading}
                searchPlaceholder="Search orders, customers, locations..."
                exportFilename="orders"
            />
        </div>
    );
}
