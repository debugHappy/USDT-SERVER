/* 
* @Author: Awe
* @Date:   2019-06-20 11:19:05
* @Last 不要复制我的代码不然后果自负
* @Last Modified time: 2019-07-09 10:12:04
* @desc server.js
*/
require("./config/config.js");
const superagent = require('superagent')
var express =require("express");
var app=express();
var bodyParser = require('body-parser');
var util = require("util")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit : '50mb' }));
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(express.static(__dirname + "/root"));
app.listen(http_port,http_host  );
console.log( "服务器监听地址是："  +  http_host +":端口是："+http_port)

const CommonModules = require ('./module/common.js') 

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' my name is qiao daima ')
    res.header("Content-Type", "application/json");
    next();
});
/*
    生成一个本地的地址
*/
app.post("/generate_address",function (req,res) {
    try{
        var addressModule = require ('./module/address.js') 
        addressModule.address.generateAddress().then( function(address){
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
        var addressModule = require ('./module/address.js') 

        var status = addressModule.address.checkAddress(address)
        res.send(
            CommonModules.Common.echoJsons(1 , 'ok' , {status:status} )
        ) ;
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "error:" + e) )
    }
});



/*
   trx转账
*/



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

        var trxModule = require ('./module/trx.js') 
        trxModule.trx.trx_trans(from_address_private , fromAddress , toAddress , amount ).then(function(data){
            //console.log(data)
            res.send(CommonModules.Common.echoJsons( 1 ,  'ok' , data ) )
        },function(err){
            res.send(CommonModules.Common.echoJsons( 0 , "TRX转账失败 :" + err) )
        })

    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "转账TRX出错：error:" + e) )
    }
});

/*
    TRC20 转账
*/

app.post("/trc20_trans",function (req,res) {
    try{
        var  from_address_private = req.body.from_address_private  || "" ;//从哪个账号创建 就是那个账号的私钥
        var  toAddress = req.body.toAddress  || "" ;//转给谁
        var  amount = req.body.amount  ||  0  ;//转多少usdt

        if(from_address_private == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失创建者的私钥' )
            ) ;
        }
       
        if(toAddress == '' ){
            res.send(
                CommonModules.Common.echoJsons( 0  , '缺失目标账号' )
            ) ;
        }
        
        var trc20Module = require ('./module/trc20.js') 

        trc20Module.trc20.trans(from_address_private , toAddress , amount ).then(function(txid){
            console.log("txid"  , txid)
            res.send(
                CommonModules.Common.echoJsons(1 , 'ok' , { txid: txid })
            ) ;
        },function(e){
            res.send(CommonModules.Common.echoJsons( 0 ,  "USDT转账出错：" +  e )) ;
        });
        
    }catch(e){
        res.send(CommonModules.Common.echoJsons( 0 , "转账error:" + e) )
    }
});


async function getMoney(address){
    var trc20Module = require ('./module/trc20.js') 
    var trxModule = require ('./module/trx.js') 
    var usdt = await trc20Module.trc20.getUsdtNum(address )
    var trx = await trxModule.trx.getBalance(address )
    return {usdt : usdt , trx : trx }
}

/*
   获取账户的 trx 余额 和 usdt 余额
*/

app.post("/get_money",function (req,res) {
    try{
        var  from_address_private = req.body.from_address_private  || "" ;//从哪个账号创建 就是那个账号的私钥
        var  address = req.body.address  || "" ;//参数 Base58
        from_address_private = 'D584E958927EB19ECD0B4DF404A1CE8DC1768D13FBAFEE666248FB82710B6400'
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
   
        getMoney(address ).then(function(data){
            res.send(CommonModules.Common.echoJsons( 1 ,  'ok' , data ) )
        },function(err){
            res.send(CommonModules.Common.echoJsons( 0 , "获取账户余额txt getBalance失败:" + err) )
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

        let url = trongrid_domain + "/wallet/gettransactionbyid" 
        superagent.post(url)
        .accept('application/json')
        .timeout(5000)
        .set('TRON-PRO-API-KEY', tronWebAPiKey)
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