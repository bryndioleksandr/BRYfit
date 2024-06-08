import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const createOrder = async (req, res) => {
    const { userId, name, address, cart } = req.body;
    const newOrder = {
        user: userId,
        name,
        address,
        cart
    }
    await Order.create(newOrder)
            .then(res.status(200).json({ msg: 'Order completed successfully' }))
            .catch(error => {
                console.error('Creating order error:', error);
                res.status(401).json({ message: 'Error saving the order in the database' });
              });
}

export const getOrders = async (req, res) => {
    try {
        const userId = req.params.userId
        await User.find({_id: userId})
                .then (async (data) => {
                    // Якщо користувач isAdmin - відправляємо всі замовлення
                    const findedUser = data[0];
                    if (findedUser.isAdmin) {
                        await Order.find()
                            .sort({ _id: -1 })
                            .then( allOrders => {
                                res.status(200).json(allOrders);
                            })
                            .catch ( err => {
                                console.log('Failed to select all orders', err);
                                res.status(401).json({ message: 'Failed to select all orders' });
                            })
                    } else {
                    // інакше - відправляємо замовлення авторизованого покупця
                        await Order.find({user: userId})
                            .sort({ _id: -1 })
                            .then( userOrders => {
                                res.status(200).json(userOrders);
                            })
                            .catch ( err => {
                                console.log('Failed to select user orders', err);
                                res.status(401).json({ message: 'Failed to select user orders' });
                            })
                    }
                })
                .catch(error => {
                    console.error('Error retrieving user data from the database:', error);
                    res.status(401).json({ message: 'Error retrieving user data from the database' });
                  });
        } catch (error) {
            console.error('Error retrieving userId:', error);
            res.status(401).json({ message: 'Error retrieving userId' });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
    const orderID = req.params.orderId;
    const status = req.body;
        await Order.findByIdAndUpdate(orderID, status)
        .then( res.status(200).json({msg: "Order status updated"}))
        .catch( err => {
            console.error('Error updating order status in database:', err);
            res.status(401).json({ msg: 'Error updating order status in database' });
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Error updating order status' });
    }
}