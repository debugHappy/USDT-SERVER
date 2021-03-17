/* 
* @Author: Awe
* @Date:   2021-02-02 01:37:02
* @Last Modified by:   Awe
* @Last Modified time: 2021-02-02 02:34:40
* @desc 轮训usdt的交易  监控usdt 最新区块的交易记录
*/
var fs = require('fs'); // 引入fs模块
require("./config/config.js");
const superagent = require('superagent')
var fs = require('fs'); // 引入fs模块
const CommonModules = require ('./module/common.js') 
const commonInit = require ( './module//init.js') 



const redis = require('redis');

var redisClient = redis.createClient(redis_port,redis_host);
if(redis_pass){
    redisClient.auth(redis_pass); 
}
redisClient.select(15);
redisClient.on('error',function(error){
    console.log("redis: " + error);
});

let tronWeb = commonInit.init.initTronWeb();



async function sIsMember(key , value ){
    return new Promise( (resolve) => {
        redisClient.sismember(key,value ,function(err, res){
            return resolve(res);
        });
    });
}


async function resJob(){
    try{
        let result = await  tronWeb.getEventResult(trc20ContractAddress, 
            {
                size : 200,
                onlyComfired: true ,
                eventName : 'Transfer' 
            }
        )
        //let str = JSON.stringify(result)
        if(result.length > 0 ){
            for(var it in result ){
                let transaction = result[it].transaction
                let results = result[it].result
                let from = results['from']
                from = tronWeb.address.fromHex(from)
                let to = results['to']
                to = tronWeb.address.fromHex(to)
                let value = results['value']
                value = value / 1000000
                let str  = "from："+from + " , to  :" +to +",transaction : "+transaction + ",value:"+value +",other:" + JSON.stringify(result[it]) ;
                var req = {
                    owner_address : from ,
                    to_address :to ,
                    txID :transaction ,
                    amount : value ,
                    extra : result[it]
                }
               fs.writeFileSync("./123.txt",JSON.stringify(req) + "\r\n",{flag : 'a'} );

                let redis_key = redis_address_key
                let from_k_v = await sIsMember(redis_key , from)
                let to_k_v = await sIsMember(redis_key , to)

                if(from_k_v != 1 && to_k_v != 1 ){
                    CommonModules.Common.consoleLog("from地址："+from+",to地址:"+to+",不是系统的 ， 交易id："+transaction+",无需处理。。。")
                    continue;
                }
                let resp = await sendReq(req)
                console.log(resp)
                //console.log(str)
            }
        }
    }catch(err){
        console.log("err:" + err )
    }
}

async function sendReq( postData ){
    var url = web_api_usdt_domain
    return new Promise(( resolve, reject ) => {
        try{
            superagent.post(url)
            .accept('application/json')
            .timeout(5000)
            .set('Content-Type', 'application/json')
            .send(postData)
            .end(function(err, resp) {
                if (err) {
                    reject( err )
                    return ;
                }
                //console.log(typeof resp.statusCode)
                let statusCode = ""
                if(resp.hasOwnProperty("statusCode") ){
                    statusCode = resp.statusCode
                }
                let status = ""
                if( resp.hasOwnProperty("status")  ){
                    status = resp.status
                }
                //let text = resp.body.text || ""
                //let repCode = resp.body.repCode || ""
                if(statusCode == 200 && status == 200 ){
                    let body = resp.text || {}
                    resolve( body )
                }else{
                    reject( resp )
                }
            })
        }catch(err){
            reject( err )
        }
        
    })
}

resJob()

setInterval(resJob, 2000);//循环执行
