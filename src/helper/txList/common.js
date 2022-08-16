import { TxHelper } from '@/helper/TxHelper';
import {TX_TYPE, decimals, Lang, Wen_Cang_Token_Denom} from '@/constant';
import Tools from '@/util/Tools';
import { converCoin } from '@/helper/IritaHelper';
import prodConfig from '@/productionConfig';
import i18n from '@/i18n';
import { getAmountByTx, getDenomMap, getDenomTheme } from '@/helper/txListAmoutHelper';
import {
  isMultisend,
  isRespondService,
  isDenomAndId,
  isFeedNameAndCreator,
  isConsumer,
  isClientId,
  isConsumerReqIdServiceName,
  isIdSenderName,
  isChannelIdPortId,
  isClientIdConnectionId,
  isDigestDigestAlgo,
  isSymbolMinUnitOwner,
  isReceiver,
  isSymbolOwner,
  isSymbolDstOwnerSrcOwner,
  isSymbolOwner2,
  isSymbolSender,
  isProposalIdOptionVoter,
  isProposalIdDepositor,
  isTitle,
  isConsumerRequestContextId,
  isAuthorServiceName,
  isOwnerProviderServiceName,
  isServiceName,
  isNftIdSenderDestChain,
  isNftIdReceiverSourceChain,
  isNftIdSenderDestChain2,
  isSequenceSourceChainSigner,
  isSigner,
  isChainNameSigner,
  isSenderReceiverDenomId,
  isMtIssueDenom,
  isMtTransferDenom,
  isMintMt,
  isTransferMt,
  isEditMt,
  isBurnMt,
} from './lib';

const getValueFromArr = (values, defaultVal = { more: ' ', default: '--' }) => {
  if (!Array.isArray(values)) {
    return defaultVal.default;
  }

  if (values.length > 1) {
    return defaultVal.more;
  }

  return values.length === 1 ? values[0] : defaultVal.default;
};

const arrHandle = (arr) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  const filters = [null, undefined, ''];
  const res = arr.filter((v) => !filters.includes(v));

  return [...new Set(res)];
};

const getAmountUnit = (amount) => {
  if (!amount) {
    return '';
  }
  const amountRule = /^[0-9]+.?[0-9]*$/;
  if (amountRule.test(amount)) {
    return ' ';
  }
  const denomRule = /[A-Za-z/]+/;
  const result = amount.match(denomRule);
  return result ? result[0] : ' ';
};

const getAmount = (amount) => {
  if (!amount) {
    return '';
  }
  const denomRule = /[0-9.]+/;
  const amountRule = /^[0-9]+.?[0-9]*$/;
  if (amountRule.test(amount)) {
    return amount;
  }
  const result = amount.match(denomRule);
  return result ? amount.match(denomRule)[0] : ' ';
};

/**
 * @param msgType
 * @param txData
 * @param options
 * @returns {Promise<{transactionArray: *[]}>}
 * 处理为列表需要的数据
 */
