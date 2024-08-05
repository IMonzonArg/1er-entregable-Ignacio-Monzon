import { Schema, model } from "mongoose";
import cartModel from '../models/cart.js';

const userSchema = new Schema({
    first_name: { 
        type: String, 
        required: true
    },
    last_name: { 
        type: String, 
        required: true
    },
    password: { 
        type: String, 
        required: true
    },
    age: { 
        type: Number, 
        required: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        index: true
    },
    rol:{
        type: String,
        default: "User"
    },
    cart_Id: {
        type: Schema.Types.ObjectId, 
        ref: 'carts'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    documents: {
        type: Object,
        default: []
    },
    last_connection: {
        type: Date,
        default: Date.now 
    }
});

userSchema.pre('save', async function(next) {
    if (this.isNew) { 
        try {
            const newCart = await cartModel.create({});
            if (newCart && newCart._id) {
                this.cart_Id = newCart._id;
                console.log('Nuevo carrito creado con ID:', newCart._id);
            } else {
                throw new Error('Error al crear el carrito');
            }
            next();
        } catch (e) {
            next(e);
        }
    } else {
        next();
    }
});

userSchema.pre('findOne', async function(next) {
    try {
        this.populate('cart_Id');
        next();
    } catch (e) {
        next(e);
    }
});

userSchema.methods.precioConDescuento = function(precioTotal) {
    if (this.isPremium) {
        return precioTotal * 0.9; 
    }
    return precioTotal;
};

export const userModel = model("users", userSchema);
