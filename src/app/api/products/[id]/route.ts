import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/core/models/Product";
import Variant from "@/core/models/Variant";
import "@/core/models/Category";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("variants");

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch product" },
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

        if (body.category === "") {
            body.category = null;
        }

        const product = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
            .populate("category", "name")
            .populate("variants");

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to update product", details: error.message },
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

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // optional: delete variants associated with the product
        if (product.variants && product.variants.length > 0) {
            await Variant.deleteMany({ _id: { $in: product.variants } });
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
