
const ether = require("@openzeppelin/test-helpers/src/ether");
const { BN, toWei } = require("web3-utils");

module.exports.ADDRESS_ZERO="0x0000000000000000000000000000000000000000";
module.exports.ZERO_BN = new BN("0");
module.exports.CONTRACT_NAME = "SToken";
module.exports.CONTRACT_SYMBOL = "ST";
module.exports.PRIVATE_TIMESTAMP = new BN("2000");
module.exports.PUBLIC_TIMESTAMP = new BN("2500");
module.exports.FINISH_TIMESTAMP = new BN("3000");
module.exports.MAX_SUPPLY = new BN("100");
module.exports.MAX_ACCOUNTS_PRIVATE_SALE = new BN("10");
module.exports.MAX_TOKENS_PRIVATE_SALE = new BN("40");
module.exports.PRIVATE_PRICE = new BN(toWei("50", "ether"));
module.exports.PUBLIC_PRICE = new BN(toWei("100", "ether"));
module.exports.MAX_TRANSFERS_PRIVATE = new BN("2");
module.exports.MAX_TRANSFERS_PUBLIC = new BN("2");
module.exports.AWARD_PERCENTAGE = new BN("2");
module.exports.WHITELIST_PERCENTAGE = new BN("10");
