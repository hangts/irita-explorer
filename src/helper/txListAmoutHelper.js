import {TX_TYPE,decimals} from "../constant";
import { converCoin, getConfig } from "../helper/IritaHelper";
import { TxHelper } from '../helper/TxHelper';
import Tools from '@/util/Tools';
export async function getAmountByTx(message, isShowDenom) {
	let amountDecimals = decimals.amount
	if (message) {
		let msg = message.msg;
		// let amount = {
		// 	amount:'',
		// 	denom: ''
		// }
		let amount = '--'
		let txType = message.type || '--';
		switch (txType) {
			case TX_TYPE.define_service:
				break;
			case TX_TYPE.bind_service:
				break;
			case TX_TYPE.call_service:
				break;
			case TX_TYPE.respond_service:
				break;
			case TX_TYPE.update_service_binding:
				break;
			case TX_TYPE.disable_service_binding:
				break;
			case TX_TYPE.enable_service_binding:
				break;
			case TX_TYPE.refund_service_deposit:
				break;
			case TX_TYPE.pause_request_context:
				break;
			case TX_TYPE.start_request_context:
				break;
			case TX_TYPE.kill_request_context:
				break;
			case TX_TYPE.update_request_context:
				break;
			case TX_TYPE.create_record:
				break;
			case TX_TYPE.service_set_withdraw_address:
				break;
			case TX_TYPE.withdraw_earned_fees:
				break;
			case TX_TYPE.burn_nft:
				break;
			case TX_TYPE.transfer_nft:
				break;
			case TX_TYPE.edit_nft:
				break;
			case TX_TYPE.issue_denom:
				break;
			case TX_TYPE.mint_nft:
				break;
			case TX_TYPE.issue_token:
				break;
			case TX_TYPE.edit_token:
				break;
			case TX_TYPE.mint_token:
				amount = msg.amount || '--';
				break;
			case TX_TYPE.transfer_token_owner:
				break;
			case TX_TYPE.burn_token:
				amount = msg.amount || '--';
				break;
			case TX_TYPE.send:
				if (msg && msg.amount && msg.amount.length === 1) {
					const sendAmount = msg && msg.amount.length > 0 ? await converCoin(msg.amount[0]) : null
					// formatPriceToFixed 四舍五入 toDecimal 截取
					amount = sendAmount && sendAmount.amount && sendAmount.denom ?  
										isShowDenom ? 
											`${Tools.toDecimal(sendAmount.amount,amountDecimals) } ${sendAmount.denom.toLocaleUpperCase()}` 
											: `${Tools.toDecimal(sendAmount.amount,amountDecimals) }`
										: '--';
					//以 %+原始denom拼接到返回结果里面，用于颜色匹配 
					amount = concatNativeDenom(amount,msg?.amount?.[0]['denom'].toLocaleUpperCase())
					if(sendAmount?.denom &&  sendAmount.denom.startsWith('LPT')  || sendAmount.denom.startsWith('lpt')){
						amount = ''
					}
				}else {
					amount = ''
				}
				break;
			case TX_TYPE.multisend:
				if(msg && msg.inputs && msg.inputs.length && msg.inputs.length  === 1){
					const nativeAmount = msg?.inputs[0]?.coins[0] ?  await converCoin(msg.inputs[0].coins[0]) : ''
					if(nativeAmount){
						// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
						amount = nativeAmount?.amount && nativeAmount?.denom ? `${Tools.toDecimal(nativeAmount.amount,amountDecimals) } ${nativeAmount.denom.toLocaleUpperCase()}` :'--'
						amount = concatNativeDenom(amount,msg.inputs[0].coins[0]['denom'].toLocaleUpperCase())
					}
				}else if(msg && msg.inputs && msg.inputs.length && msg.inputs.length  > 1) {
					amount = ''
				}else {
					amount = '--'
				}
				break;
			case TX_TYPE.verify_invariant:
				break;
			case TX_TYPE.submit_evidence:
				break;
			case TX_TYPE.begin_unbonding:
				let beginUnbondingAmount = msg &&  msg.amount ? await converCoin(msg.amount) : null
				// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
				amount = beginUnbondingAmount && beginUnbondingAmount.amount && beginUnbondingAmount.denom ? isShowDenom ? `${Tools.toDecimal(beginUnbondingAmount.amount,amountDecimals)} ${beginUnbondingAmount.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(beginUnbondingAmount.amount,amountDecimals)}` : '--';
				amount = concatNativeDenom(amount,msg.amount.denom.toLocaleUpperCase())
				break;
			case TX_TYPE.edit_validator:
				break;
			case TX_TYPE.create_validator:
				if(msg && msg?.value){
					let selfBond = await converCoin(msg.value)
					amount = msg?.value ? `${Tools.toDecimal(selfBond.amount,amountDecimals) } ${selfBond.denom.toLocaleUpperCase()}` :'--'
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, msg.value.denom)
				}
				break;
			case TX_TYPE.delegate:
				let delegateAmount = msg &&  msg.amount ? await converCoin(msg.amount) : null
				amount = delegateAmount && delegateAmount.amount  && delegateAmount.denom ? isShowDenom ? `${Tools.toDecimal(delegateAmount.amount,amountDecimals)} ${delegateAmount.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(delegateAmount.amount,amountDecimals)}` : '--'
				// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
				amount = concatNativeDenom(amount, msg.amount.denom)
				break;
			case TX_TYPE.begin_redelegate:
				const beginRedelegateAmount = msg && msg.amount ?  await converCoin(msg.amount) :null
				amount = beginRedelegateAmount && beginRedelegateAmount.amount && beginRedelegateAmount.denom ? isShowDenom ? `${Tools.toDecimal(beginRedelegateAmount.amount,amountDecimals)} ${beginRedelegateAmount.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(beginRedelegateAmount.amount,amountDecimals)}` : '--';
				// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
				amount = concatNativeDenom(amount, msg.amount.denom)
				break;
			case TX_TYPE.unjail:
				break;
			case TX_TYPE.set_withdraw_address:
				break;
			case TX_TYPE.withdraw_delegator_reward:
				let rewardAmount = msg &&  msg.amount ? await converCoin(msg.amount) : null
				amount = rewardAmount && rewardAmount.amount  && rewardAmount.denom ? isShowDenom ? `${Tools.toDecimal(rewardAmount.amount,amountDecimals)} ${rewardAmount.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(rewardAmount.amount,amountDecimals)}` : '--'
				// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
				amount = concatNativeDenom(amount, msg.amount.denom)
				break;
			case TX_TYPE.withdraw_validator_commission:
				break;
			case TX_TYPE.fund_community_pool:
				let poolAmount = msg && msg.amount && msg.amount.length > 0 ? await converCoin(msg.amount[0]) : null
				amount = poolAmount && poolAmount.amount  && poolAmount.denom?  isShowDenom ? `${Tools.toDecimal(poolAmount.amount,amountDecimals)} ${poolAmount.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(poolAmount.amount,amountDecimals)}` : '--'
				// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
				amount = concatNativeDenom(amount, msg.amount.denom)
				break;
			case TX_TYPE.deposit:
				if(msg?.amount?.length  === 1) {
					let amountMaxUnit = await converCoin(msg.amount[0]);
					amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, msg.amount[0].denom)
				}
				break;
			case TX_TYPE.vote:
				break;
			case TX_TYPE.submit_proposal:
				let content = msg.content && msg.content.amount && msg.content.amount[0]
				if(content) {
					content = await converCoin(content)
					if(content.amount !== '0') {
						amount = isShowDenom ? `${Tools.toDecimal(content.amount,amountDecimals)} ${content.denom.toUpperCase()}` : `${Tools.toDecimal(content.amount,amountDecimals)}`
						// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					  amount = concatNativeDenom(amount, content.denom)
					} else {
						amount = '--'
					}
				}
				if (amount === '--') {
					let initialDeposit = msg.initial_deposit && msg.initial_deposit[0];
					if (initialDeposit) {
						initialDeposit = await converCoin(initialDeposit)
						amount = isShowDenom ? `${Tools.toDecimal(initialDeposit.amount,amountDecimals)} ${initialDeposit.denom.toUpperCase()}` : `${Tools.toDecimal(initialDeposit.amount,amountDecimals)}`
					  	// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
						amount = concatNativeDenom(amount, initialDeposit.denom)
					} else {
					}
				}
				break;
			case TX_TYPE.add_liquidity:
				let amountArray = []
				if(msg?.swap_amount?.length === 2){
					const addliquidityAmount = msg.swap_amount[0]
					if(addliquidityAmount.includes(',')){
						/**
						 * 以 %+原始denom拼接到返回结果里面，用于颜色匹配
						 */
						const amountItem = addliquidityAmount.split(',')
						const nativeDenom1 = getNativeDenom(amountItem[0])
						const nativeDenom2 = getNativeDenom(amountItem[1])
						const tokenAmount1 =  await converCoin(formatAccountCoinsAmount(amountItem[0]))
						const tokenAmount2 =  await converCoin(formatAccountCoinsAmount(amountItem[1]))

						const addLiquidityAmount1 = `${Tools.toDecimal(tokenAmount1.amount,amountDecimals)} ${tokenAmount1.denom.toUpperCase()}`
						const addLiquidityAmount2 = `${Tools.toDecimal(tokenAmount2.amount,amountDecimals)} ${tokenAmount2.denom.toUpperCase()}`
						amountArray.push(concatNativeDenom(addLiquidityAmount1,nativeDenom1), concatNativeDenom(addLiquidityAmount2,nativeDenom2))
						amount = amountArray
					}
				}
				break;
			case TX_TYPE.remove_liquidity:
				let removeAmountArray = []
				if(msg?.swap_amount?.length === 2){
					/**
					 * 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					 */
					let removeLiquidityAmount = msg.swap_amount[1]
					let tokenAmount1,tokenAmount2;
					if(removeLiquidityAmount.includes(',')){
						const amountItem = removeLiquidityAmount.split(',')
						const nativeDenom1 = getNativeDenom(amountItem[0])
						const nativeDenom2 = getNativeDenom(amountItem[1])
						tokenAmount1 =  await converCoin(formatAccountCoinsAmount(amountItem[0]))
						tokenAmount2 =  await converCoin(formatAccountCoinsAmount(amountItem[0]))
						const removeLiquidityAmount1 = `${Tools.toDecimal(tokenAmount1.amount,amountDecimals)} ${tokenAmount1.denom.toUpperCase()}`
						const removeLiquidityAmount2 = `${Tools.toDecimal(tokenAmount2.amount,amountDecimals)} ${tokenAmount2.denom.toUpperCase()}`
						removeAmountArray.push(concatNativeDenom(removeLiquidityAmount1,nativeDenom1), concatNativeDenom(removeLiquidityAmount2,nativeDenom2))
						amount = removeAmountArray
					}else{
						const nativeDenom = getNativeDenom(removeLiquidityAmount)
						tokenAmount1 =  await converCoin(formatAccountCoinsAmount(removeLiquidityAmount))
						const removeLiquidityAmount1 = `${Tools.toDecimal(tokenAmount1.amount,amountDecimals)} ${tokenAmount1.denom.toUpperCase()}`
						const removeLiquidityAmount2 = '--'
						removeAmountArray.push(concatNativeDenom(removeLiquidityAmount1,nativeDenom), removeLiquidityAmount2)
						amount = removeAmountArray
					}
				}
				break;
			case TX_TYPE.swap_order:
				let swapOrderAmount = []
				if(msg?.input?.coin && JSON.stringify(msg.input.coin) !== '{}'){
					/**
					 * 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					 */
					const swapOrderAmount1 = await converCoin(msg.input.coin)
					const swapOrderAmountStr1 = `${swapOrderAmount1.amount} ${swapOrderAmount1.denom.toUpperCase()}%${msg.input.coin.denom.toUpperCase()}`
					swapOrderAmount.push(swapOrderAmountStr1)
				}
				if(msg?.output?.coin && JSON.stringify(msg.output.coin) !== '{}'){
					const swapOrderAmount2 = await converCoin(msg.output.coin)
					const swapOrderAmountStr2 = `${swapOrderAmount2.amount} ${swapOrderAmount2.denom.toUpperCase()}%${msg.output.coin.denom.toUpperCase()}`
					swapOrderAmount.push(swapOrderAmountStr2)
				}
				amount = swapOrderAmount
				break;
			case TX_TYPE.create_htlc:
				if(msg.amount && msg.amount[0]) {
					let amountMaxUnit = await converCoin(msg.amount[0]);
					amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, msg.amount[0]['denom'])
				}
				break;
			case TX_TYPE.claim_htlc:
				if(msg.amount) {
					let amountMaxUnit = await converCoin(msg.amount);
					amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, msg.amount['denom'])
				}
				break;
			case TX_TYPE.refund_htlc:
				break;
			case TX_TYPE.add_profiler:
				break;
			case TX_TYPE.delete_profiler:
				break;
			case TX_TYPE.add_trustee:
				break;
			case TX_TYPE.delete_trustee:
				break;
			case TX_TYPE.create_feed:
				break;
			case TX_TYPE.start_feed:
				break;
			case TX_TYPE.pause_feed:
				break;
			case TX_TYPE.edit_feed:
				break;
			// 联盟链和公有链 ibc交易类型名称一致
			case TX_TYPE.recv_packet:
				if(msg.packet && msg.packet.data) {
					//以 %+原始denom拼接到返回结果里面，用于颜色匹配
					let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,txType);
					let amountMaxUnit = await converCoin({
						denom:originalDenom || msg.packet.data.denom,
						amount:msg.packet.data.amount,
					});
					/**
					 * 拼接上原denom (originalDenom),用于匹配颜色
					 */
					amount = isShowDenom ? 
					        `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}%${originalDenom.toUpperCase()}`
									: `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;  
				}
				break;
			// 联盟链和公有链 ibc交易类型名称一致
			case TX_TYPE.create_client:
				break;
			// 联盟链和公有链 ibc交易类型名称一致
			case TX_TYPE.update_client:
				break;
			case TX_TYPE.create_identity:
				break;
			case TX_TYPE.update_identity:
				break;
			case TX_TYPE.transfer:
				if(msg?.token) {
						let amountMaxUnit = await converCoin(msg.token);
						amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
						// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
						amount = concatNativeDenom(amount, msg?.token?.denom)
				}
				break;
			case TX_TYPE.timeout_packet:
        if(msg?.packet && msg?.packet?.data) {
				let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,txType);
        let amountMaxUnit = await converCoin({
						amount:msg.packet.data.amount,
						denom:originalDenom || msg.packet.data.denom,
				});
          amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
				  // 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, originalDenom)
				}
        break;
			case TX_TYPE.upgrade_client:
				break;
			case TX_TYPE.submit_misbehaviour:
				break;
			case TX_TYPE.connection_open_init:
				break;
			case TX_TYPE.connection_open_try:
				break;
			case TX_TYPE.connection_open_ack:
				break;
			case TX_TYPE.connection_open_confirm:
				break;
			case TX_TYPE.channel_open_init:
				break;
			case TX_TYPE.channel_open_try:
				break;
			case TX_TYPE.channel_open_ack:
				break;
			case TX_TYPE.channel_open_confirm:
				break;
			case TX_TYPE.channel_close_init:
				break;
			case TX_TYPE.channel_close_confirm:
				break;
			case TX_TYPE.timeout_on_close_packet:
				break;
			case TX_TYPE.acknowledge_packet:
				if(msg?.packet && msg?.packet?.data) {
					let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,txType);
					let amountMaxUnit = await converCoin({
						amount:msg.packet.data.amount,
						denom: originalDenom || msg.packet.data.denom,
					});
					amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, originalDenom)
				}
				break;
			case TX_TYPE.request_rand:
				if(msg?.service_fee_cap?.length  === 1) {
					let amountMaxUnit = await converCoin(msg.service_fee_cap[0]);
					amount = isShowDenom ? `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)} ${amountMaxUnit.denom.toUpperCase()}` : `${Tools.toDecimal(amountMaxUnit.amount,amountDecimals)}`;
					// 以 %+原始denom拼接到返回结果里面，用于颜色匹配
					amount = concatNativeDenom(amount, msg.service_fee_cap[0]['denom'])
				}
				break;
		}
		return amount
	}
}
function formatAccountCoinsAmount(coinsAmount) {
	const token = {
		denom: '',
		amount: '0'
	}
	token.denom = coinsAmount.includes('ibc') ? `ibc${coinsAmount.split('ibc')[1]}` :/[A-Za-z\-]{2,15}/.exec(coinsAmount)[0]
	token.amount = /[0-9]+[.]?[0-9]*/.exec(coinsAmount)[0]
	return token
}

export async function getDenomMap() {
  let protocolEnums = {
    'hashlock': 'hashlock',
    'ibc': 'ibc'
    // 'native': 'native',
    // 'swap': 'swap',
    // 'peg': 'peg'
  }
  let denomMap = new Map()
  let { tokenData: tokenList } = await getConfig()
  tokenList?.forEach(token =>{
    if(protocolEnums[token.src_protocol]){
			// 这里的symbol可能会有重复，所以换成denom
      // denomMap.set(token.symbol, token.src_protocol)
      denomMap.set(token.denom.toLocaleUpperCase(), token.src_protocol)
    }          
  })
  return denomMap
}

export function getDenomTheme(denom, denomMap) {
  let protocolColorEnums = {
    'hashlock': '#51A3A3',
    'ibc': '#D47D7B',
    // 'native': '',
    // 'swap': '',
    // 'peg': ''
  }
  let protocolNameEnums = {
    'hashlock': 'Hash Lock',
    'ibc': 'IBC'
  }
  let denomRule = /[A-Z]+/
  let denomTheme = {
    denomColor: '',
    tooltipContent: ''
  }
  // let checkDenom = String(denom).match(denomRule)?.[0].toLowerCase()
  if(denomMap.has(denom)){
    denomTheme.tooltipContent = protocolNameEnums[denomMap.get(denom)]
    denomTheme.denomColor = protocolColorEnums[denomMap.get(denom)]
  }
  return denomTheme
}
/**
 * 处理数字和denom拼接一起的数据，返回denom
 * @param {string} str  例如:415669ubnb =>  ubnb
 * @returns                  
 */
export function getNativeDenom(str){
	if(!str){
		return str;
	}else{
		
		return str.replace(/\d/g,'').toUpperCase() 
	}
}

/**
 * 
 * @param {string} str 
 * @param {string} nativeDenom
 * @return str + % + nativedenom 
 */
function concatNativeDenom(str,nativeDenom){
	if(!str || !nativeDenom || str === '--'){
		return str
	}else{
		return str + '%' + nativeDenom?.toLocaleUpperCase(); 
	}
}