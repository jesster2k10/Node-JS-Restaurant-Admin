// Admin Controller
var keystone = require('keystone');
var Order = keystone.list('Order').model;
var User = keystone.list('User').model;
var moment = require('moment');

const dates = {
  lastWeek: moment().subtract(1, 'week'),
  lastMonth: moment().subtract(1, 'months'),
  now: new Date(),
}

exports.getNewCustomers = function (req, res) {
  User
    .find()
    .where('createdAt').gt(dates.lastWeek).lt(dates.now)
    .exec(function (error, users) {
      if (error) {
        reject(error)
      }

      if (users) {
        resolve(users.length)
      } else {
        resolve(0)
      }
    })
}

exports.getNewOrders = function (req, res) {
  return new Promise(function (resolve, reject) {
    Order
    .find()
    .where('orderDate').gt(dates.lastWeek).lt(dates.now)
    .exec(function (error, orders) {
      if (error) {
        reject(error);
      }

      if (orders) {
        const total = orders.map(function (order) {
          return order.total;
        }).reduce(function (total, number) {
          return total + Math.round(number);
        }, 0);

        resolve(total);
      } else {
        resolve(0);
      }
    })
  });
}

exports.getPendingOrders = function() {
  return new Promise(function (resolve, reject) {
    Order.find({ status: 'Pending' })
    .exec(function (error, orders) {
      if (error) {
        reject(error);
      }

      if (orders) {
        const total = orders.length;
        resolve(total);
      } else {
        resolve(0);
      }
    })
  })
}