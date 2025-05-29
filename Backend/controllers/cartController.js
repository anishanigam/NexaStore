import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const {  size, itemId } = req.body;

        const userData = await userModel.findById(userId)
         if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cart = userData.cart || {};

        let status = 'new';

        if(cart[itemId]) {
            if(cart[itemId][size]) {
                cart[itemId][size] += 1;
            } else {
                cart[itemId][size] = 1;
            }
        }else {
            cart[itemId] = {}
            cart[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId , {cart})
        
        res.status(200).json({success:true , message : "Item added to cart",status})
    }catch (error) {
       console.error("Error adding to cart:", error); 
        res.status(500).json({success:false , message : error.message})
    }
 }

 
// update user cart
const updateCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const { userId ,size , quantity } = req.body;

        const userData = await userModel.findById(userId)
        let cart = await userData.cart;

        cart[itemId][size] = quantity;

        await userModel.findByIdAndUpdate
        (userId , {cart})

        res.json({success:true , message : "Cart updated"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message : error.message})
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    console.log("working fine")
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId)
        const cart = await userData?.cart;

        res.json({success:true , cart})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message : error.message})
    }
}

export { addToCart, updateCart, getUserCart }   