// eslint-disable-next-line import/prefer-default-export
export const formatTxDataFn = async (
  msgType,
  txData,
  options = {
    isShowFee: prodConfig.fee.isShowFee,
    isShowDenom: prodConfig.fee.isShowDenom,
    feeDecimals: decimals.fee,
    parseTimeFn: () => {},
  }
) => {
  const transactionArray = [];

  try {
    if (txData && txData.length) {
      const fees = [];
      const amounts = [];
      for (const tx of txData) {
        let numberOfToArr = [];
        let requestIdArr = [];
        let denomIdArr = [];
        let denomNameArr = [];
        let nftIdArr = [];
        let feedNameArr = [];
        let oracleCreatorArr = [];
        let consumerArr = [];
        let digestArr = [];
        let digest_algoArr = [];
        let symbolArr = [];
        let minUnitArr = [];
        let ownerArr = [];
        let dstOwnerArr = [];
        let srcOwnerArr = [];
        let sender = '--';
        let senderArr = [];
        let proposalIdArr = [];
        let optionArr = [];
        let voterArr = [];
        let depositorArr = [];
        let title = '--';
        let authorArr = [];
        let providerArr = [];
        let requestContextIdArr = [];
        let serviceNameArr = [];
        let clientIdArr = [];
        let portIdArr = [];
        let channelIdArr = [];
        let connectionIdArr = [];
        let receiverArr = [];
        const sameMsg = [];
        let sameMsgFromAddrArr = [];
        let sameMsgToAddrArr = [];
        let dest_chainArr = [];
        let source_chainArr = [];
        let sequenceArr = [];
        let chain_nameArr = [];
        // mt
        let mtDenomIdArr = [];
        let mtDenomNameArr = [];
        let mtIdArr = [];
        const signers = [];
        let msg;
        // farm => stake unstake
        let poolId = '--';
        const poolIdArr = [];
        let farmAmount = '--';
        let farmAmountDenom = '';
        let farmAmountNativeDenom = '';
        const farmAmountArr = [];
        // farm => create pool
        let totalReward1 = '--';
        let totalReward1Denom = '';
        let totalReward1NativeDenom = '';
        let totalReward2 = '--';
        let totalReward2Denom = '';
        let totalReward2NativeDenom = '';
        let poolCreator = '--';
        // farm => Create Pool With Community Pool
        let proposer = '--';
        let initialDeposit = '--';
        // farm => destory pool/ adjust pool : poolId poolCreator
        // mt
        let mtDenomId = '--';
        let mtDenomName = '--';
        let mtId = '--';
        let mtNumber = '--';

        if (tx.msgs.length > 0) {
          tx.msgs.forEach((item) => {
            if (item.type === msgType) {
              sameMsg.push(item);
              msg = item;
            }
          });
        }

        /*
         * 处理msg获取相关值
         * */
        if (sameMsg?.length > 0) {
          // 处理from 跟 to 的情况
          sameMsg.forEach((item) => {
            const addrObj = TxHelper.getFromAndToAddressFromMsg(item);
            if (addrObj?.from) {
              sameMsgFromAddrArr.push(addrObj.from);
            }
            if (addrObj?.to) {
              sameMsgToAddrArr.push(addrObj.to);
            }

            if (isMultisend(item)) {
              numberOfToArr.push(item?.msg?.outputs?.length);
            }
            if (isRespondService(item)) {
              requestIdArr.push(item?.msg?.request_id);
            }
            if (isDenomAndId(item)) {
              denomIdArr.push(item?.msg?.denom);
              nftIdArr.push(item?.msg?.id);
            }

            if (isFeedNameAndCreator(item)) {
              feedNameArr.push(item?.msg?.feed_name);
              oracleCreatorArr.push(item?.msg?.creator);
            }

            if (isConsumer(item)) {
              consumerArr.push(item?.msg?.consumer);
            }
            if (isClientId(item)) {
              clientIdArr.push(item?.msg?.client_id);
            }
            if (isConsumerReqIdServiceName(item)) {
              consumerArr.push(item?.msg?.consumer);
              requestContextIdArr.push(item?.msg?.request_context_id);
              serviceNameArr.push(item?.msg?.service_name);
            }
            if (isIdSenderName(item)) {
              senderArr.push(item?.msg?.sender);
              denomIdArr.push(item?.msg?.id);
              denomNameArr.push(item?.msg?.name);
            }
            if (isChannelIdPortId(item)) {
              portIdArr.push(item?.msg?.port_id);
              channelIdArr.push(item?.msg?.channel_id);
            }
            if (isClientIdConnectionId(item)) {
              clientIdArr.push(item?.msg?.client_id);
              connectionIdArr.push(item?.msg?.connection_id);
            }

            if (isDigestDigestAlgo(item)) {
              digestArr.push(item?.msg?.contents[0]?.digest);
              digest_algoArr.push(item?.msg?.contents[0]?.digest_algo);
            }
            if (isSymbolMinUnitOwner(item)) {
              symbolArr.push(item?.msg?.symbol);
              minUnitArr.push(item?.msg?.min_unit);
              ownerArr.push(item?.msg?.owner);
            }
            if (isReceiver(item)) {
              receiverArr.push(item?.msg?.packet?.data?.receiver);
            }
            if (isSymbolOwner(item)) {
              symbolArr.push(item?.msg?.symbol);
              ownerArr.push(item?.msg?.owner);
            }
            if (isSymbolDstOwnerSrcOwner(item)) {
              symbolArr.push(item?.msg?.symbol);
              dstOwnerArr.push(item?.msg?.dst_owner);
              srcOwnerArr.push(item?.msg?.src_owner);
            }
            if (isSymbolOwner2(item)) {
              symbolArr.push(item?.msg?.symbol);
              ownerArr.push(item?.msg?.owner);
            }
            if (isSymbolSender(item)) {
              symbolArr.push(item?.msg?.symbol);
              senderArr.push(item?.msg?.sender);
            }
            if (isProposalIdOptionVoter(item)) {
              proposalIdArr.push(item?.msg?.proposal_id);
              optionArr.push(item?.msg?.option);
              voterArr.push(item?.msg?.voter);
            }
            if (isProposalIdDepositor(item)) {
              proposalIdArr.push(item?.msg?.proposal_id);
              depositorArr.push(item?.msg?.depositor);
            }
            if (isTitle(item)) {
              title = item?.msg?.content?.title;
            }
            if (isConsumerRequestContextId(item)) {
              consumerArr.push(item?.msg?.consumer);
              requestContextIdArr.push(item?.msg?.request_context_id);
            }
            if (isAuthorServiceName(item)) {
              authorArr.push(item?.msg?.author);
              serviceNameArr.push(item?.msg?.service_name);
            }
            if (isOwnerProviderServiceName(item)) {
              ownerArr.push(item?.msg?.owner);
              providerArr.push(item?.msg?.provider);
              serviceNameArr.push(item?.msg?.service_name);
            }
            if (isServiceName(item)) {
              serviceNameArr.push(item?.msg?.service_name);
            }
            // 新增
            if (isNftIdSenderDestChain(item)) {
              nftIdArr.push(item?.msg?.id);
              senderArr.push(item?.msg?.sender);
              dest_chainArr.push(item?.msg?.dest_chain);
            }
            if (isNftIdReceiverSourceChain(item)) {
              nftIdArr.push(item?.msg?.packet?.data?.id);
              receiverArr.push(item?.msg?.packet?.data?.receiver);
              source_chainArr.push(item?.msg?.packet?.source_chain);
            }
            if (isNftIdSenderDestChain2(item)) {
              nftIdArr.push(item?.msg?.packet?.id);
              senderArr.push(item?.msg?.packet?.data?.sender);
              dest_chainArr.push(item?.msg?.packet?.destination_chain);
            }
            if (isSequenceSourceChainSigner(item)) {
              sequenceArr.push(item?.msg?.clean_packet?.sequence);
              source_chainArr.push(item?.msg?.clean_packet?.source_chain);
              signers.push(item?.msg?.signer);
            }
            if (isSigner(item)) {
              signers.push(item?.msg?.signer);
            }
            if (isChainNameSigner(item)) {
              chain_nameArr.push(item?.msg?.chain_name);
              signers.push(item?.msg?.signer);
            }
            if (isSenderReceiverDenomId(item)) {
              denomIdArr.push(item?.msg?.id);
              senderArr.push(item?.msg?.sender);
              receiverArr.push(item?.msg?.recipient);
            }
            // mt
            if (isMtIssueDenom(item)) {
              mtDenomIdArr.push(item?.msg?.id);
              mtDenomNameArr.push(item?.msg?.name);
            }
            if (isMtTransferDenom(item)) {
              mtDenomIdArr.push(item?.msg?.id);
              mtDenomNameArr.push(item?.msg?.name);
              receiverArr.push(item?.msg?.recipient);
              senderArr.push(item?.msg?.sender);
            }
            if (isMintMt(item)) {
              mtIdArr.push(item?.msg?.id);
              receiverArr.push(item?.msg?.recipient);
              senderArr.push(item?.msg?.sender);
              mtDenomIdArr.push(item?.msg?.denom);
            }
            if (isTransferMt(item)) {
              mtIdArr.push(item?.msg?.id);
              receiverArr.push(item?.msg?.recipient);
              senderArr.push(item?.msg?.sender);
              mtDenomIdArr.push(item?.msg?.denom);
            }
            if (isEditMt(item)) {
              mtIdArr.push(item?.msg?.id);
              mtDenomIdArr.push(item?.msg?.denom);
            }
            if (isBurnMt(item)) {
              mtIdArr.push(item?.msg?.id);
              mtDenomIdArr.push(item?.msg?.denom);
            }
          });
          /*
           * 同一类型多msg 去重
           * */
          sameMsgFromAddrArr = arrHandle(sameMsgFromAddrArr);
          sameMsgToAddrArr = arrHandle(sameMsgToAddrArr);
          portIdArr = arrHandle(portIdArr);
          channelIdArr = arrHandle(channelIdArr);
          connectionIdArr = arrHandle(connectionIdArr);
          receiverArr = arrHandle(receiverArr);
          numberOfToArr = arrHandle(numberOfToArr);
          requestIdArr = arrHandle(requestIdArr);
          denomIdArr = arrHandle(denomIdArr);
          nftIdArr = arrHandle(nftIdArr);
          feedNameArr = arrHandle(feedNameArr);
          clientIdArr = arrHandle(clientIdArr);
          denomNameArr = arrHandle(denomNameArr);
          oracleCreatorArr = arrHandle(oracleCreatorArr);
          consumerArr = arrHandle(consumerArr);
          digestArr = arrHandle(digestArr);
          digest_algoArr = arrHandle(digest_algoArr);
          symbolArr = arrHandle(symbolArr);
          minUnitArr = arrHandle(minUnitArr);
          ownerArr = arrHandle(ownerArr);
          dstOwnerArr = arrHandle(dstOwnerArr);
          srcOwnerArr = arrHandle(srcOwnerArr);
          senderArr = arrHandle(senderArr);
          proposalIdArr = arrHandle(proposalIdArr);
          optionArr = arrHandle(optionArr);
          voterArr = arrHandle(voterArr);
          depositorArr = arrHandle(depositorArr);
          authorArr = arrHandle(authorArr);
          providerArr = arrHandle(providerArr);
          requestContextIdArr = arrHandle(requestContextIdArr);
          serviceNameArr = arrHandle(serviceNameArr);
          dest_chainArr = arrHandle(dest_chainArr);
          source_chainArr = arrHandle(source_chainArr);
          sequenceArr = arrHandle(sequenceArr);
          chain_nameArr = arrHandle(chain_nameArr);
          mtDenomIdArr = arrHandle(mtDenomIdArr);
          mtDenomNameArr = arrHandle(mtDenomNameArr);
          mtIdArr = arrHandle(mtIdArr);
        }
        //
        if (msg?.type === TX_TYPE.mint_mt) {
          mtNumber = msg?.msg?.amount;
        }
        if (msg?.type === TX_TYPE.transfer_mt) {
          mtNumber = msg?.msg?.amount;
        }
        if (msg?.type === TX_TYPE.burn_mt) {
          mtNumber = msg?.msg?.amount;
        }
        // farm -> stake unstake
        if (msg?.type === TX_TYPE.stake || msg?.type === TX_TYPE.unstake) {
          poolId = Tools.formatPoolId(msg?.msg?.pool_id);
          if (sameMsg?.length > 1) {
            // 判断是多msg, amount显示为空
            farmAmount = ' ';
          } else {
            const res = await converCoin(msg?.msg?.amount);
            farmAmount = res?.amount;
            farmAmountDenom = res?.denom.startsWith('lpt')
              ? res?.denom.toLocaleUpperCase()
              : getAmountUnit(res?.denom.toLocaleUpperCase());
            farmAmountNativeDenom = msg?.msg?.amount.denom.toLocaleUpperCase();
          }
          sender = msg?.msg?.sender;
        }
        // farm -> harvest
        if (msg?.type === TX_TYPE.harvest) {
          poolId = Tools.formatPoolId(msg?.msg?.pool_id);
          sender = msg.msg?.sender;
        }
        // farm -> create pool
        if (msg?.type === TX_TYPE.create_pool) {
          const len =
            msg?.msg?.total_reward && Array.isArray(msg?.msg?.total_reward)
              ? msg?.msg?.total_reward.length
              : 0;
          if (len > 0) {
            const res = await converCoin(msg?.msg?.total_reward?.[0]);
            totalReward1 = Tools.toDecimal(res.amount, 2);
            totalReward1Denom = res?.denom.startsWith('lpt')
              ? res?.denom.toLocaleUpperCase()
              : getAmountUnit(res?.denom.toLocaleUpperCase());
            totalReward1NativeDenom = msg?.msg?.total_reward?.[0].denom.toLocaleUpperCase();
          }
          if (len === 2) {
            const res = await converCoin(msg?.msg?.total_reward?.[1]);
            totalReward2 = Tools.toDecimal(res.amount, 2);
            totalReward2Denom = res?.denom.startsWith('lpt')
              ? res?.denom.toLocaleUpperCase()
              : getAmountUnit(res?.denom.toLocaleUpperCase());
            totalReward2NativeDenom = msg?.msg?.total_reward?.[1].denom.toLocaleUpperCase();
          }
          poolCreator = msg.msg.creator;
        }
        // farm -> create_pool_with_community_pool
        if (msg?.type === TX_TYPE.create_pool_with_community_pool) {
          proposer = msg.msg.proposer;
          title = msg.msg.content.title;
          if (msg?.msg?.initial_deposit && msg?.msg?.initial_deposit.length > 0) {
            const res = await converCoin(msg?.msg?.initial_deposit?.[0]);
            initialDeposit = Tools.toDecimal(res?.amount, 2);
            farmAmountDenom = res?.denom.startsWith('lpt')
              ? res?.denom.toLocaleUpperCase()
              : getAmountUnit(res?.denom.toLocaleUpperCase());
            farmAmountNativeDenom = msg?.msg?.initial_deposit?.[0].denom.toLocaleUpperCase();
          }
        }
        // farm => destroy_pool
        if (msg?.type === TX_TYPE.destroy_pool || msg?.type === TX_TYPE.adjust_pool) {
          poolId = Tools.formatPoolId(msg?.msg?.pool_id);
          poolCreator = msg.msg.creator;
        }

        amounts.push(msg ? (sameMsg?.length > 1 ? ' ' : getAmountByTx(msg, true)) : '--');
        const from = getValueFromArr(sameMsgFromAddrArr);
        const to = getValueFromArr(sameMsgToAddrArr);
        let fromMonikers = ' ';
        let toMonikers = ' ';
        let validatorMoniker;
        let validatorAddress;
        if ((tx.monikers || {}).length) {
          const monikersMap = new Map();
          tx.monikers.forEach((item) => {
            validatorMoniker = Object.values(item)[0] || ' ';
            validatorAddress = Object.keys(item)[0] || ' ';
            monikersMap.set(Object.keys(item)[0], Object.values(item)[0]);
          });
          if (monikersMap.has(from)) {
            fromMonikers = monikersMap.get(from);
          }
          if (monikersMap.has(to)) {
            toMonikers = monikersMap.get(to);
          }
        }
        if (options.isShowFee) {
          fees.push(
            tx.fee && tx.fee.amount && tx.fee.amount.length > 0
              ? converCoin(tx.fee.amount[0])
              : '--'
          );
        }
        let isShowMore = false;
        const type = tx.msgs && tx.msgs[0] && tx.msgs[0].type;
        if (type && (type === TX_TYPE.add_liquidity || type === TX_TYPE.remove_liquidity)) {
          isShowMore = true;
        }
        if (tx.type === TX_TYPE.send) {
          tx &&
          tx.msgs &&
          tx.msgs[0] &&
          tx.msgs[0].msg &&
          tx.msgs[0].msg.amount &&
          tx.msgs[0].msg.amount.length > 1
            ? (isShowMore = true)
            : '';
          const denom = tx?.msgs?.[0]?.msg?.amount?.[0]?.denom;
          if (denom !== undefined && /(ltp|LPT|lpt-|LPT-)/g.test(denom)) {
            isShowMore = true;
          }
        }
        const _contractMethod =
          (i18n?.messages &&
            i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract &&
            i18n?.messages &&
            i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract[
              tx?.msgs[0]?.msg?.ex?.ddc_method
            ]) ||
          tx?.msgs[0]?.msg?.ex?.ddc_method;

        transactionArray.push({
          txHash: tx.tx_hash,
          blockHeight: tx.height,
          txType: (tx.msgs || []).map((item) => item.type),
          from,
          author: getValueFromArr(authorArr),
          provider: getValueFromArr(providerArr),
          requestContextId: getValueFromArr(requestContextIdArr),
          fromMonikers,
          toMonikers,
          receiver: getValueFromArr(receiverArr),
          to,
          portId: getValueFromArr(portIdArr),
          channelId: getValueFromArr(channelIdArr),
          connectionId: getValueFromArr(connectionIdArr),
          validatorMoniker,
          validatorAddress,
          numberOfTo: getValueFromArr(numberOfToArr),
          requestId: getValueFromArr(requestIdArr),
          denomId: getValueFromArr(denomIdArr),
          denomName: getValueFromArr(denomNameArr),
          nftId: getValueFromArr(nftIdArr),
          clientId: getValueFromArr(clientIdArr),
          feedName: getValueFromArr(feedNameArr),
          oracleCreator: getValueFromArr(oracleCreatorArr),
          consumer: getValueFromArr(consumerArr),
          serviceName: getValueFromArr(serviceNameArr),
          digest: getValueFromArr(digestArr),
          digest_algo: getValueFromArr(digest_algoArr),
          symbol: getValueFromArr(symbolArr),
          minUnit: getValueFromArr(minUnitArr),
          owner: getValueFromArr(ownerArr),
          dstOwner: getValueFromArr(dstOwnerArr),
          srcOwner: getValueFromArr(srcOwnerArr),
          sender: senderArr?.length > 1 ? ' ' : senderArr?.length === 1 ? senderArr[0] : sender,
          proposalId: getValueFromArr(proposalIdArr),
          option: getValueFromArr(optionArr),
          voter: getValueFromArr(voterArr),
          depositor: getValueFromArr(depositorArr),
          title,
          signer: getValueFromArr(tx.signers),
          status: tx.status,
          msgCount: tx.msgs.length,
          // time :Tools.getDisplayDate(tx.time),
          Tx_Fee: '',
          Time: Tools.formatLocalTime(tx.time),
          amount: '',
          swapAmount1: '',
          swapDenomTheme1: '',
          swapAmount2: '',
          swapDenomTheme2: '',
          ageTime: Tools.formatAge(
            Tools.getTimestamp(),
            tx.time * 1000,
            i18n.t('ExplorerLang.table.suffix')
          ),
          isShowMore,
          denomTheme: {
            denomColor: '',
            tooltipContent: '',
          },
          dest_chain: getValueFromArr(dest_chainArr),
          source_chain: getValueFromArr(source_chainArr),
          sequence: getValueFromArr(sequenceArr),
          chain_name: getValueFromArr(chain_nameArr),
          // farm stake/unstake/harvest
          poolId,
          farmAmount,
          farmAmountDenom,
          farmAmountNativeDenom,
          // farm create_pool
          totalReward1,
          totalReward1Denom,
          totalReward1NativeDenom,
          totalReward2,
          totalReward2Denom,
          totalReward2NativeDenom,
          poolCreator,
          // farm create_pool_with_community_pool
          proposer,
          initialDeposit,
          // EVM智能合约
          contractAddr:
            tx?.contract_addrs && tx?.contract_addrs.length > 0 ? tx?.contract_addrs[0] : '--',
          contractMethod: _contractMethod || '--',
          mtDenomId: getValueFromArr(mtDenomIdArr),
          mtDenomName: getValueFromArr(mtDenomNameArr),
          mtId: getValueFromArr(mtIdArr),
          mtNumber: mtIdArr?.length > 1 ? ' ' : mtNumber,
        });
        /**
         * @description: from parseTimeMixin
         */
        options.parseTimeFn && options.parseTimeFn();
        // this.parseTime('transactionArray', 'Time', 'ageTime');
      }
      if (fees && fees.length > 0 && options.isShowFee) {
        const fee = await Promise.all(fees);
        transactionArray.forEach((item, index) => {
          // remove denom
          transactionArray[index].Tx_Fee =
            fee[index] && fee[index].amount
              ? options.isShowDenom
                ? `${Tools.toDecimal(fee[index].amount, options.feeDecimals)}`
                : `${Tools.toDecimal(fee[index].amount, options.feeDecimals)}`
              : '--';
        });
      }
      if (amounts && amounts.length > 0) {
        const amount = await Promise.all(amounts);
        const denomMap = await getDenomMap();
        transactionArray.forEach((item, index) => {
          if (amount[index]?.length === 2) {
            /**
             * 取 % 后面拼接的原始denom, 用来匹配theme
             */
            const result1 = amount[index][0].split('%');
            const result2 = amount[index][1].split('%');
            transactionArray[index].swapDenomTheme1 = getDenomTheme(result1[1], denomMap);
            transactionArray[index].swapDenomTheme2 = getDenomTheme(result2[1], denomMap);
            transactionArray[index].swapAmount1 = getAmount(result1[0]);
            transactionArray[index].swapAmount1Denom = getAmountUnit(result1[0]);
            transactionArray[index].swapAmount2 = getAmount(result2[0]);
            transactionArray[index].swapAmount2Denom = getAmountUnit(result2[0]);
          } else {
            const result = amount[index].split('%');
            transactionArray[index].denomTheme = getDenomTheme(result[1], denomMap);
            transactionArray[index].amount = getAmount(result[0]);
            transactionArray[index].denom = getAmountUnit(result[0]);
            // 文昌链上面的 denom 要展示成能量值
            if (
              transactionArray[index].txType[0] === TX_TYPE.send &&
              prodConfig?.isShowEnergy &&
              prodConfig?.lang === Lang.CN &&
              (transactionArray[index].denom === Wen_Cang_Token_Denom.ugas ||
                transactionArray[index].denom === Wen_Cang_Token_Denom.uirita)
            ) {
              transactionArray[index].denom = i18n.t('ExplorerLang.table.energy');
            }

            const denom = /[A-Za-z-]{2,15}/.exec(amount[index])?.length
              ? /[A-Za-z-]{2,15}/.exec(amount[index])[0]
              : ' ';
            if (denom !== undefined && /(lpt|LPT|lpt-|LPT-)/g.test(denom)) {
              transactionArray[index].amount = '';
            } else if (/(IBC | ibc)/g.test(denom)) {
              transactionArray[index].amount = ' ';
              transactionArray[index].denom = ' ';
            }
          }
          /**
           * 目标：给farm下的farmAmount totalReward1 totalReward2 initialDeposit上色
           * 方法：借助了farmAmountNativeDenom 用于保存原始denom,不使用转换后的symbol, totalReward同理
           * farmAmount initalDeposit 都是用dnomeTheme
           */
          if (transactionArray[index].farmAmountDenom) {
            transactionArray[index].denomTheme = getDenomTheme(
              transactionArray[index].farmAmountNativeDenom,
              denomMap
            );
          } else if (transactionArray[index].totalReward1Denom) {
            transactionArray[index].swapDenomTheme1 = getDenomTheme(
              transactionArray[index].totalReward1NativeDenom,
              denomMap
            );
            transactionArray[index].swapDenomTheme2 = getDenomTheme(
              transactionArray[index].totalReward2NativeDenom,
              denomMap
            );
          }
        });
      }
    }
  } catch (error) {
    throw error;
  }

  return {
    transactionArray,
  };
};

