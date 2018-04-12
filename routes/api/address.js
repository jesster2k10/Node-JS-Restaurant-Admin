var keystone = require('keystone');

let Address = keystone.list('Address');

exports.create = function(req, res) {
  const address = new Address.model(req.body);
  address.save((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to save address',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.retrieve = function(req, res) {
  Address.model.findById(req.params.id).exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to retrieve address',
      });
    }

    res.json({
      success: true,
      results
    })
  });
}

exports.delete = function(req, res) {
  Address.model.remove({ _id: req.params.id }).exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to delete address',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.list = function(req, res) {
  Address.model.find().where('user', req.body.user).exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to list addresses',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.update = function(req, res) {
  Address.model.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to update address',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}
