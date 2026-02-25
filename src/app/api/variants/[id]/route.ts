import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Variant from "@/core/models/Variant";
import Product from "@/core/models/Product";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const variant = await Variant.findById(id).populate("product", "name");

        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 });
        }

        return NextResponse.json(variant);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch variant" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id } = await params;

        const variant = await Variant.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 });
        }

        return NextResponse.json(variant);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to update variant" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const variant = await Variant.findById(id);

        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 });
        }

        // Remove variant from product
        if (variant.product) {
            await Product.findByIdAndUpdate(
                variant.product,
                { $pull: { variants: variant._id } }
            );
        }

        await Variant.findByIdAndDelete(id);

        return NextResponse.json({ message: "Variant deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete variant" },
            { status: 500 }
        );
    }
}
