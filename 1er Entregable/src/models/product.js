import { Schema, model } from "mongoose";

const productSchema = new Schema ({
    title: { 
        type : String , 
        required : true
    },
    description: { 
        type : String , 
        required : true
    },
    stock: { 
        type : Number , 
        required : true
    },
    code: {
        type: String,
        unique: true
    },
    code: {
        type: String,
        unique: true
    },
    thumbnail: {
        default: []
    }
})

export const productModel = model("products", productSchema)