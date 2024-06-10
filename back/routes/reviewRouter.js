import express from "express";
const reviewRouter = express.Router();
import { createReview, getReviewsForProduct, deleteReview } from '../controllers/reviewController.js';

reviewRouter.post('/products/:productId/reviews', createReview);
reviewRouter.get('/products/:productId/reviews', getReviewsForProduct);
reviewRouter.delete('/reviews/:id', deleteReview);

export default reviewRouter;