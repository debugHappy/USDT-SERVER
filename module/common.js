/* 
* @Author: Awe
* @Date:   2019-06-20 11:19:05
* @Last 不要复制我的代码不然后果自负
* @Last Modified time: 2019-07-09 10:13:33
* @desc 公共方法
*/
const moment = require('moment');



//返回当前的时间
function getNow(){
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

//控制台打印日志
function consoleLog( msg  ){
    console.log( "[" , getNow() , "]" , ":" ,  msg )
}


function echoJsons( code , msg , data = {}  ){
    return {
        code : code, 
        msg : msg , 
        data : data 
    }
}


module.exports.Common = {
    consoleLog :consoleLog ,
    getNow : getNow,
    echoJsons :echoJsons
};
