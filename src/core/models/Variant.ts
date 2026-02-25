import mongoose, { Schema, Document } from "mongoose";

export interface IVariant extends Document {
    name: string;
    options: Record<string, string>;
    priceAdjustment: number;
    product: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const VariantSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: Map,
            of: String,
            default: {},
        },
        priceAdjustment: {
            type: Number,
            default: 0,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Variant ||
    mongoose.model<IVariant>("Variant", VariantSchema);
