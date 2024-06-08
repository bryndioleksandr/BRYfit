import express from "express";
import cookieParser from "cookie-parser";
import { auth } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { createCategory, editCategory, getCategories, removeCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();
const jsonParser = express.json();

categoryRouter.post('/create', cookieParser(), auth, authAdmin, jsonParser, createCategory);
categoryRouter.post('/edit', cookieParser(), auth, authAdmin, jsonParser, editCategory);
categoryRouter.get('/', getCategories);
categoryRouter.delete('/:id', cookieParser(), auth, authAdmin, removeCategory)

export default categoryRouter;