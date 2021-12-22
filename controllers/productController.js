const db = require('../models')
const Product = db.Product


let productController = {
    getProducts: (req, res) => {
        const PAGE_LIMIT = 10
        let PAGE_OFFSET = 0
        const whereQuery = {}
        if (req.query.page) {
            offset = (req.query.page - 1) * pageLimit
        }
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