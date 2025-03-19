import express from 'express';
import { addToCart ,getUserCart , updateCart } from '../controllers/cartController';
import authUser from '../middleware/auth';

const cartRouter = express.Router();

cartRouter.post('/add', authUser,addToCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/get', authUser, getUserCart);

export default cartRouter;