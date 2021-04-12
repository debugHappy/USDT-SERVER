# USDT TRC20 接口 服务端 ，请本地部署，不用担心私钥泄露。
#  不用担心私钥泄露。
# 不用担心私钥泄露。
# 不用担心私钥泄露。

~~~
注意币地址统一使用 base58 格式的
~~~

# 安装

~~~
 npm install 
~~~

~~~
修改配置文件 conf/config.js
~~~

~~~
启动：内部服务：

1：pm2 start startServer.json
~~~

# 一：生成币地址本地地址

~~~
curl --location --request POST 'http://192.168.1.21:8989/generate_address'
~~~
## 生成币地址返回结果
~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "privateKey": "私钥",
        "publicKey": "0443DAF281749C9E8DFE83A77EF03A7289D2247969E1C66761E5785F2C319A950FBEA08DC2B98F871F197AC080FABEA01E5199D8F2AF669722DC04E66FAC75CEA0",
        "address": {
            "base58": "TP1GNfLqWbjWxtag1yVG1T3uaLRcPJjYzY",
            "hex": "418EFD48450AAFFB539FE56E751F8963567D5ED2D7"
        }
    }
}
~~~


# 二：检测地址是否正确

~~~
curl --location --request POST 'http://192.168.1.21:8989/isAddress' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'address=TXygJpjJtCup78nnJN9qBxrwpiqW2A1yDJ'
~~~
## 检测地址是否正确返回结果
~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "status": true
    }
}
~~~

# 三：TRX转账

~~~
curl --location --request POST 'http://192.168.1.21:8989/trx_trans' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'from_address_private=私钥' \
--data-urlencode 'fromAddress=从哪个地址转格式为base58' \
--data-urlencode 'toAddress=转给哪个地址地址格式为base58' \
--data-urlencode 'amount=0.01'
~~~
## TRX转账结果
~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "result": true,
        "txid": "09db6746641eec876d4f20301df8f7e03c6822916825791a2ad76f479ea612be",
        "transaction": {
            "txID": "09db6746641eec876d4f20301df8f7e03c6822916825791a2ad76f479ea612be",
            "raw_data": {
                "data": "71713a3834303735303431",
                "contract": [
                    {
                        "parameter": {
                            "value": {
                                "amount": 10000,
                                "owner_address": "4124b3f61ca56819898b08c0c61ed18f98c813372b",
                                "to_address": "410976782e1b25c5364ea68595145dd20bd9137276"
                            },
                            "type_url": "type.googleapis.com/protocol.TransferContract"
                        },
                        "type": "TransferContract"
                    }
                ],
                "ref_block_bytes": "46c5",
                "ref_block_hash": "a3c7f970085182ff",
                "expiration": 1615970910000,
                "timestamp": 1615970852888
            },
            "raw_data_hex": "0a0246c52208a3c7f970085182ff40b0fefcfa832f520b71713a38343037353034315a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a154124b3f61ca56819898b08c0c61ed18f98c813372b1215410976782e1b25c5364ea68595145dd20bd913727618904e7098c0f9fa832f",
            "visible": false,
            "signature": [
                "4baaa558d8b73c5eb438bdbd8ac5d3fbb8381f471e118d8eaf3d887f8ff379978db96f5dac60e52cd3470800e8fa992f088171d18ff0a1f8f92487a3430abb0901"
            ]
        }
    }
}
~~~

# 四：USDT合约转账

~~~
curl --location --request POST 'http://192.168.1.21:8989/trc20_trans' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'from_address_private=从哪个地址的私钥转' \
--data-urlencode 'toAddress=给谁转 地址是base58格式' \
--data-urlencode 'amount=0.01'
~~~

## USDT转账结果

~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "txid": "cd875e99678622e5e21b0f35c491f337aa7b8c8d66c0ba071640527d57e6f066"
    }
}
~~~

# 五：获取地址里面的TRX和USDT数量

~~~
curl --location --request POST 'http://192.168.1.21:8989/get_money' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'address=base58格式地址'
~~~

## 返回结果
~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "usdt": 0.5,
        "trx": "94.99688"
    }
}
~~~


# 六：根据交易hash查询交易信息

~~~
curl --location --request POST 'http://192.168.1.21:8989/GetTransactionById' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'trxid=2a985f0c5fd37aaffca2f9c29bd1eaa50ccaae6adef7585b73ad89ae67b745a4'
~~~

## 返回结果
~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "ret": [
            {
                "contractRet": "SUCCESS"
            }
        ],
        "signature": [
            "c7fd7453085d934ac573cb7f1667837ada93145abbe226e7ea7a8aea648bfa09a4094192a2d67b80625448cc3a01f354f387eaa37ae22978470f236d7533d64600"
        ],
        "txID": "2a985f0c5fd37aaffca2f9c29bd1eaa50ccaae6adef7585b73ad89ae67b745a4",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "data": "a9059cbb000000000000000000000000a33564d0de15b3c7c4d6c50ab72b32c59ef5bd940000000000000000000000000000000000000000000000000000000000465000",
                            "owner_address": "410976782e1b25c5364ea68595145dd20bd9137276",
                            "contract_address": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
                        },
                        "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                    },
                    "type": "TriggerSmartContract"
                }
            ],
            "ref_block_bytes": "f6e6",
            "ref_block_hash": "d25ce9686f7999f0",
            "expiration": 1615712691000,
            "fee_limit": 40000000,
            "timestamp": 1615712633210
        },
        "raw_data_hex": "0a02f6e62208d25ce9686f7999f040b8c6ecff822f5aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15410976782e1b25c5364ea68595145dd20bd9137276121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244a9059cbb000000000000000000000000a33564d0de15b3c7c4d6c50ab72b32c59ef5bd94000000000000000000000000000000000000000000000000000000000046500070fa82e9ff822f900180b48913"
    }
}
~~~



