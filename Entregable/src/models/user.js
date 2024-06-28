import { Schema, model } from "mongoose";
import cartModel from '../models/cart.js'

const userSchema = new Schema({
    first_name: { 
        type : String , 
        required : true
    },
    last_name: { 
        type : String , 
        required : true
    },
    password: { 
        type : String , 
        required : true
    },
    age: { 
        type : Number , 
        required : true
    },
    email: { 
        type : String , 
        required : true,
        unique: true,
        index: true
    },
    rol:{
        type:String,
        default:"User"
    },
    cart_Id: {
        type: Schema.Types.ObjectId, 
        ref:'carts'
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
        type: Date
    }

});

userSchema.pre('save', async function(next) {
    try {
        const newCart = await userModel.create()
        this.cart_id = newCart._id
    } catch {
        next(e)
    }
})

userSchema.pre('findOne', async function(next) {
    try {
        const prods = await cartModel.findOne({_id:'COMPLETAR CON ID DEL CART'})
        this.populate('cart_id')
    } catch (e) {

    }
})

userSchema.methods.precioConDescuento = function(precioTotal) {
    if (this.esPremium) {
        return precioTotal * 0.9; // Aplica un descuento del 10%
    }
    return precioTotal;
};


export const userModel = model("users", userSchema)