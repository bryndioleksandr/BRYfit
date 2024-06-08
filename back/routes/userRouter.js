import express from "express";
import { cartUpdate, refreshToken, userLogin, userLogout, userRegister } from "../controllers/userController.js";
import cookieParser from "cookie-parser";
import { auth } from "../middleware/auth.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post('/register', jsonParser, userRegister);
userRouter.post('/refresh_token', cookieParser(), auth, refreshToken);
userRouter.get('/logout', userLogout );
userRouter.post('/login', jsonParser, userLogin );
userRouter.patch('/cart', cookieParser(), auth, jsonParser, cartUpdate );

export default userRouter;
