import User from "../models/userModel.js";

export const authAdmin = async (req, res, next) => {
    try {
        await User.findOne({_id: req.user._id})
        .then( user => {
            if (user.isAdmin === false)
                return res.status(400).json({msg: "Access to the admin panel blocked"})
            next()
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}