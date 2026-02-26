"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, cn } from "@/lib/utils";
import { Package, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { VariantsModal } from "@/components/products/VariantsModal";

interface Category {
    _id: string;
    name: string;
}

interface Variant {
    _id: string;
    name: string;
    priceAdjustment: number;
}

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    quantity: number;
    status: string;
    category?: Category;
    variants: Variant[];
    image?: string;
}

const statusClass: Record<string, string> = {
    active: "badge-active",
    draft: "badge-draft",
    archived: "badge-archived",
};

const inputCls =
    "w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600";

const selectCls =
    "w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        basePrice: 0,
        quantity: 0,
        status: "active",
        category: "",
        image: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/categories"),
            ]);
            if (pRes.ok) setProducts(await pRes.json());
            if (cRes.ok) setCategories(await cRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () =>
        setFormData({ name: "", basePrice: 0, quantity: 0, status: "active", category: "", image: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                resetForm();
                setIsFormOpen(false);
                fetchData();
            } else {
                alert("Failed to create product");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
            else alert("Failed to delete product");
        } catch (error) {
            console.error(error);
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            id: "product",
            header: "Product",
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="flex items-center gap-3">
                        {p.image ? (
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Package size={16} className="text-zinc-600" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{p.name}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <span className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    {row.original.category?.name || "Uncategorized"}
                </span>
            ),
        },
        {
            accessorKey: "basePrice",
            header: "Base Price",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{formatCurrency(row.original.basePrice)}</span>
            ),
        },
        {
            accessorKey: "quantity",
            header: "Stock",
            cell: ({ row }) => {
                const q = row.original.quantity;
                return (
                    <span className={cn("text-sm font-medium", q === 0 ? "text-red-500" : q < 20 ? "text-amber-500" : "text-emerald-500")}>
                        {q === 0 ? "Out" : q}
                    </span>
                );
            },
        },
        {
            id: "variants",
            header: "Variants",
            cell: ({ row }) => (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{row.original.variants?.length || 0}</span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const val = getValue<string>() || "active";
                return (
                    <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize", statusClass[val])}>
                        {val}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2 pr-4">
                    <button
                        onClick={() => setSelectedProductForVariants(row.original)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                    >
                        <Plus size={12} /> Variants
                    </button>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="text-xs text-red-500 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-[1400px]">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Products</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">{products.length} products</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                    + Add Product
                </button>
            </div>

            {/* Add Product Dialog */}
            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) resetForm();
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new product to your catalog.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="mt-1 space-y-4">
                        {/* Row 1 — Name + Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-name">
                                    Product Name <span className="text-red-500">*</span>
                                </Label>
                                <input
                                    id="prod-name"
                                    type="text"
                                    placeholder="e.g. Classic T-Shirt"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-price">
                                    Base Price <span className="text-red-500">*</span>
                                </Label>
                                <input
                                    id="prod-price"
                                    type="number"
                                    placeholder="0.00"
                                    min={0}
                                    step={0.01}
                                    value={formData.basePrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                                    }
                                    className={inputCls}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 — Stock + Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-qty">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </Label>
                                <input
                                    id="prod-qty"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                                    }
                                    className={inputCls}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-category">Category</Label>
                                <select
                                    id="prod-category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className={selectCls}
                                >
                                    <option value="">No Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3 — Status + Image URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-status">Status</Label>
                                <select
                                    id="prod-status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={selectCls}
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="prod-image">Image URL</Label>
                                <input
                                    id="prod-image"
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors"
                            >
                                {isSubmitting ? "Saving…" : "Save Product"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable
                columns={columns}
                data={products}
                isLoading={isLoading}
                searchPlaceholder="Search products..."
                exportFilename="products"
            />

            {/* Variants Modal Component */}
            <VariantsModal
                isOpen={!!selectedProductForVariants}
                product={selectedProductForVariants}
                onClose={() => setSelectedProductForVariants(null)}
                onUpdate={fetchData}
            />
        </div>
    );
}
