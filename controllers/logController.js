const {Logs} = require('../models/log');

const _ = require('lodash');
// Display list of all logs.
exports.log_list = function(req, res) {
    res.send('NOT IMPLEMENTED: user list');
};

exports.log = async function(arr) {
    console.log(arr)
    log = new Logs(_.pick(arr, ['user', 'action','ip','info']));
    await log.save();
    return true;
};