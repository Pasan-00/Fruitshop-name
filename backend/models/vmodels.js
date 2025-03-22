import mongoose from "mongoose";

const fruitSchema = mongoose.Schema(
    {
        foodname: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
        },
        image: {
            type: String, 
            required: true,
        },
        discount: {
            type: Number,
        },
        total: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const Fruit = mongoose.model('Fruit', fruitSchema);
