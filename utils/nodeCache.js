const NodeCache = require("node-cache");
const cache = new NodeCache();
 

module.exports.setKey = (id,data) => {
    cache.set(id, data, 1800);
};

module.exports.setMultiKey = (id1,id2,d1,d2) => {
      cache.mset([
          {key: id1, val: d1, ttl: 1800},
          {key: id2, val: d2, ttl: 1800},
      ])
};

module.exports.getKey = (id) => {
    mykeys = cache.keys();
    console.log(mykeys);
    cache.getStats();
    value = cache.get(id);
    if (value == undefined){
        return false;
    } else {
        return value;
    }
};
