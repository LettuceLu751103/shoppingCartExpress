const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const cartController = {
    getCart: (req, res) => {
        const cartId = req.session.cartId || 0
        console.log(req.session.cartId)
        Cart.findAndCountAll({
            raw: true,
            nest: true,
            include: [
                { model: Product, as: 'items' },
            ],
            where: { id: cartId }
        })
            .then(carts => {
                carts = carts.rows.map(cart => ({
                    ...cart,
                    quantity: cart.items.CartItem.quantity
                }))
                let total = 0
                carts.forEach(cartItem => {
                    total += cartItem.items.price * cartItem.quantity
                })
                if (carts[0].items.id === null) {
                    carts = []
                }
                console.log(carts)
                return res.render('carts', {
                    cartId: req.session.cartId,
                    carts: carts,
                    total: total
                })
            }).catch(error => {
                console.log(error)
            })
    },
    postCart: (req, res) => {

        return Cart.findOrCreate({
            where: {
                id: req.session.cartId || 0,
            },
        }).then((cart) => {
            let [carts, create] = [cart[0], cart[1]]
            if (create) {
                CartItem.findAndCountAll({
                    where: {
                        CartId: carts.dataValues.id,
                        ProductId: req.body.productId
                    }
                }).then(cartItems => {
                    if (cartItems.count === 0) {
                        CartItem.create({
                            CartId: carts.dataValues.id,
                            ProductId: req.body.productId,
                            quantity: 1,

                        }).catch(error => {
                            console.log(error)
                        })
                    }
                    req.session.cartId = carts.dataValues.id
                    return req.session.save(() => {
                        return res.redirect('back')
                    })
                })

            } else {
                CartItem.findOne({
                    where: {
                        CartId: carts.dataValues.id,
                        ProductId: req.body.productId
                    }
                }).then(cartupdate => {
                    if (cartupdate) {
                        cartupdate.update({
                            quantity: cartupdate.dataValues.quantity + 1,
                        }).then(newcart => {
                            req.session.cartId = carts.dataValues.id
                            return req.session.save(() => {
                                return res.redirect('back')
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    } else {
                        CartItem.create({
                            CartId: carts.dataValues.id,
                            ProductId: req.body.productId,
                            quantity: 1,
                        }).then(newcart => {
                            req.session.cartId = carts.dataValues.id
                            return req.session.save(() => {
                                return res.redirect('back')
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    }

                })
            }

        });
    },
    addCartItem: (req, res) => {
        console.log(req.session.cartId)
        console.log('ProductId: ' + req.params.id)
        CartItem.findOne({
            where: {
                CartId: req.session.cartId,
                ProductId: req.params.id
            }
        }).then(item => {
            console.log(item)
            item.update({ quantity: item.dataValues.quantity + 1 })
                .then(itemUpdate => {
                    return res.redirect('back')
                })
                .catch(error => {
                    console.log(error)
                })
        })

    },
    subCartItem: (req, res) => {
        console.log('ProductId: ' + req.params.id)
        console.log('CartId: ' + req.session.cartId)
        CartItem.findOne({
            where: {
                ProductId: req.params.id,
                CartId: req.session.cartId
            }
        }).then(item => {
            console.log(item)
            console.log('============== 準備減少數量 -1 ==============')
            if (item.dataValues.quantity - 1 === 0) {
                item.destroy()
            }
            item.update({ quantity: item.dataValues.quantity - 1 > 0 ? item.dataValues.quantity - 1 : 0 })
                .then(itemUpdate => {
                    return res.redirect('back')
                })
                .catch(error => {
                    console.log(error)
                })
        })
    },
    deleteCartItem: (req, res) => {
        console.log('=== 進入 deleteCartItem ===')
        console.log(req.session.cartId)
        console.log('=== productId ===')
        console.log(req.params.id)
        CartItem.findOne({
            where: {
                CartId: req.session.cartId,
                ProductId: req.params.id
            }
        }).then(cartItem => {
            console.log(cartItem)
            cartItem.destroy()
            return res.redirect('back')
        })
    },
}

module.exports = cartController