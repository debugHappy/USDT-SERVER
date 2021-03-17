const TronWeb = require('tronweb')

function initTronWeb(from_address_private ='' ){
    let initParmas = {
        fullHost:fullHost,
        headers: { "TRON-PRO-API-KEY": tronWebAPiKey },
        privateKey:from_address_private
    }
    if(from_address_private != '' ){
        initParmas.privateKey = from_address_private
    }
    return new TronWeb(initParmas );
}


module.exports.init = {
    initTronWeb :initTronWeb 
};
