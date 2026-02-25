"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatRelativeTime } from "@/lib/utils";

interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ name: "", description: "" });
                setIsFormOpen(false);
                fetchCategories();
            } else {
                alert("Failed to create category");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchCategories();
            } else {
                alert("Failed to delete category");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-zinc-200">{row.original.name}</span>
            )
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="text-sm text-zinc-400">{row.original.description || "N/A"}</span>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <span className="text-sm text-zinc-400">{formatRelativeTime(row.original.createdAt)}</span>
            )
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end pr-4">
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="text-xs text-red-500 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-100">Categories</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">{categories.length} categories</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                    {isFormOpen ? "Cancel" : "+ Add Category"}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
                    <h2 className="text-sm font-medium text-zinc-100 mb-4">New Category</h2>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex-1 bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="flex-1 bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg transition-colors"
                        >
                            Save Category
                        </button>
                    </form>
                </div>
            )}

            <DataTable
                columns={columns}
                data={categories}
                isLoading={isLoading}
                searchPlaceholder="Search categories..."
                exportFilename="categories"
            />
        </div>
    );
}
