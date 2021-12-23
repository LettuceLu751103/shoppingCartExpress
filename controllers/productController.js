const { response } = require('express')
const db = require('../models')
const Product = db.Product
const CartItem = db.CartItem
const Cart = db.Cart

let productController = {
    getProducts: (req, res) => {
        const PAGE_LIMIT = 10
        let PAGE_OFFSET = 0
        const whereQuery = {}
        if (req.query.page) {
            offset = (req.query.page - 1) * pageLimit
        }

        // console.log(req.session)
        // console.log(req.session.cartId)
        const cartFindAll = Cart.findByPk(req.session.cartId || 0, {
            include: [
                { model: Product, as: 'items' }
            ]
        })
        const productFindAll = Product.findAndCountAll({
            offset: PAGE_OFFSET,
            limit: PAGE_LIMIT,
            raw: true,
            nest: true
        })
        Promise.all([cartFindAll, productFindAll])
            .then(responses => {
                let [carts, products] = responses
                // console.log('===============================')
                // console.log(carts)
                // console.log('===============================')
                // // console.log(products)
                // console.log('===============================')
                const page = Number(req.query.page) || 1
                const pages = Math.ceil(products.count / PAGE_LIMIT)
                // console.log(pages)
                const totalPage = Array.from({ length: pages }).map((item, index) => (index + 1))
                const prev = page - 1 < 1 ? 1 : page - 1
                const next = page + 1 > pages ? pages : page + 1
                let total = 0
                // carts = carts.dataValues.
                if (carts) {
                    // console.log(carts.dataValues.items)
                    carts = carts.dataValues.items.map(cart => ({
                        ...cart.dataValues,
                        quantity: cart.dataValues.CartItem.quantity
                    }))
                    carts.forEach(cart => {
                        // console.log(cart)
                        total += cart.quantity * cart.price
                    })
                }

                return res.render('products', {
                    products: products.rows,
                    page, pages, prev, next, total, carts
                })
            })
        // Product.findAndCountAll({
        //     offset: PAGE_OFFSET,
        //     limit: PAGE_LIMIT,
        //     raw: true,
        //     nest: true
        // }).then(products => {
        //     const page = Number(req.query.page) || 1
        //     const pages = Math.ceil(products.count / PAGE_LIMIT)
        //     console.log(pages)
        //     const totalPage = Array.from({ length: pages }).map((item, index) => (index + 1))
        //     const prev = page - 1 < 1 ? 1 : page - 1
        //     const next = page + 1 > pages ? pages : page + 1

        //     return res.render('products', {
        //         products: products.rows,
        //         page, pages, prev, next
        //     })
        // })
    }
}


module.exports = productController