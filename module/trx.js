//trx
const commonInit = require (__dirname + '/init.js') 


//  trx 转账
/*
@params from_address_private 从哪个地址的私钥
@params fromAddress 来源哪个地址 地址是 base58 格式
@params toAddress 给哪个地址 目标地址
@params amount 数量 比如转 1个TRX那么就传1
*/
async function trx_trans(from_address_private , fromAddress , toAddress , amount){
    let tronWebs = commonInit.init.initTronWeb();
    amount = tronWebs.toSun(amount)
    var  tradeobj = await tronWebs.transactionBuilder.sendTrx(toAddress,amount,fromAddress);
    tradeobj = await tronWebs.transactionBuilder.addUpdateData(tradeobj,"qq:84075041",'utf8');
    var signedtxn = await tronWebs.trx.sign(tradeobj, from_address_private);
    var receipt = await tronWebs.trx.sendRawTransaction(signedtxn);
    return receipt ;
}

//  获取trx余额
/*
@params address base58格式地址
*/

async function getBalance(address){
    let tronWebs = commonInit.init.initTronWeb();
    let balance = await tronWebs.trx.getBalance(address);
    balance = tronWebs.fromSun(balance)
    return balance;
}
module.exports.trx = {
    trx_trans :trx_trans ,
    getBalance : getBalance
};