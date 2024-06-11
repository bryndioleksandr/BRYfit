import express from 'express';
import productRouter from './productRouter.js';
import userRouter from './userRouter.js';
import categoryRouter from './categoryRouter.js';
import orderRouter from './orderRouter.js';
import reviewRouter from "./reviewRouter.js";

const router = express.Router();

router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);
router.use('/review', reviewRouter);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front', 'index.html'));
});
router.use('/', productRouter);

export default router;