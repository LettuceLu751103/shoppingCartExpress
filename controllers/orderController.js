
const orderController = {
    getOrders: (req, res) => {
        console.log('=== 進入 getOrder ===')

        return res.render('orders', {})
    },

    postOrders: (req, res) => {
        console.log('=== 進入 postOrder ===')
        console.log(req.body)
    }
}


module.exports = orderController