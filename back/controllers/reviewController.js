import Review from '../models/reviewModel.js';

export const createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const getReviewsForProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
