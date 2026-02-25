import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Category from "@/core/models/Category";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const category = await Category.create(body);
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
