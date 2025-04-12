import express from 'express';
import { allOrders, updateStatus, placeOrderStripe, placeOrderRazorPay, placeOrder, userOrders, verifyStripe, verifyRazorpay } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();   // Router object to handle routes

orderRouter.get('/list',adminAuth, allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment Feature
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorPay)
orderRouter.post('/place',authUser,placeOrder)

//user feature
orderRouter.post('/myorders',authUser,userOrders)

//verify payment 
orderRouter.post('/verifyStripe',authUser,verifyStripe)
orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
export default orderRouter;  // Export router object
