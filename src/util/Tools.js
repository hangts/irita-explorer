import moment from 'moment'
import BigNumber from 'bignumber.js'
import URLSearchParams from 'url-search-params'
import { bech32 } from 'bech32'
import moveDecimal from 'move-decimal-point'

const  cn = require("../../lang/CN-Cindy")
const  en = require( "../../lang/EN-Cindy")
import config from "../../productionConfig/productionConfig"

//import Constant from '../constant/index.js'
//import { getConfig } from '@/helper/IritaHelper'
import { utcOffset,isShowUTC } from '../productionConfig';
import * as sha256 from 'sha256';

//const displayToken2ActualTxToken = Math.pow(10, config.token.decimal);

BigNumber.config({
    FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
    }
});
export default class Tools {
  static sha256(v){
    if(!v) return '';
    return sha256(String(v)) || '';
  }
  /**
   * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
   */
  static formatAge(currentServerTime, time, suffix, prefix) {
    let dateBegin = new Date(time)
    let dateDiff = currentServerTime - dateBegin.getTime() / 1000
    if (dateDiff < 0) {
      return ''
    }
    let dayDiff = Math.floor(dateDiff / (24 * 3600))
    let hourLevel = dateDiff % (24 * 3600)
    let hours = Math.floor(hourLevel / 3600)
    let minuteLevel = dateDiff % 3600
    let minutes = Math.floor(minuteLevel / 60)
    let seconds = dateDiff % 60



    const day1 = config.lang === 'CN'? cn.ExplorerLang.common.day1 : en.ExplorerLang.common.day1
    const day = config.lang === 'CN'? cn.ExplorerLang.common.day : en.ExplorerLang.common.day
    const hrs = config.lang === 'CN'? cn.ExplorerLang.common.hrs: en.ExplorerLang.common.hrs
    const hr = config.lang === 'CN'? cn.ExplorerLang.common.hr : en.ExplorerLang.common.hr
    const mins = config.lang === 'CN'? cn.ExplorerLang.common.mins : en.ExplorerLang.common.mins
    const min = config.lang === 'CN'? cn.ExplorerLang.common.min : en.ExplorerLang.common.min
    const secs = config.lang === 'CN'? cn.ExplorerLang.common.secs : en.ExplorerLang.common.secs
    const sec = config.lang === 'CN'? cn.ExplorerLang.common.sec : en.ExplorerLang.common.sec
    const ago = config.lang === 'CN'? cn.ExplorerLang.table.suffix : en.ExplorerLang.table.suffix

    let str = `${dayDiff ? (dayDiff < 2 ? `${dayDiff} ${day}` : `${dayDiff} ${day1}`) : ''} ${hours ? (hours < 2 ? `${hours} ${hr}` : `${hours} ${hrs}`) : ''} ${dayDiff ? '' : minutes ? (minutes < 2 ? `${minutes}${min}` : `${minutes} ${mins}`) : ''} ${dayDiff || hours ? '' : seconds ? (seconds < 2 ? `${seconds} ${sec}` : `${seconds} ${secs}`) : ''}`



    if (prefix && suffix) {
      return `${prefix} ${str} ${ago}`
    } else if (suffix) {
      return `${str} ${ago}`
    } else {
      return `${str}`
    }
  }
  static formatLocalTime(timestamp){
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
  /**
	 * 格式化hash
	 * */
	static formatTxHash(txHash = ''){
		if (txHash.length <= 8) {
			return txHash;
		}
		return `${txHash.substring(0,4)}...${txHash.substring(txHash.length - 4)}`
  }

  /**
   * 格式化地址
   */
  static formatValidatorAddress(address) {
    return Tools.format38(address)
  }

  /**
   * 前三后八格式
   */
  static format38(str) {
    if (str && str.length > 11) {
      return `${str.substring(0, 3)}...${str.substring(str.length - 8)}`
    } else if (str && str.length <= 11) {
      return str
    }
    return ''
  }

  /**
   *
   * 是否显示tooltip
   */
  static disabled (str) {
    return str && str.length <= 11
  }

  /**
   * 格式化空格
   */
  static removeAllSpace(str) {
    return str.replace(/\s+/g, '')
  }

  /**
   * 首字母大写
   * */
  static firstWordUpperCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toUpperCase()
    })
  }
  /**
   * 转换时间格式
   * */
  static getDisplayDate (timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    let offset = utcOffset || '+0';
    let isShow = isShowUTC === false ? false : true;
    if (isShow) {
      if (offset && offset !=="+0") {
        return moment(timestamp * 1000)
        .utcOffset(Number(offset))
        .format(format) + ' UTC' + offset
      } else {
        return moment(timestamp * 1000)
        .utcOffset(Number(offset))
        .format(format) + ' UTC'
      }
    } else {
        return moment(timestamp * 1000)
        .utcOffset(Number(offset))
        .format(format)
    }
  }
  // static getDisplayDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  //   return moment(timestamp * 1000)
  //     .local()
  //     .format(format)
  // }

  static getFormatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    let offset = utcOffset || '+0';
    let isShow = isShowUTC === false ? false : true;
    if (isShow) {
      if (offset && offset !=="+0") {
        return moment(date)
        .utcOffset(Number(offset))
        .format(format) + ' UTC' + offset
      } else {
        return moment(date)
        .utcOffset(Number(offset))
        .format(format) + ' UTC'
      }
    } else {
        return moment(date)
        .utcOffset(Number(offset))
        .format(format)
    }
  }

  // static getFormatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  //   return moment(date)
  //     .local()
  //     .format(format)
  // }

  static getTimestamp () {
    return Math.floor(new Date().getTime() / 1000)
  }

  static urlParser(url = document.location.toString()) {
    if (url.includes('?')) {
      const searchStr = url.split('?')[1]
      let searchInstance = new URLSearchParams(searchStr)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else if (url.includes('&')) {
      let searchInstance = new URLSearchParams(url)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else {
      return {}
    }
  }

  static isBech32 (str) {
    let allReg = new RegExp(/^[0-9a-zA-Z]*$/i)
    if (!allReg.test(str)) {
      return false
    }

    try {
      bech32.decode(str)
      return true
    } catch (e) {
      return false
    }
  }

  static isValid(value) {
    return !value || !value.length || value == '--' ? false : true
  }
  /**
   * 根据字节截取字符串
   */
  static formatString(string, cutOutlength, addSuffix) {
    let stringLength = string.replace(/[^\x00-\xff]/g, '**').length
    if (stringLength > cutOutlength) {
      if (!addSuffix) {
        addSuffix = '......'
      }
      var bytesLength = 0
      var unitStringUnicodeMaxlength = 255
      for (var index = 0; index < cutOutlength; index++) {
        if (string.charCodeAt(index) > unitStringUnicodeMaxlength) {
          bytesLength = bytesLength + 2
        } else {
          bytesLength = bytesLength + 1
        }
        if (bytesLength >= cutOutlength) {
          string = string.slice(0, index + 1) + addSuffix
          break
        }
      }
      return string
    } else {
      return string + ''
    }
  }
  static formatPriceToFixed(value, fixedValue) {
    return new BigNumber(value).toFormat(fixedValue)
  }
  // 转化uptime的方法
  static FormatUptime(number) {
    return `${(number * 100).toFixed(4)}%`
  }
  static subStrings(value, afterPointLength) {
    //截取指定小数位长度字符串
    if (value) {
      value = String(value)
      let arr = value.split('.')
      arr[1] = arr[1] || ''
      if (arr[1].toString().length > afterPointLength) {
        value = `${arr[0]}.${arr[1].substring(0, afterPointLength)}`
      } else {
        let diffNum = afterPointLength - arr[1].toString().length
        for (let i = 0; i < diffNum; i++) {
          arr[1] += '0'
        }
        value = `${arr[0]}.${arr[1]}`
      }
      // value = `${arr[0]}.${arr[1].padEnd(afterPointLength, '0').substring(0, afterPointLength)}`;
    }
    return value
  }
  /**
   * 后端返回的数据转换成标准格式
   */
  static format2UTC(originTime) {
    return `${originTime.substr(0, 4)}-${originTime.substr(5, 2)}-${originTime.substr(8, 2)} ${originTime.substr(11, 8)}`
  }
  /**
   * 格式化数字类型是string的数字并让小数点左移18位 (本质是移动小数点的位置)
   *
   */
  static numberMoveDecimal(number) {
    let leftLength = -18
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(new BigNumber(number).toFixed().toString(), leftLength)
      } else {
        return moveDecimal(new BigNumber(number).toFixed().toString() + '.', leftLength)
      }
    } else {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(number.toString(), leftLength)
      } else {
        return moveDecimal(number.toString() + '.', leftLength)
      }
    }
  }
  /**
   *   科学计数法转成数字
   *
   * */
  static FormatScientificNotationToNumber(number) {
    let formattedNumber
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      formattedNumber = new BigNumber(number).toFixed().toString()
    } else {
      formattedNumber = number
    }
    return formattedNumber
  }

  /**
   * 格式化数字的类型是string的数字并在小数点后面补零
   */
  static formatStringToFixedNumber (str, splitNum) {
    if (str.toString().indexOf('e') !== -1 || str.toString().indexOf('E') !== -1) {
      str = new BigNumber(str).toFixed().toString()
    }
    if (str.toString().indexOf('.') !== -1) {
        let splitString = str.split('.')[1]
        if (splitString.length > splitNum) {
          return str.split('.')[0] + '.' + splitString.substr(0, splitNum)
        } else {
          let diffNum = 2 - splitString.length
          for (let i = 0; i < diffNum; i++) {
            splitString += '0'
          }
          return str.split('.')[0] + '.' + splitString
        }
    } else {
      return str + '.00'
    }
  }

  /**
   * 获取水龙头Amount
   * param ['11.1111iris']
   * return ['11.1111']
   */
  static formatAccountCoinsAmount(coinsAmount) {
    return (coinsAmount = /[0-9]+[.]?[0-9]*/.exec(coinsAmount))
  }
  static formatAccountCoinsDenom(coinsDenom){
    return coinsDenom = /[A-Za-z\-]{2,15}/.exec(coinsDenom)
  }
  static firstWordLowerCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toLocaleLowerCase()
    })
  }
  /**
   * 判断当前是移动端还是pc端
   */
  static currentDeviceIsPersonComputer() {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
      if (userAgentInfo.includes(Agents[i]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  // 保留小数，不使用四舍五入
  static toDecimal (num, decimal) {
    num = this.FormatScientificNotationToNumber(num).toString();
    let index = num.indexOf('.');
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
    } else {
      num = num.substring(0)
    }
    // js 最大安全整数是Number.MAX_SAFE_INTEGER 9007199254740991 最好不要超过16位
    return num.length > 15 ?  num : parseFloat(num).toFixed(decimal)
  }

  static formatPerNumber (num,model="decimal") {
    if (typeof num === 'number' && !Object.is(num, NaN)) {
      let afterPoint = String(num).split('.')[1]
      let afterPointLong = (afterPoint && afterPoint.length) || 0
      if (afterPointLong > 2 && num !== 0) {
        if (model = "decimal") {
          return this.toDecimal(num,4)
        }
        return num.toFixed(4)
      } else {
        if (model = "decimal") {
          return this.toDecimal(num,2)
        }
        return num.toFixed(2)
      }
    }
    return num
  }

  static formatPercentage(number){
    return new BigNumber(number).multipliedBy(100)
  }

  static formatNumber(value){
    let million = 1000000;
    if(value > million){
      return `${value/million}M`
    }else {
      return value
    }
  }

  static formatBondedTokens(bondedTokens,totalTokens){
      let tokens,allTokens,thousand = 1000,million = 1000000,billion = 1000000000;
      if(bondedTokens >= billion){
          tokens = `${(Number(bondedTokens) / billion).toFixed(2)}B`
      }else if(bondedTokens >= million){
          tokens = `${(Number(bondedTokens) / million).toFixed(2)}M`
      }else if(bondedTokens >= thousand){
          tokens = `${(Number(bondedTokens) / thousand).toFixed(2)}k`
      }else {
          tokens = `${Number(bondedTokens).toFixed(2)}`
      }

      if(totalTokens >= billion){
          allTokens = `${(Number(totalTokens) / billion).toFixed(2)}B`
      }else if(totalTokens >= million){
          allTokens = `${(Number(totalTokens) / million).toFixed(2)}M`
      }else if(totalTokens >= thousand){
          allTokens = `${(Number(totalTokens) / thousand).toFixed(2)}k`
      }else {
          allTokens = `${Number(totalTokens).toFixed(2)}`
      }
      return `${tokens} / ${allTokens}`
  }

  static formatPercentageNumbers (numerator,denominator,symbol='%') {
    let part = new BigNumber(numerator)
    let total = new BigNumber(denominator)
    // let result = (part.dividedBy(total) * 100).toFixed(2) + symbol
    let result = this.toDecimal(part.dividedBy(total) * 100,2) + symbol
    return result
  }

  static testUrl(url) {
    let reg = new RegExp('[a-zA-z]+://[^\s]*')
    return reg.test(url)
  }
    //bigNumber的加减乘除
    static bigNumberAdd(num1,num2){
        return new BigNumber(num1).plus(num2).toNumber();
    }
    static bigNumberSubtract(num1,num2){
        return new BigNumber(num1).minus(num2).toNumber();
    }

    static bigNumberMultiply(num1,num2){
        /*if(isNaN(new BigNumber(num1).multipliedBy(num2).toNumber())){
            return 0;
        }else{
            return new BigNumber(num1).multipliedBy(num2).toNumber();
        }*/
        return moveDecimal(num1 + '', (num2 + '').length - 1);
    }
    static bigNumberDivide(num1,num2){
        /*return new BigNumber(num1).div(num2).toNumber();*/
        return moveDecimal(num1 + '', ((num2 + '').length - 1) * -1);
    }

    //实际交易数字转换成'1,223,021.2124'格式
    static getDisplayNumber(num, val = 4){
        return Tools.toFormat(Tools.formatNum(num, val), val)
    }

    /*static formatAmount(num,p = displayToken2ActualTxToken){

        return Tools.bigNumberDivide(num, p);
    }*/

    static formatNum(num,val = 4){
        return new BigNumber(num).toFixed(val,1);
    }
    static toFormat(num,count = 4,bool){

        if(isNaN(num)){
            return '';
        }
        if(bool){
            return new BigNumber(num).toFormat();
        }else{
            return new BigNumber(num).toFormat(count);
        }
    }

    // 1024678.666 → 1.02m
    static formatMillion(value,n=2){
      let million = 1000000;
      if(value > million){
        return `${Math.floor((value/million) * Math.pow(10, n)) / Math.pow(10, n)}m`
      }else {
        return value
      }
    }

  static isJSON (str) {
      if (str.length < 120) {
        return false
      }
      try {
        let obj = JSON.parse(str);
        return obj && typeof obj === 'object';
      } catch (e) {}
      return false;
    }

    /**
     * Format PoolID
     */
    static formatPoolId(poolId) {
        if(poolId) {
            if(poolId.startsWith('farm-')) {
              // pool_id 标准模式 farm-***
              // 考虑到create pool的pool_id可能不是标准模式,所以匹配 farm-
                return poolId.split('-')[1];
            } else {
                return poolId;
            }
        }
        return '';
    }
    static MultKeyValueObjToOneMap (objArr) {
      var map = new Map();
      objArr.forEach(obj => {
        map.set(obj.key, obj.value);
      })  
      return map;
    }
    static formatParams(params){
      if(!params || JSON.stringify(params) === '{}'){
        return ''
      }
      let str = ''
      for(let key in params){
        var item = params[key]
        if (item !== null && item !== undefined) {
            str += `${key}=${item}&`
        }
      }
      if (str.length !== 0) {
          str = '?' + str.substring(0, str.length - 1)
      }
      return str
    }
    
}
