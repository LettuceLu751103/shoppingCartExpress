const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const cartController = {
    getCart: (req, res) => {
        Cart.findAndCountAll({
            raw: true,
            nest: true,
            include: [
                { model: Product, as: 'items' },
            ]
        })
            .then(carts => {
                console.log(carts.rows)
                return res.render('carts', {
                    carts: carts.rows
                })
            }).catch(error => {
                console.log(error)
            })

    }
}

module.exports = cartController