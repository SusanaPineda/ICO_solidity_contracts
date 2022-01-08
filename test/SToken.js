const SToken = artifacts.require("./SToken.sol");
const { expectEvent, expectRevert, BN, time } = require("@openzeppelin/test-helpers");
const { toWei } = require("web3-utils");
const { ErrorMsgs } = require("./helpers");
const { MAX_SUPPLY, ZERO_BN, ADDRESS_ZERO, CONTRACT_NAME, CONTRACT_SYMBOL, PRIVATE_TIMESTAMP, PUBLIC_TIMESTAMP, FINISH_TIMESTAMP,
    MAX_ACCOUNTS_PRIVATE_SALE, MAX_TOKENS_PRIVATE_SALE ,PRIVATE_PRICE, PUBLIC_PRICE, MAX_TRANSFERS_PRIVATE, MAX_TRANSFERS_PUBLIC, 
    AWARD_PERCENTAGE, WHITELIST_PERCENTAGE } = require("./helpers/constants");
require("chai").should();

contract("SToken", ([owner, whitelisted, whitelisted2, whitelisted3, whitelisted4, user, ...restUsers]) => {

    beforeEach("Deploy contracts", async () => {
        STokencontract = await SToken.new(CONTRACT_NAME, CONTRACT_SYMBOL, 
                                                      PRIVATE_TIMESTAMP, PUBLIC_TIMESTAMP, FINISH_TIMESTAMP,
                                                      MAX_TRANSFERS_PRIVATE, MAX_TRANSFERS_PUBLIC, { from: owner });
    });

    describe("Getters and setters", () => {
        
        it("All gets from constants", async () => {
            let balance = new BN(await STokencontract.balanceOf(STokencontract.address));
            balance.should.be.bignumber.equal(MAX_SUPPLY);

            let name = await STokencontract.name();
            name.should.be.equal(CONTRACT_NAME);

            let symbol = await STokencontract.symbol();
            symbol.should.be.equal(CONTRACT_SYMBOL);

            let maxSupply = await STokencontract.maxSupply();
            maxSupply.should.be.bignumber.equal(MAX_SUPPLY);

            let maxAccountsPrivateSale = await STokencontract.maxAccountsPrivateSale();
            maxAccountsPrivateSale.should.be.bignumber.equal(MAX_ACCOUNTS_PRIVATE_SALE);

            let maxTokensPrivateSale = await STokencontract.maxTokensPrivateSale();
            maxTokensPrivateSale.should.be.bignumber.equal(MAX_TOKENS_PRIVATE_SALE);

            let privatePrice = await STokencontract.privatePrice();
            privatePrice.should.be.bignumber.equal(PRIVATE_PRICE);

            let publicPrice = await STokencontract.publicPrice();
            publicPrice.should.be.bignumber.equal(PUBLIC_PRICE);

        });

        it("Getters and setters from variables", async () =>{
            //maxTransferPrivate
            let maxTransferPrivate = new BN(await STokencontract.maxTransferPrivate());
            maxTransferPrivate.should.be.bignumber.equal(MAX_TRANSFERS_PRIVATE);
            await STokencontract.setMaxTransferPrivate(new BN("10"), { from: owner })
            maxTransferPrivate = new BN(await STokencontract.maxTransferPrivate());
            maxTransferPrivate.should.be.bignumber.equal(new BN("10"));

            //maxTransferPublic
            let maxTransferPublic = new BN(await STokencontract.maxTransferPublic());
            maxTransferPublic.should.be.bignumber.equal(MAX_TRANSFERS_PUBLIC);
            await STokencontract.setMaxTransferPublic(new BN("10"), { from: owner })
            maxTransferPublic = new BN(await STokencontract.maxTransferPublic());
            maxTransferPublic.should.be.bignumber.equal(new BN("10"));

            //only owner maxTransferPrivate

            //only owner maxTransferPublic
        })

        it("Timestamp control", async () => {
            const currentTimestamp = await time.latest();
            //all ok
            await STokencontract.setPrivateSaleTimestamp(currentTimestamp, { from: owner })
            let privateTimestamp = new BN(await STokencontract.privateSaleTimestamp());
            await STokencontract.setPublicSaleTimestamp(currentTimestamp.add(new BN("10000")), { from: owner })
            let publicTimestamp = new BN(await STokencontract.publicSaleTimestamp());
            await STokencontract.setFinishSaleTimestamp(currentTimestamp.add(new BN("1000000")), { from: owner })
            let finishTimestamp = new BN(await STokencontract.finishSaleTimestamp());

            privateTimestamp.should.be.bignumber.equal(currentTimestamp);
            publicTimestamp.should.be.bignumber.equal(currentTimestamp.add(new BN("10000")));
            finishTimestamp.should.be.bignumber.equal(currentTimestamp.add(new BN("1000000")));

            //publicTimestamp>whitelistTimestap && finishTimestamp>publicTimestamp
            await expectRevert(
                STokencontract.setPublicSaleTimestamp(currentTimestamp.sub(new BN("10000")), { from: owner }),
                ErrorMsgs.publicTimestamp
            );
            await expectRevert(
                STokencontract.setFinishSaleTimestamp(currentTimestamp.sub(new BN("1000000")), { from: owner }),
                ErrorMsgs.finishTimestamp
            );

            //OnlyOwnerControl
            await expectRevert(
                STokencontract.setPrivateSaleTimestamp(currentTimestamp, { from: user }),
                ErrorMsgs.onlyOwner
            );
            await expectRevert(
                STokencontract.setPublicSaleTimestamp(currentTimestamp.add(new BN("1000000")), { from: user }),
                ErrorMsgs.onlyOwner
            );
            await expectRevert(
                STokencontract.setFinishSaleTimestamp(currentTimestamp.sub(new BN("10000")), { from: user }),
                ErrorMsgs.onlyOwner
            );
        })
    });

    describe("whitelist", () =>{
        it("add to whitelist", async () =>{
            //all ok
            let whitelistBefore = new BN(await STokencontract.whitelistedCount());
            await STokencontract.addWhitelistedAccount(whitelisted, {from: owner});
            let whitelistAfter = await STokencontract.whitelistedCount();
            whitelistAfter.should.be.bignumber.equal(whitelistBefore.add(new BN("1")));
            /*let oneETH = new BN(toWei("1", "ether"))
            let oneETHInWei = new BN(fromWei(oneETH.toString(), "ether"));*/

            //error acount yet in whitelist
            await expectRevert(
                STokencontract.addWhitelistedAccount(whitelisted, {from: owner}),
                ErrorMsgs.alreadyWhitelisted
            );

            //error whitelist full
            let maxAccountsPrivateSale = new BN(await STokencontract.maxAccountsPrivateSale());
            for (let i = 1; i < maxAccountsPrivateSale; i++){
                await STokencontract.addWhitelistedAccount(restUsers[i], {from: owner});
            }

            await expectRevert(
                STokencontract.addWhitelistedAccount(whitelisted2, {from: owner}),
                ErrorMsgs.whitelistFull
            );

            //OnlyOwner control
            await expectRevert(
                STokencontract.addWhitelistedAccount(whitelisted2, {from: user}),
                ErrorMsgs.onlyOwner
            );
        })

        it("remove to whitelist", async () =>{
            //all ok
            await STokencontract.addWhitelistedAccount(whitelisted, {from: owner});
            let whitelistBefore = await STokencontract.whitelistedCount();
            await STokencontract.removeWhitelistedAccount(whitelisted, {from: owner});
            let whitelistAfter = await STokencontract.whitelistedCount();
            whitelistAfter.should.be.bignumber.equal(whitelistBefore.sub(new BN("1")));

            //error acount not in whitelist
            await expectRevert(
                STokencontract.removeWhitelistedAccount(whitelisted2, {from: owner}),
                ErrorMsgs.alreadyNotInWhitelist
            );

            //error onlyOwner
            await STokencontract.addWhitelistedAccount(whitelisted, {from: owner});
            await expectRevert(
                STokencontract.removeWhitelistedAccount(whitelisted, {from: user}),
                ErrorMsgs.onlyOwner
            );

        })
    })

    describe("Mint", ()=>{
        it("safePrivateMint", async () =>{
            //all ok
            const currentTimestamp = await time.latest();
            let price = await STokencontract.privatePrice();
            let amount = new BN("5");
            let totalCost = price*amount;
            await STokencontract.addWhitelistedAccount(whitelisted, {from: owner});
            await STokencontract.setPrivateSaleTimestamp(currentTimestamp.sub(new BN("10")), { from: owner })
            await STokencontract.setPublicSaleTimestamp(currentTimestamp.add(new BN("10000")), { from: owner })
            await STokencontract.setFinishSaleTimestamp(currentTimestamp.add(new BN("1000000")), { from: owner })

            await STokencontract.safePrivateMint(amount, { from: whitelisted, value: totalCost});

            let balance = new BN(await STokencontract.balanceOf(whitelisted));
            balance.should.be.bignumber.equal(amount);

            let balanceContract = new BN(await STokencontract.balanceOf(STokencontract.address));
            balanceContract.should.be.bignumber.equal(new BN("95"));

            let countPrivateSale = new BN(await STokencontract.countPrivateSale(whitelisted));
            countPrivateSale.should.be.bignumber.equal(new BN("1"));

            let maxTokensPrivateSaleCount = new BN(await STokencontract.maxTokensPrivateSaleCount());
            maxTokensPrivateSaleCount.should.be.bignumber.equal(amount);

            //Private Sale not started

            //Private Sale finish

            //Account not whitelisted

            //Account has reached the maximum number of private transfers allowed

            //Mint amount is bigger than supply left in private sale

            //ETH sent amount underpriced

            //not contract address
        })
    })
});