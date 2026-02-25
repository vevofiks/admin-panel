"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Download, Settings2, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, ArrowUpDown, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    searchPlaceholder?: string;
    onExport?: (data: TData[]) => void;
    exportFilename?: string;
}

function SkeletonRow({ cols, rowIndex }: { cols: number; rowIndex: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <div className="h-4 rounded shimmer" style={{ width: `${60 + ((rowIndex * 7 + i * 13) % 30)}%` }} />
                </td>
            ))}
        </tr>
    );
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    searchPlaceholder = "Search...",
    exportFilename = "export",
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [showColumnToggle, setShowColumnToggle] = useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, columnFilters, columnVisibility, globalFilter },
        initialState: { pagination: { pageSize: 8 } },
    });

    const exportCSV = () => {
        const filtered = table.getFilteredRowModel().rows.map((r) => r.original);
        const header = columns.map((c) => (c as { accessorKey?: string }).accessorKey || (c as { id?: string }).id || "").filter(Boolean);
        const rows = filtered.map((row) =>
            header.map((key) => {
                const val = (row as Record<string, unknown>)[key];
                return typeof val === "string" || typeof val === "number" ? val : "";
            })
        );
        const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportFilename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        const filtered = table.getFilteredRowModel().rows.map((r) => r.original);
        const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportFilename}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-8 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg
              text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1
              focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Column Visibility */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnToggle((o) => !o)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 border border-zinc-800
                bg-zinc-900 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-all"
                        >
                            <Settings2 size={13} />
                            <span>Columns</span>
                        </button>
                        <AnimatePresence>
                            {showColumnToggle && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-full mt-1 z-10 min-w-40 bg-zinc-900 border border-zinc-800
                    rounded-xl shadow-2xl p-2"
                                >
                                    {table.getAllColumns().filter((c) => c.getCanHide()).map((col) => (
                                        <button
                                            key={col.id}
                                            onClick={() => col.toggleVisibility()}
                                            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-zinc-800 rounded-lg
                        text-xs text-zinc-400 hover:text-zinc-200 transition-colors capitalize"
                                        >
                                            {col.getIsVisible() ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {col.id}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Export menu */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 border border-zinc-800
                bg-zinc-900 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-all"
                        >
                            <Download size={13} />
                            <span>CSV</span>
                        </button>
                        <button
                            onClick={exportJSON}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 border border-zinc-800
                bg-zinc-900 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-all"
                        >
                            <Download size={13} />
                            <span>JSON</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-zinc-800 bg-zinc-900/80">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-1.5",
                                                        header.column.getCanSort() && "cursor-pointer hover:text-zinc-300 select-none transition-colors"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <ArrowUpDown size={11} className="text-zinc-700" />
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonRow key={i} cols={columns.length} rowIndex={i} />
                                ))
                                : table.getRowModel().rows.length === 0
                                    ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-16 text-center text-zinc-600 text-sm">
                                                No results found.
                                            </td>
                                        </tr>
                                    )
                                    : table.getRowModel().rows.map((row) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-zinc-500">
                    {isLoading
                        ? "Loading..."
                        : `${table.getFilteredRowModel().rows.length} total rows · Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
                </p>
                <div className="flex items-center gap-1">
                    {[
                        { icon: <ChevronsLeft size={13} />, action: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage() },
                        { icon: <ChevronLeft size={13} />, action: () => table.previousPage(), disabled: !table.getCanPreviousPage() },
                        { icon: <ChevronRight size={13} />, action: () => table.nextPage(), disabled: !table.getCanNextPage() },
                        { icon: <ChevronsRight size={13} />, action: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.action}
                            disabled={btn.disabled}
                            className={cn(
                                "p-1.5 rounded-lg border border-zinc-800 text-zinc-400 transition-all",
                                btn.disabled
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-zinc-800 hover:text-zinc-200"
                            )}
                        >
                            {btn.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
