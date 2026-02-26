"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatRelativeTime } from "@/lib/utils";

interface Product {
    _id: string;
    name: string;
}

interface Variant {
    _id: string;
    name: string;
    priceAdjustment: number;
    product: Product;
    createdAt: string;
}

export default function VariantsPage() {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", priceAdjustment: 0, product: "" });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [vRes, pRes] = await Promise.all([
                fetch("/api/variants"),
                fetch("/api/products")
            ]);

            if (vRes.ok) setVariants(await vRes.json());
            if (pRes.ok) setProducts(await pRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/variants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ name: "", priceAdjustment: 0, product: "" });
                setIsFormOpen(false);
                fetchData();
            } else {
                alert("Failed to create variant");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string, productId?: string) => {
        if (!confirm("Are you sure you want to delete this variant?")) return;
        try {
            const res = await fetch(`/api/variants/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete variant");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns: ColumnDef<Variant>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{row.original.name}</span>
            )
        },
        {
            accessorKey: "product",
            header: "Product",
            cell: ({ row }) => (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{row.original.product?.name || "N/A"}</span>
            )
        },
        {
            accessorKey: "priceAdjustment",
            header: "Price Adj. ($)",
            cell: ({ row }) => {
                const adj = row.original.priceAdjustment;
                return (
                    <span className={`text-sm ${adj > 0 ? "text-emerald-500" : adj < 0 ? "text-red-500" : "text-zinc-600 dark:text-zinc-400"}`}>
                        {adj > 0 ? "+" : ""}{adj}
                    </span>
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{formatRelativeTime(row.original.createdAt)}</span>
            )
        },
    ];

    return (
        <div className="max-w-full">

            <DataTable
                columns={columns}
                data={variants}
                isLoading={isLoading}
                searchPlaceholder="Search variants..."
                exportFilename="variants"
            />
        </div>
    );
}
