import {v2 as cloudinary} from 'cloudinary';    
import productModel from '../models/productModel.js';

// function for adding a product
const addProduct = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);

    try {
        // Extract images from files
        const images = [];
        for (let i = 1; i <= 4; i++) {
            if (req.files[`image${i}`]) {
                images.push(req?.files[`image${i}`][0]?.filename);
            }
        }

        // Create new product
        const product = new productModel({
            name: req?.body?.name,
            description: req?.body?.description,
            category: req?.body?.category,
            subCategory: req?.body?.subCategory,
            price: parseFloat(req?.body?.price),
            image: images,
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes],  // ✅ FIXED
            bestseller: req?.body?.bestseller === 'true',
            date: Date.now()
        });

        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding product',
            error: error.message
        });
    }
};



// for list products
 const listProducts = async (req, res) => {
    try {
        const products = await productModel.find();

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// for removing a product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true , message: "Product Removed"})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

//for single product info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true , product})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export { addProduct, listProducts, removeProduct, singleProduct }

