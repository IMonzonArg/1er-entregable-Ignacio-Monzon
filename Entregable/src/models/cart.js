import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
        {
            id_prod: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'products'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

cartSchema.pre('findOne', function() {
    this.populate('products.id_prod');
});

cartSchema.plugin(paginate);

const cartModel = model('carts', cartSchema);

export default cartModel;
