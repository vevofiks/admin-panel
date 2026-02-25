import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Variant {
    _id: string;
    name: string;
    priceAdjustment: number;
}

interface Product {
    _id: string;
    name: string;
    variants: Variant[];
}

interface VariantsModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const inputCls = "w-full bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600";

export function VariantsModal({ product, isOpen, onClose, onUpdate }: VariantsModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", priceAdjustment: 0 });

    if (!product) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/variants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    priceAdjustment: formData.priceAdjustment,
                    product: product._id
                }),
            });
            if (res.ok) {
                setFormData({ name: "", priceAdjustment: 0 });
                onUpdate();
            } else {
                alert("Failed to create variant");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (variantId: string) => {
        if (!confirm("Delete this variant?")) return;
        try {
            const res = await fetch(`/api/variants/${variantId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                onUpdate();
            } else {
                alert("Failed to delete variant");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Variants for {product.name}</DialogTitle>
                    <DialogDescription>
                        Manage product options like size, color, or material.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    {/* Existing Variants List */}
                    <div className="space-y-2">
                        <Label>Current Variants ({product.variants.length})</Label>
                        {product.variants.length === 0 ? (
                            <div className="text-sm text-zinc-500 py-3 text-center border border-zinc-800/50 border-dashed rounded-lg">
                                No variants found. Add one below.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {product.variants.map(v => (
                                    <div key={v._id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{v.name}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                Price Adj: {v.priceAdjustment > 0 ? "+" : ""}{v.priceAdjustment}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(v._id)}
                                            className="text-zinc-500 hover:text-red-500 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                                            title="Delete variant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <hr className="border-zinc-800" />

                    {/* Add New Variant Form */}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Label>Add New Variant</Label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Name (e.g. Size: XL)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputCls}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price Adj. (+/-)"
                                value={formData.priceAdjustment}
                                onChange={(e) => setFormData({ ...formData, priceAdjustment: parseFloat(e.target.value) || 0 })}
                                className={`${inputCls} w-32`}
                                step={0.01}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg transition-colors border border-zinc-700"
                        >
                            {isSubmitting ? "Adding..." : "Add Variant"}
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
