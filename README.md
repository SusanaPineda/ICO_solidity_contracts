# ICO solidity ERC20 token contract
 
## ICO solidity ERC20 token contract with two phases. 100% coverage with truffle and NodeJs.

### **Token with two sales phases**
* **Private phase**: only the accounts that are on the whitelist will be able to buy the token. The selling price of the tokens in this phase will be reduced. Within the private phase there is a maximum number of tokens that can be purchased.
* **Public phase**: anyone will be able to buy the token, in this case, the price will be higher than in the private phase.

### **Whitelist**
 The whitelist will be controlled by the owner. The owner is in responsible for adding and removing accounts from the whitelist. There is a maximum number of users that can be added to the whitelist.

### **Maximum number of transactions per user**
 Each user will have a maximum number of possible transactions in each of the two phases of the sale. The owner of the contract can change these values.

### **Reward**
Once the public sale phase is over, the accounts that have purchased tokens, in any of the phases, will be able to request a reward based on the number of tokens purchased.

## **IMPORTANT**
This code is developed for training purposes and is therefore not audited. It cannot be guaranteed to be 100% secure.