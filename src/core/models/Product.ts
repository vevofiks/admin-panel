import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    image?: string;
    basePrice: number;
    quantity: number;
    status: "active" | "draft" | "archived";
    category?: mongoose.Types.ObjectId;
    variants: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "draft", "archived"],
            default: "active",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        variants: [
            {
                type: Schema.Types.ObjectId,
                ref: "Variant",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product ||
    mongoose.model<IProduct>("Product", ProductSchema);
