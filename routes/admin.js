'use strict'

var express = require('express');
var router = express.Router();

router.get('/player/lookup', (req, res) => {
    const info = req.session;
    if(info.admin) {
        res.render('admin/playerlookup', {admin:info.admin,dev:info.dev,username:info.username})
    } else {
        res.redirect('/')
    }
});

router.get('/player/garage', (req, res) => {
    const info = req.session;
    if(info.admin) {
        res.render('admin/garagelookup', {admin:info.admin,dev:info.dev,username:info.username})
    } else {
        res.redirect('/')
    }
});

router.get('/comp/calc', (req, res) => {
    const info = req.session;
    if(info.admin) {
        res.render('admin/compcalc', {admin:info.admin,dev:info.dev,username:info.username})
    } else {
        res.redirect('/')
    }
});

module.exports = router;