import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Variant from "@/core/models/Variant";
import Product from "@/core/models/Product";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        let query = {};
        if (productId) {
            query = { product: productId };
        }

        const variants = await Variant.find(query)
            .populate("product", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(variants);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch variants" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Create the variant
        const variant = await Variant.create(body);

        // Add variant to product's variants array
        if (variant.product) {
            await Product.findByIdAndUpdate(
                variant.product,
                { $push: { variants: variant._id } }
            );
        }

        return NextResponse.json(variant, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to create variant" },
            { status: 500 }
        );
    }
}
