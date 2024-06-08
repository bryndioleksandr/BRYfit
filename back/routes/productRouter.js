import express from "express";
import { createAndEditProduct, deleteProduct, getAllProducts } from "../controllers/productController.js";
import { auth } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import cookieParser from "cookie-parser";

const productRouter = express.Router();
const jsonParser = express.json()

productRouter.post('/', cookieParser(), auth, authAdmin, createAndEditProduct);
productRouter.get('/', getAllProducts);
productRouter.delete("/", cookieParser(), auth, authAdmin, jsonParser, deleteProduct);

export default productRouter;