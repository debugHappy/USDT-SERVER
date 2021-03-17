//trc20 合约
const commonInit = require (__dirname + '/init.js') 


//trc20 合约转账
/*
@params from_address_private 从哪个地址的私钥
@params fromAddress 来源哪个地址 地址是 base58 格式
@params toAddress 给哪个地址 目标地址
@params amount 数量 比如转 1个TRX那么就传1
*/
async function trans(from_address_private  , toAddress , amount){
    let tronWebs = commonInit.init.initTronWeb(from_address_private);

    amount = amount * 1000000 ; //amount  精度是6
    var  hexAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' //合约地址 固定的合约

    contracts = await tronWebs.contract().at(hexAddress)
    let txid  = await contracts.transfer(toAddress,amount).send()
    return txid 
    
}

//获取usdt的余额

async function getUsdtNum(address){
    let tronWebs = commonInit.init.initTronWeb('D27D663643FDFC6DA5FCDC6C3B1D8D61D4E451ACEA3D198985640CD1593C8D5E');//这个地方随便搞个私钥

    let contract = await tronWebs.contract().at(trc20ContractAddress);
    let result = await contract.balanceOf(address).call();

    let decimals = await contract.decimals().call();


    let trc20 = result._hex || 0 

    trc20 = tronWebs.toDecimal(trc20)

    trc20 = trc20 / Math.pow(10,decimals)

    return trc20
}



module.exports.trc20 = {
    trans :trans ,
    getUsdtNum, getUsdtNum
};