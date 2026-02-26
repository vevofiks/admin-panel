"use client";

import { useUnifiedCustomers } from "@/core/hooks/useUnifiedData";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { UnifiedCustomer } from "@/types/unified";
import { formatCurrency, formatDate, getInitials, cn } from "@/lib/utils";

const segmentClass: Record<string, string> = {
    vip: "badge-vip",
    loyal: "badge-loyal",
    at_risk: "badge-at_risk",
    new: "badge-new",
    lost: "badge-lost",
};

const columns: ColumnDef<UnifiedCustomer>[] = [
    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const c = row.original;
            return (
                <div className="flex items-center gap-3">
                    {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                            {getInitials(c.name)}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{c.name}</p>
                        <p className="text-xs text-zinc-500">{c.email}</p>
                    </div>
                </div>
            );
        },
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{row.original.city}, {row.original.country}</span>
        ),
    },
    {
        accessorKey: "segment",
        header: "Segment",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return (
                <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize", segmentClass[val])}>
                    {val.replace("_", " ")}
                </span>
            );
        },
    },
    {
        accessorKey: "totalOrders",
        header: "Orders",
        cell: ({ getValue }) => (
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{getValue<number>()}</span>
        ),
    },
    {
        accessorKey: "ltv",
        header: "Lifetime Value",
        cell: ({ getValue }) => (
            <span className="text-sm font-semibold text-emerald-400">{formatCurrency(getValue<number>())}</span>
        ),
    },
    {
        accessorKey: "avgOrderValue",
        header: "Avg. Order",
        cell: ({ getValue }) => (
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{formatCurrency(getValue<number>())}</span>
        ),
    },
    {
        id: "joined",
        header: "Joined",
        cell: ({ row }) => (
            <span className="text-sm text-zinc-500">{formatDate(row.original.joinedAt)}</span>
        ),
    },
];

export default function CustomersPage() {
    const { data, isLoading } = useUnifiedCustomers();
    return (
        <div className="max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Customers</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">{data?.length ?? 0} customers total</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                    + Add Customer
                </button>
            </div>
            <DataTable
                columns={columns}
                data={data ?? []}
                isLoading={isLoading}
                searchPlaceholder="Search customers, email, location..."
                exportFilename="customers"
            />
        </div>
    );
}
