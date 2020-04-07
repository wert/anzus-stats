const {User, validate} = require('../models/user');
const {log} = require('./logController');
const {validateSession,formatNumber,prettyMoney,uidguid,parseNum} = require('../utils/functions');
const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
// Display list of all users.
exports.user_list = function(req, res) {
    res.send('NOT IMPLEMENTED: user list');
};

exports.login = async function(req, reply) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    if((req.xhr || req.headers.accept.indexOf('json') > -1)) {
        const { error } = validate(req.body);
        if (error) {
            return reply.send(error.details[0].message);
        }
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            return reply.send({"code":403,"message":"Incorrect username or password"});
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return reply.send({"code":403,"message":"Incorrect username or password"});
        }
        req.session.username = user.username;
        req.session.dev = user.dev;
        req.session.slt = user.slt;
        req.session.admin = user.admin;
        req.session.authenticated = true;
        await log({user:user.username,action:"Logged In",ip:req.cf_ip,info:undefined});
        reply.send({"code":200,"message":"Logged in"});
    } else {
      reply.send({"code":403,"message":"Unauthorized"})
    }
};

exports.create = async function(req, res) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    var check = await validateSession(req);
    if(!check) return res.send({"code":403,"message":"Nice try m8"});
    if((req.xhr || req.headers.accept.indexOf('json') > -1)) {
      if(!req.session.dev || !req.session.slt) return res.send({"code":403,"message":"Unauthorized"});
      var val = {username:req.body.username,password:req.body.password};
      const { error } = validate(val);
      if (error) {
          return res.send(error.details[0].message);
      }
      let user = await User.findOne({ username: req.body.username });
      if (user) {
          return res.send({"code":403,"message":"Already exists"});
      } else {
          user = new User(_.pick(req.body, ['username', 'password']));
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          user.slt = req.body.slt;
          await user.save();
          res.send({"code":200,"message":"User created"});
          await log({user:req.session.username,action:"Created User",ip:req.cf_ip,info:`Created - ${req.body.username} SLT - ${req.body.slt}`});
      }
    } else {
        res.send({"code":403,"message":"Unauthorized"})
    }
};

exports.update = async function(req, res) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    var check = await validateSession(req);
    if(!check) return res.send({"code":403,"message":"Nice try m8"});
    if((req.xhr || req.headers.accept.indexOf('json') > -1)) {

      let user = await User.findOne({ username: `${req.body.oldusername}` });
      if (!user) {
          return res.send({"code":403,"message":"This is funny..some sort of error"});
      }
      if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      user.username = req.body.newusername;
      user.slt = req.body.slt;
      user.admin = req.body.admin;
      await user.save();
      res.send({"code":200,"message":"Done"});
      await log({user:req.session.username,action:"Updated User",ip:req.cf_ip,info:`Updated - ${req.body.username} New Username - ${req.body.newusername} SLT - ${req.body.slt} admin -  ${req.body.admin}`});
  } else {
    res.send({"code":403,"message":"Unauthorized"})
  }
};

exports.delete = async function(req, res) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    var check = await validateSession(req);
    if(!check) return res.send({"code":403,"message":"Nice try m8"});
      if((req.xhr || req.headers.accept.indexOf('json') > -1)) {
        if(req.session.username == req.body.username) return res.send({"code":403,"message":"Unauthorized"});
        if(!req.session.authenticated) return res.send({"code":403,"message":"Unauthorized"});
        if(!req.session.dev) return res.send({"code":403,"message":"Unauthorized"});
        if(!req.session.slt) return res.send({"code":403,"message":"Unauthorized"});

        let user = await User.findOne({ username: `${req.body.username}` });
        if (!user) {
            return res.send({"code":403,"message":"This is funny..some sort of error"});
        };
        if(user.dev) return res.send({"code":403,"message":"Must be deleted from db"});
        if((user.slt) && req.session.slt) return res.send({"code":403,"message":"Must be deleted by Tax/SMT"});

        User.deleteOne({ username: `${req.body.username}` }, async function (err) {
          if (err) return res.send({"code":403,"message":err});
          res.send({"code":200,"message":"Done"});
          await log({user:req.session.username,action:"Deleted User",ip:req.cf_ip,info:`Deleted - ${req.body.username} SLT: ${req.body.slt} admin: ${req.body.admin}`});

        });
    } else {
        res.send({"code":403,"message":"Unauthorized"})
    }
};

exports.player_lookup = function(req, res) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    if((req.xhr || req.headers.accept.indexOf('json') > -1) && req.session.admin) {
        if(!(isNaN(req.body.searchfor))) {
            db.query("SELECT * from players where pid = ?;SELECT * FROM player_logs WHERE pid = ? AND action IN ('bankChange','cashChange','TransferedMoney','SellItem');",[req.body.searchfor,req.body.searchfor], (error, result) => {
                try {
                    result[0][0].exp_total = formatNumber(result[0][0].exp_total);
                    result[0][0].bankacc = prettyMoney(result[0][0].bankacc);
                    result[0][0].cash = prettyMoney(result[0][0].cash);
                    result[0][0].bguid = uidguid(result[0][0].pid);
                    result[0][0].last_seen = moment(result[0][0].last_seen).fromNow();
                    var l = [];
                    result[1].forEach(e => {
                        var s = {};
                        s = e;
                        if(s.action == 'SellItem') {} else{
                            s.info = parseNum(e.info);
                        }
                        l.push(s);
                    });
    
                    res.send({"code":200,"message":result[0][0],"logs":l});   
                } catch (e) {
                    console.log(error)
                    res.send({"code":404,"message":"Not found","err":e});
                }
            });
        } else {
            db.query(`SELECT * from players where name = ?`,[req.body.searchfor], (error, result) => {
                try {
                    result[0].exp_total = formatNumber(result[0].exp_total);
                    result[0].bankacc = prettyMoney(result[0].bankacc);
                    result[0].cash = prettyMoney(result[0].cash);
                    result[0].bguid = uidguid(result[0].pid);
                    res.send({"code":200,"message":result[0],"logs":{}});
                } catch (e) {
                    res.send({"code":404,"message":"Not found","err":e});
                }
            });

        }
   } else {
    res.send({"code":403,"message":"Unauthorized"})
   }
};

exports.garage_lookup = function(req, res) {
    if (!req.is('json')) {
        return res.sendStatus(415);
    };
    if((req.xhr || req.headers.accept.indexOf('json') > -1) && req.session.admin) {
        if(!(isNaN(req.body.searchfor))) {
            db.query("SELECT * from vehicles where pid = ?;",[req.body.searchfor], (error, result) => {

                res.send({"code":200,"garage":result});
            });
        };
   } else {
    res.send({"code":403,"message":"Unauthorized"})
   }
};
