const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  resolver:{
    blacklistRE: blacklist([
      /node_modules\/rn-infinite-scroll\/node_modules\/.*/,
      /android\/.*/,
      /ios\/.*/
    ])
  },
};
