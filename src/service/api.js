import { HttpHelper } from '../helper/httpHelper';
import { requestThrottler } from '../helper/throttleHttpHelper';
import { TX_STATUS } from '../constant'
import Tools from '@/util/Tools'
import moment from 'moment';
import axios from 'axios';

function get(url){
	return new Promise(async (res,rej)=>{
    url = `/api/${url.replace(/^\//, '')}`;
		try{
			let data = await HttpHelper.get(url);
			if(data && data.code == 0){
				res(data.data || data);
			}else{
				console.error(`error from ${url}:`,JSON.stringify(data));
				rej(data);
			}

		}catch(err){
			console.error(`error from ${url}:`,err.message);
			rej(err);
		}
	});
}

async function throttlerPost(url, payload){
  url = `/api/${url.replace(/^\//, '')}`;
  try{
    let data = await requestThrottler(url, payload);
    if(data && data.code == 0){
      return data;
    }else{
      console.error(`error from ${url}:`,JSON.stringify(data));
      return data;
    }
  }catch(err){
    console.error(`error from ${url}:`,err.message);
    return err;
  }
}

function getFromLcd(url){
  url = `/lcd/${url.replace(/^\//,'')}`;
	return new Promise(async (res,rej)=>{
		try{
			let data = await HttpHelper.get(url);
			if(data){
				res(data);
			}else{
				console.error(`error from ${url}:`,JSON.stringify(data));
				rej(data);
			}
		}catch(err){
			console.error(`error from ${url}:`,err.message);
			rej(err);
		}
	})
}

export async function getIbcToken(payload){
  const url = '/upload-token-info'   
	return await throttlerPost(url, payload);
}

export function getDbStatistics(params){
	let url = `statistics/db?params=${params}`;
	return get(url);
}

export function getNetworkStatistics(params){
	let url = `statistics/network?params=${params}`;
	return get(url);
}

export function getBlockList(pageNum, pageSize, useCount=false){
	let url = `blocks?pageNum=${pageNum || ''}&pageSize=${pageSize || ''}&useCount=${useCount}`;
	return get(url);
}

export function getRangeBlockList(start, end, useCount=false){
  let url = `blocks/range?start=${start || ''}&end=${end || ''}&useCount=${useCount}`;
	return get(url);
}

export function getDenoms(pageNum, pageSize, useCount = false, needAll, denomNameOrId){
	let url = `denoms?`;
	if(needAll){
	    url += `needAll=${needAll}`;
  } else if(pageNum && pageSize){
     url += `pageNum=${pageNum}&pageSize=${pageSize}`;
  } 
  if (denomNameOrId) {
    url += `${url.length === 7 ? '' : '&' }denomNameOrId=${denomNameOrId}`;
  }
  if(useCount){
    url += `${url.length === 7 ? '' : '&' }useCount=${useCount}`;
  }
	return get(url);
}

