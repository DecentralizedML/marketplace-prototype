var DmlMarketplace = artifacts.require("./DmlMarketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(DmlMarketplace);
};