# 七： trx交易监控
~~~
1：修改配置文件异步通知地址 web_api_trx_domain 改为你自己的

2：请把你自己系统里面的所有币地址导入到redis 15 数据库集合里面 key为 配置文件里面定义的那个key 

3：启动： pm2 start monitor_block_trx.js

4:系统会自动的过滤不是系统币地址 ，如果监控到是系统的币地址 ，那么会发送异步通知到配置的那个回调地址里面

~~~
# TRX异步通知数据如下：

~~~

{
	"owner_address": "TSSrhM7VRWFZMwPZ4QPqrZULTP4swAkkyW",
	"to_address": "THK7MrUT6FBCS1RPqgcspY3ehP6pAo7DoN",
	"txID": "07450f4027f3ab21bf178d36bf57815b73f8e4d2fb8b8c5e0556d1b67cb7ea13",
	"amount": 4200,
	"extra": {
		"ret": [{
			"contractRet": "SUCCESS"
		}],
		"signature": ["84c2cdb5990fc3f6fd46278b9575c646377cdb3190765df4215df056bb4e9741e2dd5cd9f8bfbab5f674469218f2074e73b14a48e9460b7f115df77d8aaa8a0601"],
		"txID": "07450f4027f3ab21bf178d36bf57815b73f8e4d2fb8b8c5e0556d1b67cb7ea13",
		"raw_data": {
			"contract": [{
				"parameter": {
					"value": {
						"amount": 4200,
						"asset_name": "31303033353333",
						"owner_address": "41b4bcb59b5a7d446ad2ec0780af85fa36c4ed14ee",
						"to_address": "41508c7d8edcd6c0eb1f24dbb898cbf610d2e2f789"
					},
					"type_url": "type.googleapis.com/protocol.TransferAssetContract"
				},
				"type": "TransferAssetContract"
			}],
			"ref_block_bytes": "4c96",
			"ref_block_hash": "00f3655724057d2a",
			"expiration": 1615975383000,
			"timestamp": 1615975325824
		},
		"raw_data_hex": "0a024c96220800f3655724057d2a40d8ff8dfd832f5a74080212700a32747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e736665724173736574436f6e7472616374123a0a0731303033353333121541b4bcb59b5a7d446ad2ec0780af85fa36c4ed14ee1a1541508c7d8edcd6c0eb1f24dbb898cbf610d2e2f78920e8207080c18afd832f"
	}
}

~~~



# 八： USDT交易监控
~~~
1：修改配置文件异步通知地址 web_api_usdt_domain 改为你自己的

2：请把你自己系统里面的所有币地址导入到redis 15 数据库集合里面 key为 配置文件里面定义的那个key 

3：启动： pm2 start monitor_block_usdt.js

4:系统会自动的过滤不是系统的币地址 ，如果监控到是系统的币地址的交易 ，那么会发送异步通知到配置的那个回调地址里面

~~~
# USDT异步通知数据如下：

~~~

{
	"owner_address": "THkmAtkdj3zp9FBzv8dBT4iEPX4qgP6xFh",
	"to_address": "TPEB1wuJ6EvJBaFjANsppQ2geqKVV8TMxE",
	"txID": "ad7b37ce3f04b5531f1cf9e1e561f2baefa21f4d1b064f94bd064be2e472fcf9",
	"amount": 1650.52,
	"extra": {
		"block": 28527969,
		"timestamp": 1615975878000,
		"contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
		"name": "Transfer",
		"transaction": "ad7b37ce3f04b5531f1cf9e1e561f2baefa21f4d1b064f94bd064be2e472fcf9",
		"result": {
			"0": "0x556673dad4114df924fd0e161195dde4594bb80a",
			"1": "0x916e37c7635f9552316ee7cec1599d8ff0bb03c3",
			"2": "1650520000",
			"from": "0x556673dad4114df924fd0e161195dde4594bb80a",
			"to": "0x916e37c7635f9552316ee7cec1599d8ff0bb03c3",
			"value": "1650520000"
		},
		"resourceNode": "fullNode",
		"unconfirmed": true
	}
}

~~~

# 九： 保存需要监控的地址，接口如下

~~~
curl --location --request POST 'http://192.168.1.21:8989/save_check_address' \
--header 'Content-Type: application/json' \
--data-raw '[
    "TDhSd1bZEfCD5HF2dy8dGicZbYfg1MWxND",
    "TNhd6HJmBuvfR3F129p8zBC3nTKh4E3Gnf", 
    "TC1CYwkVLYa3aBDVEoEsC3wmTPKCBEdoGf"
]'
~~~
## 接口返回

~~~
{
    "code": 1,
    "msg": "ok",
    "data": {
        "success_num": 1
    }
}
~~~



# contact me

~~~
qq ： 84075041 
~~~
