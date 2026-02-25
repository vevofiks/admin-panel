"use client";

import { useAnalytics, useUnifiedOrders } from "@/core/hooks/useUnifiedData";
import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const ORDER_STATUS_DATA = [
    { name: "Fulfilled", value: 58, color: "#10b981" },
    { name: "Processing", value: 25, color: "#6366f1" },
    { name: "Pending", value: 10, color: "#f59e0b" },
    { name: "Cancelled", value: 7, color: "#ef4444" },
];

const TRAFFIC_DATA = [
    { source: "Organic", visits: 4200 },
    { source: "Direct", visits: 3100 },
    { source: "Email", visits: 2800 },
    { source: "Social", visits: 1900 },
    { source: "Paid", visits: 1600 },
    { source: "Referral", visits: 900 },
];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: {
    cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; name: string; value: number;
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return value > 8 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
            {value}%
        </text>
    ) : null;
};

export default function AnalyticsPage() {
    const { data: analytics, isLoading } = useAnalytics();

    return (
        <div className="max-w-[1400px] space-y-6">
            <div className="mb-2">
                <h1 className="text-lg font-semibold text-zinc-100">Analytics</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Performance insights for 2024</p>
            </div>

            {/* Revenue & Orders dual chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
                <h2 className="text-sm font-semibold text-zinc-100 mb-1">Revenue & Orders</h2>
                <p className="text-xs text-zinc-500 mb-5">Monthly trend over 12 months</p>
                {isLoading ? (
                    <div className="h-56 shimmer rounded-lg" />
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={analytics} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false}
                                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "0.5rem", fontSize: 12 }}
                                labelStyle={{ color: "#a1a1aa" }}
                            />
                            <Legend wrapperStyle={{ fontSize: 11, color: "#71717a", paddingTop: 12 }} />
                            <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}
                                fill="url(#revG)" dot={false} name="Revenue ($)" />
                            <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2}
                                fill="url(#ordG)" dot={false} name="Orders" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </motion.div>

            {/* Pie + Bar side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                    <h2 className="text-sm font-semibold text-zinc-100 mb-1">Orders by Status</h2>
                    <p className="text-xs text-zinc-500 mb-5">Fulfillment distribution</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={ORDER_STATUS_DATA}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                innerRadius={50}
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomLabel as never}
                            >
                                {ORDER_STATUS_DATA.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "0.5rem", fontSize: 12 }}
                                formatter={(v: any) => [`${v}%`, ""]}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: "#a1a1aa", fontSize: 11 }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                    <h2 className="text-sm font-semibold text-zinc-100 mb-1">Traffic Sources</h2>
                    <p className="text-xs text-zinc-500 mb-5">Visits by acquisition channel</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={TRAFFIC_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="source" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "0.5rem", fontSize: 12 }}
                                labelStyle={{ color: "#a1a1aa" }}
                                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                            />
                            <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Visits" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Customer Growth */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
                <h2 className="text-sm font-semibold text-zinc-100 mb-1">Customer Growth</h2>
                <p className="text-xs text-zinc-500 mb-5">New customers per month</p>
                {isLoading ? (
                    <div className="h-44 shimmer rounded-lg" />
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={analytics} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "0.5rem", fontSize: 12 }}
                                cursor={{ fill: "rgba(16,185,129,0.08)" }}
                            />
                            <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} name="Customers" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
        </div>
    );
}
