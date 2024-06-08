import express from "express";
import cookieParser from "cookie-parser";
import { auth } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post('/create', cookieParser(), auth, jsonParser, createOrder);
orderRouter.get('/:userId', cookieParser(), auth, getOrders);
orderRouter.patch('/:orderId', cookieParser(), auth, authAdmin, jsonParser, updateOrderStatus);

export default orderRouter;