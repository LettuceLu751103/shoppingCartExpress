const db = require('../models')
const OrderItem = db.OrderItem
const Order = db.Order
const Product = db.Product

const orderController = {
    getOrders: (req, res) => {
        console.log('=== 進入 getOrder ===')
        Order.findAll({
            include: 'items',

        }).then(orders => {
            console.log(orders)
            console.log(orders[0].dataValues)
            console.log('==================================')
            console.log(orders[0].dataValues.items)

            return res.render('orders', { orders })
        })

    },

    postOrders: (req, res) => {
        console.log('=== 進入 postOrder ===')
        console.log(req.body)
    }
}


module.exports = orderController