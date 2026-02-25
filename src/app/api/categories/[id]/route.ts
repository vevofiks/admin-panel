
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Category from "@/core/models/Category";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch category" },
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
        const category = await Category.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(category);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update category" },
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
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
