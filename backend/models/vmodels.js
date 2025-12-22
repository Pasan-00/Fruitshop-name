import mongoose from "mongoose";

const fruitSchema = mongoose.Schema(
    {
        foodname: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
        },
            unitType: {
                type: String,
                enum: ['weight', 'pieces'],
                default: 'weight',
            },
            unitAmount: {
                type: Number,
                default: 100,
            },
            unitUnit: {
                type: String,
                default: 'g',
            },
            stockUnits: {
                type: Number,
                default: 0,
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
