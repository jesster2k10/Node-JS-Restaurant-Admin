// Panel

var controller = require('../../controllers/adminController');

exports.getInfo = function(req, res) {
  let newOrdersPromise = controller.getNewOrders();
  let newCustomersPromise = controller.getNewCustomers();
  let pendingOrdersPromise = controller.getPendingOrders();

  Promise.all([
    newOrdersPromise,
    newCustomersPromise,
    pendingOrdersPromise,
  ]).then(data => {
    res.status(200).json({
      success: true,
      newOrders: data[0],
      newCustomers: data[1],
      pendingOrders: data[2],
    })
  }).catch(error => {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  })
}