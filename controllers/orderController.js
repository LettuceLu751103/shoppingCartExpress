const db = require('../models')
const OrderItem = db.OrderItem
const Order = db.Order
const Product = db.Product
const Cart = db.Cart

const orderController = {
    getOrders: (req, res) => {
        console.log('=== 進入 getOrder ===')
        Order.findAll({
            include: 'items',
            order: [['createdAt', 'DESC']]

        }).then(orders => {


            return res.render('orders', { orders })
        })

    },

    postOrders: (req, res) => {
        console.log('=== 進入 postOrder ===')
        console.log(req.body)
        return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
            return Order.create(
                { name, address, phone, shipping_status, payment_status, amount } = req.body
            ).then(order => {

                let results = [];
                for (let i = 0; i < cart.items.length; i++) {
                    console.log(order.id, cart.items[i].id)
                    results.push(
                        OrderItem.create({
                            OrderId: order.id,
                            ProductId: cart.items[i].id,
                            price: cart.items[i].price,
                            quantity: cart.items[i].CartItem.quantity,
                        })
                    );
                }

                return Promise.all(results).then(() =>
                    res.redirect('/orders')
                );
            })
        })
    }
}


module.exports = orderController