export function getNfts(pageNum, pageSize, useCount = false, denom, nftId, owner){
    nftId = nftId?.toString()?.replace(/\%/g,'%25').replace(/\#/g,'%23').replace(/\+/g,'%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F').replace(' ','+').replace(/\?/g,'%3F').replace(/\&/g,'%26').replace(/\=/g,'%3D')
	let url = `nfts?denomId=${denom||''}&nftId=${nftId||''}&owner=${owner||''}`;
  if(pageNum && pageSize){
    url += `&pageNum=${pageNum}&pageSize=${pageSize}`
  }
  if(useCount){
    url += `&useCount=${useCount}`;
  }
	return get(url);
}

export function getNftDetail(denom, nftId){
	let url = `nfts/details?denomId=${denom}&nftId=${nftId}`;
	return get(url);
}

export function getBlockWithHeight(height){
	let url = `blocks/${height}`;
	return get(url);
}

export function getLatestBlock(){
	let url = `blocks/latest`;
	return get(url);
}

export function getValidatorList(isJailed, pageNum, pageSize, useCount=false){
	let url = `validators?jailed=${isJailed}&pageNum=${pageNum||''}&pageSize=${pageSize||''}&useCount=${useCount}`;
	return get(url);
}

export function getAllTxTypes(){
    let url = `txs/types`;
    return get(url);
}

export function getAllServiceTxTypes(){
    let url = `txs/types/service`;
    return get(url);
}

export function getTxList(params){
    const {txType, status, beginTime, endTime, pageNum, pageSize, useCount} = params;
    let url = `txs?`;
    if(pageNum && pageSize){
      url += `pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    if(txType){
        url += `&type=${txType}`;
    }
    if(status){
        url += `&status=${status}`;
    }
    if(beginTime){
        url += `&beginTime=${moment(beginTime).startOf('d').unix()}`;
    }
    if(endTime){
        url += `&endTime=${moment(endTime).endOf('d').unix()}`;
    }
    return get(url);
}

export function getRelevanceTxList(type, contextId, pageNum, pageSize, useCount){
    let url = `txs/relevance?type=${type}&contextId=${contextId}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getTokenTxList(nftId, denom, pageNum, pageSize, useCount){
    let url = `txs/nfts?tokenId=${nftId}&denomId=${denom}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getCallServiceWithAddress(pageNum, pageSize, useCount, consumerAddr){
    let url = `txs/services/call-service?consumerAddr=${consumerAddr}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getRespondServiceWithAddress(providerAddr, pageNum, pageSize, useCount){
    let url = `txs/services/respond-service?providerAddr=${providerAddr}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getServiceDetail(serviceName){
    let url = `txs/services/detail/${serviceName}`;
    return get(url);
}

export function getServiceBindingTxList(serviceName, pageNum, pageSize, useCount){
    let url = `txs/services/providers?serviceName=${serviceName}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getServiceTxList(type, status, serviceName,pageNum,pageSize,useCount){
    let url = `txs/services/tx?serviceName=${serviceName}`;
    if(type){
        url += `&type=${type}`;
    }
    if(status==TX_STATUS.success || status === TX_STATUS.fail){
        url += `&status=${status}`;
    }
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
        url += `&useCount=${useCount}`;
    }

    return get(url);
}

export function getBlockTxList(height){
    let url = `txs/blocks?pageNum=1&pageSize=100&height=${height}`;
    return get(url);
}

export function getTxDetail(hash){
    let url = `txs/${hash}`;
    return get(url);
}

export function getAddressTxList(address, type, status, pageNum, pageSize, useCount){
    let url = `txs/addresses?address=${address}&type=${type}&status=${status}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

// export function getDefineServiceTxList(type, status, pageNum, pageSize){
//     let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&type=${type}&status=${status}`;
//     return get(url);
// }

export function getAllServiceTxList(pageNum, pageSize, useCount, iptVal){
    let url = `txs/services?`;
    if(pageNum && pageSize){
      url += `pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `useCount=${useCount}`;
    }
    if(iptVal){
      url += `&nameOrDescription=${iptVal}`;
    }
    return get(url);
}

export function getServiceRespondInfo(serviceName, provider){
    let url = `txs/services/bind_info?serviceName=${serviceName}&provider=${provider}`;
    return get(url);
}



export async function getServiceBindingByServiceName(serviceName, provider){
    let url = `service/bindings/${serviceName}`;
    if(provider){
        url += `/${provider}`;
    }
    let res = await getFromLcd(url);
    if (res && res.result && res.result.value) {
        res.result = res.result.value;
    }
    return res;
}

export async function getServiceContextsByServiceName(requestContextId){
    let url = `service/contexts/${requestContextId}`;
    let res = await getFromLcd(url);
    if (res && res.result && res.result.value) {
        res.result = res.result.value;
    }
    return res;
}

export function getRespondServiceRecord(serviceName, provider, pageNum, pageSize, useCount){
    let url = `txs/services/respond?serviceName=${serviceName}&provider=${provider}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getNodeInfo(){
    return getFromLcd('node_info');
}
export function getIdentities(identity, pageNum, pageSize, useCount = false){
    let url = `identities?search=${identity}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getValidatorsListApi(pageNum, pageSize, useCount,status){
    let url = `staking/validators?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&status=${status}`;
    return get(url);
}

export function getValidatorsInfoApi(valAddress){
    let url = `staking/validators/${valAddress}`;
    return get(url);
}
export function getIdentityDetail(identity){
    let url = `/identities/${identity}`;
    return get(url);
}

export function getPubkeyListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `identities/pubkey?id=${identity}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getCertificateListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `identities/certificate?id=${identity}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getTxListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `txs/identity?id=${identity}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getIdentityListByAddress(address, pageNum, pageSize, useCount){
    let url = `identities/address?address=${address||''}`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getValidatorWithdrawAddrApi(delegatorAddr){
    let url = `/distribution/delegators/${delegatorAddr}/withdraw_address`;
    return get(url);
}

export function getValidatorRewardsApi(valAddress){
    let url = `/distribution/validators/${valAddress} `;
    return get(url);
}

export function getValidatorCommissionInfoApi(){
    let url = `/staking/commission_info`;
    return get(url);
}

export function getValidatorsDelegationsApi(valAddress,pageNum,pageSize,useCount){
    let url = `/staking/validators/${valAddress}/delegations?`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getUnbondingDelegationsApi(valAddress,pageNum,pageSize,useCount){
    let url = `/staking/validators/${valAddress}/unbonding-delegations?`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getDelegationTxsApi(valAddress, pageNum, pageSize, useCount, type='', status='', beginTime='', endTime='') {
    let url = `/txs/staking?type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getValidationTxsApi(valAddress, pageNum, pageSize, useCount, type='', status='', beginTime='', endTime=''){
    let url = `/txs/declaration?type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getAddressInformationApi(address){
    let url = `/staking/account/${address}`;
    return get(url);
}

export function getDelegationListApi(address,pageNum,pageSize){
    let url = `/staking/delegators/${address}/delegations?useCount=true&pageNum=${pageNum}&pageSize=${pageSize}`;
    return get(url);
}

export function getUnBondingDelegationListApi(address,pageNum,pageSize){
    let url = `/staking/delegators/${address}/unbonding_delegations?useCount=true&pageNum=${pageNum}&pageSize=${pageSize}`;
    return get(url);
}

export function getRewardsItemsApi(address){
    let url = `/distribution/delegators/${address}/rewards`;
    return get(url);
}

export function getTypeStakingApi(address){
    let url = `/txs/types/staking`;
    return get(url);
}

export function getTypeDeclarationApi(address){
    let url = `/txs/types/declaration`;
    return get(url);
}

export function getTypeGovApi(address){
    let url = `/txs/types/gov`;
    return get(url);
}

export function getValidatorSetList (pageNum,pageSize,height) {
	const url = `/blocks/validatorset?height=${height}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`
	return get(url)
}

export function getConfig () {
  const url = `/config`
	return get(url)
}

export function stakingBlockInformation(height) {
	const url = `/blocks/staking/${height}`
	return get(url)
}

export function getNativeAssetsListApi(pageNum, pageSize, useCount) {
    let url = `/asset/tokens?`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url)
}

export function getNativeAssetsTxsApi (pageNum, pageSize, useCount, type, symbol) {
    let url = `/txs/asset?type=${type}`
    if (symbol) {
        url += `&symbol=${symbol}`
    }
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
	return get(url)
}

export function getNativeAssetDetailApi (symbol) {
    let url = `/asset/tokens/${symbol}`
	return get(url)
}

export function getProposalsListApi (status, pageNum, pageSize, useCount) {
    let url = `/gov/proposals?`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    if(status){
      url += `&status=${status}`;
    }
    return get(url)
}

export function getProposalsDetailApi (id) {
    let url = `/gov/proposals/${id}`
	return get(url)
}

export function getProposalDetailVotersApi (id, pageNum, pageSize, useCount,voterType) {
    let url = `/gov/proposals/${id}/voter?voterType=${voterType}`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url)
}

export function getProposalDetailDepositorApi (id,pageNum, pageSize, useCount) {
    let url = `/gov/proposals/${id}/depositor?`
    if(pageNum && pageSize){
      url += `pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `useCount=${useCount}`;
    }
    return get(url)
}

export function getGovTxsApi(valAddress, pageNum, pageSize, useCount=true, type='', status='', beginTime='', endTime=''){
    let url = `/txs/gov?type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getDepositedProposalsApi (valAddress,pageNum,pageSize,useCount) {
    let url = `/staking/validators/${valAddress}/deposit?`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getVotedProposalsApi (valAddress,pageNum,pageSize,useCount) {
    let url = `/staking/validators/${valAddress}/votes?`;
    if(pageNum && pageSize){
      url += `&pageNum=${pageNum}&pageSize=${pageSize}`
    }
    if(useCount){
      url += `&useCount=${useCount}`;
    }
    return get(url);
}

export function getIbcTransferByHash(hash){
    let url = `ibc/applications/transfer/v1beta1/denom_traces/${hash}`;
    return getFromLcd(url);
}

export function fetchTokenStats () {
    let url = `/statistics/token_stats`;
    return get(url);
}

export function fetchTokenDistribution () {
    let url = `/statistics/account_total`;
    return get(url);
}

export function fetchTokenRichList () {
    let url = `/statistics/accounts`;
    return get(url);
}
export function fetchAllTokens() {
    const url=`/cosmos/bank/v1beta1/supply`
    return getFromLcd(url);
}

/**
 * 获取ddc列表
 * @param {object} params
 * @param {string} params.owner DDC拥有者
 * @param {string} params.ddc_id	ddcId或ddcName
 * @param {string} params.contract_address	智能合约地址	
 * @param {boolean} params.useCount 
 * @param {number} params.pageNum
 * @param {number} params.pageSize
 *
 */
export function getDdcList(params){
  const url ='/ddcs' + Tools.formatParams(params)  
  return get(url)
}

/**
 * 获取ddc详情
 * @param {*} params 
 * @param {*} params 
 * @returns 
 */
export function getDdcDetail(params){
  const url = '/ddcs/details'+ Tools.formatParams(params) 
  return get(url)
}


/**
 * ddc详情页/地址详情页bsn-ddc交易记录列表
 * @param {*} params	 
 * @param {*} params.pageNum	 
 * @param {*} params.pageSize	 
 * @param {*} params.type	 
 * @param {boolean} params.useCount	   是否查总数
 * @returns 
 */
export function getDdcTxList(params){
  const url = '/txs/ddcs' + Tools.formatParams(params)
  return get(url)
}


export function getEnergyAssetApi(valAddress){
  let url = `/bank/balances/${valAddress}`
  return  getFromLcd(url);
}

