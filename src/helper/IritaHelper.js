import { getConfig as getConfigApi,getIbcTransferByHash, getIbcToken, getAllTxTypes } from "@/service/api";
import moveDecimal from 'move-decimal-point';
import Tools from "../util/Tools";
import { COSMOS_ADDRESS_PREFIX , IRIS_ADDRESS_PREFIX, DTC_ADDRESS_PREFIX} from "@/constant";
// import { ibcDenomPrefix } from '../constant';
import {cfg} from "@/config";
import md5 from "js-md5";
import {TxHelper} from "../helper/TxHelper";

export function validatePositiveInteger(value){
	if(+value === 0 || value && +value < 1){
    return 1
	} else {
    return value
  }
}

async function md5Fun(hash){
  return md5(hash.slice(5, -10).slice(3, -8))
}

async function uploadIbcToken(denom){
  let key = await md5Fun(denom)
  let payload = {
    "denom": denom,
    "key": key,
    "chain": ''
  }    
  let { data } = await getIbcToken(payload);
    if(data?.symbol){
      await setConfig()
      return data 
    } else {   
    }    
}

async function setConfig(){
  let config = await getConfigApi().catch((e)=>{throw e});
  window.sessionStorage.setItem('config',JSON.stringify(config));
}

export async function getConfig(){
    let config = window.sessionStorage.getItem('config');
    if (!config) {
        config = await getConfigApi().catch((e)=>{throw e});
        if (config) {
            window.sessionStorage.setItem('config',JSON.stringify(config));
        }else{
            config = {};
        }
    }else{
        config = JSON.parse(config || "{}");
    }
    return config;
}

export async function getTxType(){
    let txType = window.sessionStorage.getItem('txType');
    if (!txType) {
        let res = await getAllTxTypes().catch((e) => { throw e });
        if (res) {
            txType = TxHelper.formatTxTypeData(res.data)
        }else{
            txType = {};
        }
    }else{
        txType = JSON.parse(txType || "{}");
    }
    return txType;
}

export async function getMainToken(){
    let config = await getConfig().catch(e=>{throw e});
    let defaultData = {
        denom: "",
        scale: "1",
        symbol: ""
    };
    let mainToken = { ...defaultData };
    if (config.tokenData) {
        mainToken =  config.tokenData.find(item=>item.is_main_token) || defaultData;
    }else{
        console.warn("main token is empty");
    }
    return mainToken;
}

// 异步
export async function converCoin (_coin) {
    let { tokenData=[] } = await getConfig();
    let coin = {
        denom:'',
        amount:''
    };
    let displayCoin = {};
    if (typeof _coin == 'string') {
        let amount = (/[0-9]+[.]?[0-9]*/.exec(_coin) || [''])[0];
        let denom = _coin.replace(amount,'');
        coin.denom = denom;
        coin.amount = amount;
    }else if(typeof _coin == 'object'){
        coin = {..._coin};
    }else{
        console.warn('invalid amount');
    }

    tokenData.forEach((item)=>{
        if ( item.denom === coin.denom ) {
            displayCoin.denom = item.symbol;
            displayCoin.amount = moveDecimal(String(coin.amount || 0),0-Number(item.scale));
        }
    })

    // handle htltbcbnb => bnb and htltbcbusd  => busd
    //all token should be configured in db
    /*if (coin.denom === 'htltbcbnb') {
        displayCoin.denom = 'htltbcbnb';
        displayCoin.amount = moveDecimal(String(coin.amount || 0),-8);
    }

    if (coin.denom === 'htltbcbusd') {
        displayCoin.denom = 'htltbcbusd';
        displayCoin.amount = moveDecimal(String(coin.amount || 0),-8);
    }*/

    if (!displayCoin.denom) {
        // if (coin && coin.denom && coin.denom.startsWith(ibcDenomPrefix)) {
        //     let hash = coin.denom.replace(ibcDenomPrefix,'')
        //     let res = await getIbcTransferByHash(hash)
        //     if(res && res.denom_trace && res.denom_trace.base_denom) {
        //         coin.denom = (ibcDenomPrefix + res.denom_trace.base_denom).toUpperCase()
        //     }
        // }
        const ibcTest = /(ibc|IBC)\/[0-9A-Za-z]{54}/
        if(ibcTest.test(coin.denom)){
          const data = await uploadIbcToken(coin.denom)
          if(data?.symbol){
            return { 'denom': data.symbol, 'amount': moveDecimal(String(coin.amount || 0),0-Number(data.scale)) } 
          } else {
            return coin;
          }       
        }else {
          console.error('Denom did not match', _coin);
          return coin;
        }   
    }
    return displayCoin;
}

// 同步
export function converCoinSync (_coin,tokenData=[]) {
    let coin = {
        denom:'',
        amount:''
    };
    let displayCoin = {};
    if (typeof _coin == 'string') {
        let amount = (/[0-9]+[.]?[0-9]*/.exec(_coin) || [''])[0];
        let denom = _coin.replace(amount,'');
        coin.denom = denom;
        coin.amount = amount;
    }else if(typeof _coin == 'object'){
        coin = {..._coin};
    }else{
        console.warn('invalid amount');
    }

    tokenData.forEach((item)=>{
        if ( item.denom == coin.denom ) {
            displayCoin.denom = item.symbol;
            displayCoin.amount = moveDecimal(String(coin.amount || 0),0-Number(item.scale));
        }
    })
    if (!displayCoin.denom) {
        console.warn('Denom did not match');
        return coin;
    }
    return displayCoin;
}


export async function addressRoute (address) {
    let { addressPrefix = {} } = await getConfig();
    if (addressPrefix.iva) {
        let length = addressPrefix.iva.length
        if(address) {
            let isIris = addressPrefix.iaa === IRIS_ADDRESS_PREFIX,
                isCosmos = addressPrefix.iaa === COSMOS_ADDRESS_PREFIX;
            if (address.substring(0, length) === addressPrefix.iva) {
                return this.$router.push(`/staking/${address}`)
            } else if (isIris && address.startsWith(COSMOS_ADDRESS_PREFIX)) {
                return window.open(`${cfg.cosmosXpAddress}/#/address/${address}`)
            }  else if (isCosmos && address.startsWith(IRIS_ADDRESS_PREFIX)) {
                return window.open(`${cfg.irisXpAddress}/#/address/${address}`)
            }  else if (address.startsWith(IRIS_ADDRESS_PREFIX) || address.startsWith(COSMOS_ADDRESS_PREFIX) || address.startsWith(DTC_ADDRESS_PREFIX)) {
                return this.$router.push(`/address/${address}`)
            }
        }
    }
    return '';
}

export function formatMoniker (moniker,monikerNum) {
    if (!moniker) {
        return "";
    }
    return Tools.formatString(moniker.trim(), monikerNum, "...");
}