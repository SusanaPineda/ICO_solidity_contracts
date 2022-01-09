// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SToken is ERC20Burnable, Ownable {
   uint256 constant public maxSupply = 100;
   uint256 constant public tokensReward = 10;
   uint256 constant public maxAccountsPrivateSale = 10;
   uint256 constant public maxTokensPrivateSale = 40;
   uint256 constant public privatePrice = 50 ether;
   uint256 constant public publicPrice = 100 ether;
   
   uint256 public maxTransferPrivate = 0;
   uint256 public maxTransferPublic = 0;
   uint256 public privateSaleTimestamp = 0;
   uint256 public publicSaleTimestamp = 0;
   uint256 public finishSaleTimestamp = 0;
   uint256 public whitelistedCount = 0;
   uint256 public maxTokensPrivateSaleCount = 0;

   mapping(address => uint256) public countPrivateSale;
   mapping(address => uint256) public countPublicSale;
   mapping(address => bool) public whitelistedAccounts;

   constructor(string memory _name, string memory _symbol, uint256 _privateSaleTimestamp, uint256 _publicSaleTimestamp, uint256 _finishSaleTimestamp, uint256 _maxTransferPrivate, uint256 _maxTransferPublic) ERC20(_name, _symbol){
       setPrivateSaleTimestamp(_privateSaleTimestamp);
       setPublicSaleTimestamp(_publicSaleTimestamp);
       setFinishSaleTimestamp(_finishSaleTimestamp);
       setMaxTransferPrivate(_maxTransferPrivate);
       setMaxTransferPublic(_maxTransferPublic);

       _mint(address(this), maxSupply);
   }

   function setPrivateSaleTimestamp (uint256 _privateSaleTimestamp) public onlyOwner{
       privateSaleTimestamp = _privateSaleTimestamp;
   }

   function setPublicSaleTimestamp (uint256 _publicSaleTimestamp) public onlyOwner{
       require(_publicSaleTimestamp > privateSaleTimestamp, "SToken: Public sale timestamp is before private sale Timestamp");
       publicSaleTimestamp = _publicSaleTimestamp;
   }

   function setFinishSaleTimestamp (uint256 _finishSaleTimestamp) public onlyOwner{
       require(_finishSaleTimestamp > publicSaleTimestamp, "SToken: Finish sale timestamp is before public sale Timestamp");
       finishSaleTimestamp = _finishSaleTimestamp;
   }

   function setMaxTransferPrivate (uint256 _maxTransferPrivate) public onlyOwner{
       maxTransferPrivate = _maxTransferPrivate;
   }

   function setMaxTransferPublic (uint256 _maxTransferPublic) public onlyOwner{
       maxTransferPublic = _maxTransferPublic;
   }

   function addWhitelistedAccount(address _account) public onlyOwner {
        require(whitelistedCount < maxAccountsPrivateSale, "SToken: Whitelist is already full");
        require(whitelistedAccounts[_account] == false, "SToken: Account is already whitelisted");
        whitelistedCount++;
        whitelistedAccounts[_account] = true;
    }

    function removeWhitelistedAccount(address _account) public onlyOwner {
        require(whitelistedAccounts[_account] == true, "SToken: Account is not in the whitelist");
        whitelistedCount--;
        whitelistedAccounts[_account] = false;
    }

   function safePrivateMint (uint256 _mintAmount) public payable{
       require(block.timestamp > privateSaleTimestamp, "SToken: Private sale has not started yet");
       require(block.timestamp < publicSaleTimestamp, "SToken: Private sale has finished");
       require(whitelistedAccounts[msg.sender] == true, "SToken: Account is not in the whitelist");
       require(countPrivateSale[msg.sender] < maxTransferPrivate,"SToken: Account has reached the maximum number of private transfers allowed");
       require(maxTokensPrivateSaleCount+_mintAmount < maxTokensPrivateSale, "SToken: Mint amount is bigger than supply left in private sale");
       require(msg.value >= privatePrice*_mintAmount, "SToken: ETH sent amount underpriced");

       _transfer(address(this), msg.sender, _mintAmount);
       countPrivateSale[msg.sender]++;
       maxTokensPrivateSaleCount = maxTokensPrivateSaleCount + _mintAmount;
   }

   function safePublicMint (uint256 _mintAmount) public payable{
       require(block.timestamp > publicSaleTimestamp, "SToken: Public sale has not started yet");
       require(block.timestamp < finishSaleTimestamp, "SToken: mint has finished");
       require(countPublicSale[msg.sender] < maxTransferPublic,"SToken: Account has reached the maximum number of public transfers allowed");
       require(maxTokensPrivateSaleCount+tokensReward+_mintAmount < maxSupply, "SToken: Mint amount is bigger than supply left");
       require(msg.value >= publicPrice*_mintAmount, "SToken: ETH sent amount underpriced");

       _transfer(address(this), msg.sender, _mintAmount);
       countPublicSale[msg.sender]++;
   }
   
}