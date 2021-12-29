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

            orders = orders.map(order => ({
                ...order.dataValues,
                cancelOrder: !(order.shipping_status === '-1')
            }))



            console.log(orders)

            return res.render('orders', { orders, cancelOrder: orders.cancelOrder })
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
    },
    cancelOrder: (req, res) => {
        return Order.findByPk(req.params.id).then(order => {
            order.update({
                // ...req.body,
                shipping_status: '-1',
                payment_status: '-1',
            }).then(order => {
                console.log(order)

                return res.redirect('/cart')
            })
        })
    }

}


module.exports = orderController