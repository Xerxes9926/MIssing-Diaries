// requiring the contract
var Election = artifacts.require("./MissingDiaries.sol");

// exporting as module 
 module.exports = function(deployer) {
  deployer.deploy(Election);
 };

