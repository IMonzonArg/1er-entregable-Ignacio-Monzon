import productModel from '../models/product.js'

export const getProducts = async (limit, page, filter, ord ) => {
    let metFilter
    const pag = page !== undefined ? page : 1;
    const limi = limit !== undefined ? limit : 10;

    if(filter == "true" || filter == "false") {
        metFilter = "status"
    } else {
        if (filter !== undefined)
            metFilter = "category"
    }

    const query = metFilter != undefined ? {[metFilter]: filter } : {};
    const ordQuery = ord !== undefined ? { price : ord } : {};

    const products = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery })
    return prods
}

export const getProduct = async (id) => {
        const product = await productModel.findById(id);
        return product
}

export const createProduct = async () => {
    const message = await productModel.create(prod)
    return message
}



export const updateProduct = async (id, prodUpdate) => {
    const message = await productModel.findByIdAndUpdate(id, prodUpdate)
    return message
}

export const deleteProduct = async (id) => {
    const message = await productModel.findByIdAndDelete(id)
    return message
}