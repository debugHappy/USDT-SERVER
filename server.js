/* 
* @Author: Awe
* @Date:   2019-06-20 11:19:05
* @Last 如果觉得好请打赏我哈 TRC20 地址：TQrB7CEQqThMr1Xp7HsqkXZqVZRDB6a8zp
* @Last Modified time: 2021-03-01 16:03:11
* @desc server.js
*
* 觉得好 ， 可以打赏我 USDT TRC20 地址： TQrB7CEQqThMr1Xp7HsqkXZqVZRDB6a8zp
*/
const TronWeb = require('tronweb')
const superagent = require('superagent')
var express =require("express");
var app=express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit : '50mb' }));
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(express.static(__dirname + "/root"));
app.listen(http_port,http_host  );
console.log( "服务器监听地址是："  +  http_host +":端口是："+http_port)

const CommonModules = require ('./module/common.js') 

//线上环境
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
var request_url = 'https://api.trongrid.io'

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' my name is qiao daima ')
    res.header("Content-Type", "application/json");
    next();
});
/*
    生成一个不上链的地址
*/
app.post("/generate_address",function (req,res) {
    try{
        var  tronWebs = new TronWeb(fullNode,solidityNode,eventServer );
        tronWebs.createAccount().then( function(address){
            res.send(
                CommonModules.Common.echoJsons(1 , 'ok' , address)
            ) ;
        },function(e){
            res.send(CommonModules.Common.echoJsons( 0 ,  e )) ;
        })
        
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "error:" + e) )
    }
});


/*
    判断地址是否正确
*/
app.post("/isAddress",function (req,res) {
    try{
        var  address = req.body.address  || "" ;//
        if(address == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失地址' )
            ) ;
        }
        var  tronWebs = new TronWeb(fullNode,solidityNode,eventServer );
        var status = tronWebs.isAddress(address)
        res.send(
            CommonModules.Common.echoJsons(1 , 'ok' , {status:status} )
        ) ;
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "error:" + e) )
    }
});



/*
    TRC20 转账
*/

app.post("/trc20_trans",function (req,res) {
    try{
        var  from_address_private = req.body.from_address_private  || "" ;//从哪个账号创建 就是那个账号的私钥
        var  fromAddress = req.body.fromAddress  || "" ;//从哪个账号转
        var  toAddress = req.body.toAddress  || "" ;//转给谁
        var  amount = req.body.amount  ||  0  ;//转多少usdt

        if(from_address_private == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失创建者的私钥' )
            ) ;
        }
        if(fromAddress == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '请输入转账账号' )
            ) ;
        }
        if(toAddress == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失目标账号' )
            ) ;
        }
        amount = amount * 1000000 ; //amount  精度是6
        var  hexAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' //合约地址 目前先固定

        var  tronWebs = new TronWeb(fullNode,solidityNode,eventServer , from_address_private);

        
        tronWebs.contract().at(hexAddress).then(function(contract){
            contract.transfer(toAddress,amount).send().then(function(txid){
                console.log(txid)
                res.send(
                    CommonModules.Common.echoJsons(1 , 'ok' , { txid: txid })
                ) ;
            },function(e){
                res.send(CommonModules.Common.echoJsons( 0 , "转账出错：error:" + e) )
            });
        },function(e){
            res.send(CommonModules.Common.echoJsons( 0 ,  "转账出错：" +  e )) ;
        })
        
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "转账error:" + e) )
    }
});

/*
   trx转账
*/


async function trx_trans(from_address_private , fromAddress , toAddress , amount ){
    var  tronWeb = new TronWeb(fullNode,solidityNode,eventServer , from_address_private);
    var  tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress,amount,fromAddress);
    tradeobj = await tronWeb.transactionBuilder.addUpdateData(tradeobj,"qq:84075041",'utf8');
    //tradeobj.raw_data.data = 123
    //console.log(tradeobj)
    var signedtxn = await tronWeb.trx.sign(tradeobj, from_address_private);
    
    //signedtxn.raw_data.data = "TRX_TEST"
    var receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
    return receipt ;
}


