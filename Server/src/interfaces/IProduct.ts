import { Document } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    thumbnails: string[];
    code: string;
    stock: number;
    status: boolean;
    category: string;
    quantity: number;
    pID?: number;
}
