
const orderController = {
    getOrders: (req, res) => {
        console.log('=== 進入 getOrder ===')
    },

    postOrders: (req, res) => {
        console.log('=== 進入 postOrder ===')
        console.log(req.body)
    }
}


module.exports = orderController