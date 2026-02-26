"use client";

import { useKPI, useUnifiedOrders, useUnifiedProducts, useAnalytics } from "@/core/hooks/useUnifiedData";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import { UnifiedProduct, UnifiedProductVariant, UnifiedOrder } from "@/types/unified";
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3,
    Package, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
    fulfilled: "badge-fulfilled",
    processing: "badge-processing",
    pending: "badge-pending",
    cancelled: "badge-cancelled",
    refunded: "badge-cancelled",
};

function KPICard({
    title, value, change, icon: Icon, prefix = "", index,
}: {
    title: string; value: number | string; change: number; icon: React.ElementType;
    prefix?: string; index: number;
}) {
    const positive = change >= 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-zinc-500 font-medium">{title}</p>
                    <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1.5 tracking-tight">
                        {prefix}{typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Icon size={16} className="text-indigo-400" />
                </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
                {positive ? (
                    <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                    <TrendingDown size={12} className="text-red-500" />
                )}
                <span className={cn("text-xs font-medium", positive ? "text-emerald-500" : "text-red-500")}>
                    {positive ? "+" : ""}{change}%
                </span>
                <span className="text-xs text-zinc-600">vs last month</span>
            </div>
        </motion.div>
    );
}

function KPICardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-24 rounded shimmer" />
                    <div className="h-7 w-32 rounded shimmer" />
                </div>
                <div className="w-9 h-9 rounded-lg shimmer" />
            </div>
            <div className="h-3 w-40 rounded shimmer mt-3" />
        </div>
    );
}

export default function DashboardPage() {
    const { data: kpi, isLoading: kpiLoading } = useKPI();
    const { data: orders, isLoading: ordersLoading } = useUnifiedOrders();
    const { data: products, isLoading: productsLoading } = useUnifiedProducts();
    const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

    const recentOrders = orders?.slice(0, 5) || [];
    const lowStockProducts = products
        ?.filter((p: UnifiedProduct) => p.variants.some((v: UnifiedProductVariant) => v.stock < 20))
        .slice(0, 4) || [];

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
                ) : kpi ? (
                    <>
                        <KPICard title="Total Revenue" value={formatCurrency(kpi.totalRevenue)} change={kpi.revenueChange} icon={DollarSign} index={0} />
                        <KPICard title="Total Orders" value={kpi.totalOrders} change={kpi.ordersChange} icon={ShoppingCart} index={1} />
                        <KPICard title="Total Customers" value={kpi.totalCustomers} change={kpi.customersChange} icon={Users} index={2} />
                        <KPICard title="Avg. Order Value" value={formatCurrency(kpi.avgOrderValue)} change={kpi.aovChange} icon={BarChart3} index={3} />
                    </>
                ) : null}
            </div>

            {/* Revenue Chart + Recent Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="xl:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Revenue Overview</h2>
                            <p className="text-xs text-zinc-500">12-month performance</p>
                        </div>
                        <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">2024</span>
                    </div>
                    {analyticsLoading ? (
                        <div className="h-48 shimmer rounded-lg" />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={analytics} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "0.5rem", fontSize: 12 }}
                                    labelStyle={{ color: "#a1a1aa" }}
                                    itemStyle={{ color: "#818cf8" }}
                                    formatter={(v: any) => [`$${Number(v || 0).toLocaleString()}`, "Revenue"]}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}
                                    fill="url(#revGrad)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent Orders</h2>
                        <Link href="/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                            View all <ArrowRight size={11} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {ordersLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full shimmer shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 w-24 rounded shimmer" />
                                        <div className="h-2.5 w-16 rounded shimmer" />
                                    </div>
                                    <div className="h-5 w-14 rounded-full shimmer" />
                                </div>
                            ))
                            : recentOrders.map((order: UnifiedOrder) => (
                                <div key={order.id} className="flex items-center gap-3">
                                    <img
                                        src={order.customer.avatarUrl}
                                        alt={order.customer.name}
                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{order.customer.name}</p>
                                        <p className="text-[10px] text-zinc-600">{order.orderNumber} · {formatRelativeTime(order.createdAt)}</p>
                                    </div>
                                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusColors[order.status])}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                    </div>
                </motion.div>
            </div>

            {/* Low Stock Alert */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Low Stock Alert</h2>
                        <p className="text-xs text-zinc-500">Products with less than 20 units</p>
                    </div>
                    <Link href="/products" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        Manage <ArrowRight size={11} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {productsLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg">
                                <div className="w-10 h-10 rounded-lg shimmer shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-3 w-full rounded shimmer" />
                                    <div className="h-2.5 w-12 rounded shimmer" />
                                </div>
                            </div>
                        ))
                        : lowStockProducts.map((product: UnifiedProduct) => {
                            const minStock = Math.min(...product.variants.map((v: UnifiedProductVariant) => v.stock));
                            return (
                                <div key={product.id} className="flex items-center gap-3 p-3 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                    <img src={product.imageUrl} alt={product.title}
                                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-zinc-200 dark:bg-zinc-700" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{product.title}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Package size={10} className={cn(minStock === 0 ? "text-red-500" : "text-amber-500")} />
                                            <span className={cn("text-[10px] font-semibold", minStock === 0 ? "text-red-500" : "text-amber-500")}>
                                                {minStock === 0 ? "Out of stock" : `${minStock} left`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </motion.div>
        </div>
    );
}
