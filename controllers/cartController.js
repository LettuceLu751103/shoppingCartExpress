const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const cartController = {
    getCart: (req, res) => {
        const cartId = req.session.cartId || 0
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
                return res.render('carts', {
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
        console.log('CartId: ' + req.session.CartId)
        console.log('ProductId: ' + req.body.id)
        CartItem.findOne({
            CartId: req.session.CartId,
            ProductId: req.body.id
        })
            .then(item => {
                console.log(item)
                // item.update({ quantity: quantity + 1 })
                // return res.redirect('back')
            })

    },
    subCartItem: (req, res) => {

    },
    deleteCartItem: (req, res) => {

    },
}

module.exports = cartController