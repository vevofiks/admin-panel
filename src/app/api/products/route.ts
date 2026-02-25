import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/core/models/Product";
import "@/core/models/Category"; // ensure Category is registered
import "@/core/models/Variant"; // ensure Variant is registered

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({})
            .populate("category", "name")
            .populate("variants")
            .sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Ensure category is passed correctly or handle if empty
        if (!body.category || body.category === "") {
            delete body.category;
        }

        const product = await Product.create(body);

        // return populated product
        const populatedProduct = await Product.findById(product._id)
            .populate("category", "name")
            .populate("variants");

        return NextResponse.json(populatedProduct, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to create product", details: error.message },
            { status: 500 }
        );
    }
}
