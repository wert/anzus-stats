const {User} = require("../models/user");
const CryptoJS = require("crypto-js");
const bigInt = require("big-integer");

module.exports.uidguid = (uid) => {
    if (!uid) {
      return;
    }
   
    var steamId = bigInt(uid);
   
    var parts = [0x42,0x45,0,0,0,0,0,0,0,0];
   
    for (var i = 2; i < 10; i++) {
      var res = steamId.divmod(256);
      steamId = res.quotient; 
      parts[i] = res.remainder.toJSNumber();
    }
   
    var wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(parts));
    var hash = CryptoJS.MD5(wordArray);
    return hash.toString();
};

module.exports.prettyMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return "$" + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);
      } catch (e) {
        console.log(e)
      }
}

module.exports.formatNumber = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
  try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);
    } catch (e) {
      console.log(e)
    }
}

module.exports.parseNum = (input) => {
  const parts = input.split(':');
  const change = this.formatNumber(parseInt(Number(parts[1]).toPrecision(), 0));
  const updated = this.formatNumber(Number(parts[2]).toPrecision());
  let changeColor = 'red';

  if (change > 0) {
    changeColor = 'green';
  }

  return `<span class="${changeColor}">$${change}</span> - New Balance: $${updated}`;
}

async function validateSession(req) {
    if (!req.session.authenticated) return false;
    if (req.session.username == null) return false;
    let user = await User.findOne({
        username: req.session.username
    });
    if (!user) {
        req.sessionStore.destroy(req.session.sessionId, () => {});
        return false;
    };
    if (!user.slt && req.session.slt) {
        req.session.slt = false;
    };
    if (!user.dev && req.session.dev) {
        req.session.dev = false;
    };
    if (!user.admin && req.session.admin) {
        req.session.slt = false;
    };
    return true;
}

module.exports.validateSession = validateSession;