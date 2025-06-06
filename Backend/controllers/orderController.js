
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from 'razorpay'

//global variables
const currency = 'inr'
const deliveryCharge = 10



//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const razorpayInstance = new razorpay({
//     key_id : process.env.RAZORPAY_KEY_ID,
//     key_secret : process.env.RAZORPAY_KEY_SECRET    
// })

// placing orders using COD Method

const placeOrder = async (req, res) => {
     try {
        const {userId, items, amount, address} = req.body;
        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date:Date.now()
        })
        await order.save();
        await userModel.findByIdAndUpdate(userId, {cartData:{}})
        res.json({ success:true ,message: 'Order Placed Successfully'})
     } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message})
         }
} 

//using stripe Method

const placeOrderStripe = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const {origin} =req.headers;

        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Stripe',
            payment: false,
            date:Date.now()
        })
        await order.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name: item.name
                },
                unit_amount:item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge*100
            },
            quantity: 1 
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${order._id}`,
            cancel_url : `${origin}/verify?success=false&orderId=${order._id}`,
            line_items,
            mode:'payment',

        })

        res.json({success:true ,session_url : session.url});


    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message})
    }
}

//verify Stripe
const verifyStripe = async (req,res) => {
    const {orderId , success ,userId} = req.body

    try {
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId , {payment:true});
            await userModel.findByIdAndUpdate(userId , {cartData: {}})
            res.json({success: true});
        } else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message})
    }
}

// using RazorPay method
const placeOrderRazorPay = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const order = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date:Date.now()
        })
        await order.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : order._id.toString()
        }

        //  razorpayInstance.orders.create(options,(error,order)=> {

        //     if(error) {
        //         console.log(error)
        //         return res.json({success:false , message: error})
        //     }
        //     res.json({success : false , order})
        // })
    } catch (error) {
        console.log(error)
        res.json({success: false , message: error.message
        })
    }
}

const verifyRazorpay = async(req,res) => {
    try {
        const { userId , razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
         if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt , {payment: true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success: true , message: "Payment Successful"})
         }else{
            res.json({success:false , message: 'Payment Failed'});
         }
    } catch (error) {
        console.log(error)
        res.json({success: false , message: error.message
        })
    }

}

// All ordes data for admin panel
const allOrders = async (req, res) => {
    console.log("working till here")
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// user order data for frontend
const userOrders = async (req, res) => {    
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({userId}).sort({date: -1})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// update order status frrom admin pannel
const updateStatus = async (req, res) => {
    try {
        const {orderId,status} =req.body

        await orderModel.findByIdAndUpdate(orderId , {status})
        res.json({success:true , message : 'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success: false , message:error.message})
        
    }
}

export {verifyRazorpay,verifyStripe,placeOrder, placeOrderStripe, placeOrderRazorPay, allOrders, userOrders, updateStatus}