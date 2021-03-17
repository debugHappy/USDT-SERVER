//地址方法
const commonInit = require (__dirname + '/init.js') 


//生成地址
async function generateAddress(){
    return await commonInit.init.initTronWeb().createAccount()    
}
//检测地址
function checkAddress(address){
   return  commonInit.init.initTronWeb().isAddress(address)
}

module.exports.address = {
    generateAddress :generateAddress ,
    checkAddress : checkAddress
};