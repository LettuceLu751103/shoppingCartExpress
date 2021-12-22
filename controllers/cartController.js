const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const cartController = {
    getCart: (req, res) => {
        console.log(req.session)
        Cart.findAndCountAll({
            raw: true,
            nest: true,
            include: [
                { model: Product, as: 'items' },
            ]
        })
            .then(carts => {
                // console.log(carts.rows)
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
            },
        }).then((cart) => {
            let [carts, create] = [cart[0], cart[1]]
            console.log('===============================')
            console.log(create)
            console.log('===============================')

            if (create) {
                console.log("進入create")
                console.log("CartId:")
                console.log(carts.dataValues.id)
                console.log("ProductId")
                console.log(req.body.productId)
                console.log("session")
                console.log(req.session)

                CartItem.findAndCountAll({
                    where: {
                        CartId: carts.dataValues.id,
                        ProductId: req.body.productId
                    }
                }).then(cartItems => {
                    console.log("進入cartItems")

                    if (cartItems.count === 0) {
                        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

                        // console.log(cartItems)
                        CartItem.create({
                            CartId: carts.dataValues.id,
                            ProductId: req.body.productId,
                            quantity: 1,

                        }).then(newcart => {

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

                console.log("進入else")
                console.log("CartId:")
                console.log(carts.dataValues.id)
                console.log("ProductId")
                console.log(req.body.productId)
                console.log("session")
                console.log(req.session)

                CartItem.findOne({
                    where: {
                        CartId: carts.dataValues.id,
                        ProductId: req.body.productId
                    }
                }).then(cartupdate => {
                    console.log('====================================')

                    console.log(cartupdate)
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
}

module.exports = cartController