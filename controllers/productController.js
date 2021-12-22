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

        console.log(req.session)
        console.log(req.session.cartId)
        Cart.findByPk(req.session.cartId || 0, {
            include: [
                { model: Product, as: 'items' }
            ]
        }).then(cartItems => {
            console.log(cartItems)
        }).catch(error => {
            console.log(error)
        })

        Product.findAndCountAll({
            offset: PAGE_OFFSET,
            limit: PAGE_LIMIT,
            raw: true,
            nest: true
        }).then(products => {
            const page = Number(req.query.page) || 1
            const pages = Math.ceil(products.count / PAGE_LIMIT)
            console.log(pages)
            const totalPage = Array.from({ length: pages }).map((item, index) => (index + 1))
            const prev = page - 1 < 1 ? 1 : page - 1
            const next = page + 1 > pages ? pages : page + 1
            // console.log(products)
            // products = products.rows.map(r => ({
            //     ...r.dataVaules,

            // }))
            return res.render('products', {
                products: products.rows,
                page, pages, prev, next
            })
        })
    }
}


module.exports = productController