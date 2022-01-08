module.exports = {
    publicTimestamp: "SToken: Public sale timestamp is before private sale Timestamp",
    finishTimestamp: "SToken: Finish sale timestamp is before public sale Timestamp",
    privateSaleNotStarted: "SToken: Private sale has not started yet",
    privateSaleFinished: "SToken: Private sale has finished",
    onlyOwner: "Ownable: caller is not the owner",
    whitelistFull: "SToken: Whitelist is already full",
    alreadyWhitelisted: "SToken: Account is already whitelisted",
    alreadyNotInWhitelist: "SToken: Account is not in the whitelist",
    maximumTransfersReachedPrivate: "SToken: Account has reached the maximum number of private transfers allowed",
    mintAmountBiggerSupplyleftPrivate: "SToken: Mint amount is bigger than supply left in private sale",
    mintAmountZero: "SToken: Mint amount is zero",
    mintHasFinished: "SToken: mint has finished",
    sentPriceUnderpriced: "SToken: ETH sent amount underpriced",
    sameAddress: "SToken: sender and receiver cannot have the same address"
};