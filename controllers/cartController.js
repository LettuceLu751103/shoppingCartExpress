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

    },
    postCart: (req, res) => {
        return Cart.findOrCreate({
            where: {
                id: req.session.cartId || 0,
            }
        }).spread(function (cart, created) {
            return CartItem.findOrCreate({
                where: {
                    CartId: cart.id,
                    ProductId: req.body.ProductId

                },
                default: {
                    CartId: cart.id,
                    ProductId: req.body.ProductId
                }
            }).spread(function (cartItem, created) {
                return cartItem.update({
                    quantity: (cartItem.quantity || 0)
                        + 1,
                }).then((cartItem) => {
                    req.session.cartId = cart.id
                    return req.session.save(() => {
                        return res.redirect('back')
                    })
                })
            })
        })
    }
}

module.exports = cartController