export const getCountMsgs = (response, options = { errorText: '--' }) => {
  const res = [];

  if (prodConfig.txQueryKeys && Object.keys(prodConfig.txQueryKeys).length) {
    const showKeys = Object.keys(prodConfig.txQueryKeys).filter((v) => prodConfig.txQueryKeys[v]); // 所有配置的展示项(true展示)
    const countKey = [
      {
        queryKey: 'countMsg',
        resKey: 'total_tx_msgs',
        title: i18n.t('ExplorerLang.transactions.countMsg'),
        icon: 'iconxingzhuangjiehe2',
      },
    ];
    countKey
      .filter((v) => showKeys.includes(v.queryKey))
      .forEach((v) => {
        res.push({
          title: v.title,
          count:
            response[v.resKey] || response[v.resKey] === 0 ? response[v.resKey] : options.errorText,
          icon: v.icon,
        });
      });
  }
  return res;
};

// 因为后端只改了交易列表的接口，这里复制一份单独处理，上面的还是处理地址详情页
export const getCountMsgs2 = (response, options = { errorText: '--' }) => {
  const res = [];

  if (prodConfig.txQueryKeys2 && Object.keys(prodConfig.txQueryKeys2).length) {
    const showKeys = Object.keys(prodConfig.txQueryKeys2).filter((v) => prodConfig.txQueryKeys2[v]); // 所有配置的展示项(true展示)
    const countKey = [
      {
        queryKey: 'msg_count', // 主要是这里，入参变了
        resKey: 'total_tx_msgs',
        title: i18n.t('ExplorerLang.transactions.countMsg'),
        icon: 'iconxingzhuangjiehe2',
      },
    ];
    countKey
      .filter((v) => showKeys.includes(v.queryKey))
      .forEach((v) => {
        res.push({
          title: v.title,
          count:
            response[v.resKey] || response[v.resKey] === 0 ? response[v.resKey] : options.errorText,
          icon: v.icon,
        });
      });
  }
  return res;
};