app.post("/trx_trans",function (req,res) {
    try{
        var  from_address_private = req.body.from_address_private  || "" ;//从哪个账号创建 就是那个账号的私钥
        var  fromAddress = req.body.fromAddress  || "" ;//从哪个账号转
        var  toAddress = req.body.toAddress  || "" ;//转给谁
        var  amount = req.body.amount  ||  0  ;//转多少TRX 精度是6

        if(from_address_private == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失创建者的私钥' )
            ) ;
        }
        if(fromAddress == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '请输入转账账号' )
            ) ;
        }
        if(toAddress == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失目标账号' )
            ) ;
        }
        amount = amount * 1000000 ; //amount  精度是6
        //var  hexAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' //合约地址 目前先固定

        //var  tronWebs = new TronWeb(fullNode,solidityNode,eventServer , from_address_private);
        trx_trans(from_address_private , fromAddress , toAddress , amount ).then(function(data){
            //console.log(data)
            res.send(CommonModules.Common.echoJsons( 1 ,  'ok' , data ) )
        },function(err){
            res.send(CommonModules.Common.echoJsons( 0 , "TRX转账失败 :" + err) )
        })
        
        
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "转账TRX出错：error:" + e) )
    }
});





async function getMoney(address , from_address_private){
    var  tronWeb = new TronWeb(fullNode,solidityNode,eventServer , from_address_private);
    const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";//contract address
    let contract = await tronWeb.contract().at(trc20ContractAddress);
    //Use call to execute a pure or view smart contract method.
    // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
    let result = await contract.balanceOf(address).call();

    let trx = await tronWeb.trx.getBalance(address);

    let trc20 = result._hex || 0 

    trc20 = tronWeb.toDecimal(trc20)
    return {
        'usdt' : trc20
        'trx' : trx ,
    }
}

/*
   获取账户的 trx 余额 和 trc 余额
*/

app.post("/get_money",function (req,res) {
    try{
        var  address = req.body.address  || "" ;//参数 Base58
        var from_address_private = 'F35F2EFB7E6069486EAAB24002905C75DC689AE36C3D4427B561DDF0CD59E329'
        if(from_address_private == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失创建者的私钥' )
            ) ;
        }
        if(address == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失地址' )
            ) ;
        }
        getMoney(address , from_address_private).then(function(data){
            res.send(CommonModules.Common.echoJsons( 1 ,  'ok' , data ) )
        },function(err){
            res.send(CommonModules.Common.echoJsons( 0 , "获取账户余额失败:" + err) )
        })
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "获取账户余额失败:" + e) )
    }
});





/*
   获取交易详情  按交易哈希查询交易
*/

app.post("/GetTransactionById",function (req,res) {
    try{
        
        var  trxid = req.body.trxid  || "" ;//参数 trxid
        if(trxid == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失trxid' )
            ) ;
        }
        let requestData = {
            "value" :trxid 
        }
        var requestDatas = JSON.stringify(requestData);

        let url = request_url + "/wallet/gettransactionbyid" 
        superagent.post(url)
        .accept('application/json')
        .timeout(5000)
        .send(requestDatas)
        .set('Content-Type', 'application/json')
        .end(function(err, resp) {
            if (err) {
                res.send(CommonModules.Common.echoJsons( 0 , "按交易哈希查询交易失败:" + err) )
                return;
            }
            try{
                let statusCode = resp.statusCode 
                let status = resp.status
                let text = resp.text || ""
                let repCode = resp.body.repCode || "" 
                if(statusCode == 200 && status == 200 ){
                    //let body = resp.body || {}
                    if(text){
                        text = JSON.parse(text)
                        //var owner_address = text.raw_data.
                    }

                    res.send(CommonModules.Common.echoJsons( 1 ,  'ok' , text ) )
                }else{
                    res.send(CommonModules.Common.echoJsons( 0 , "按交易哈希查询交易失败:" + text) )
                }
            }catch( err ){
                res.send(CommonModules.Common.echoJsons( 0 , "按交易哈希查询交易失败:" + err) )
            }
        })
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "按交易哈希查询交易失败:" + e) )
    }
});