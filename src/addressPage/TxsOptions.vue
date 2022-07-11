<template>
  <list-component
    :is-show-token-type="true"
    :is-loading="isAddressTxLoading"
    :token-symbol="mainTokenSymbol"
    :list-data="transactionArray"
    :column-list="txColumnList"
    :pagination="{
      pageSize: Number(pageSize),
      dataCount: totalTxNumber,
      pageNum: Number(pageNum),
    }"
    @pageChange="pageChange"
  >
    <template v-slot:msgType>
      <tabs-component :tab-list="txTypeOption" @onSelectMagType="getFilterTxs"></tabs-component>
    </template>
    <template v-slot:resetButton>
      <tx-reset-button-component @resetParams="resetFilterCondition"></tx-reset-button-component>
    </template>

    <template v-slot:datePicket>
      <tx-status-tabs-components
        :is-show-date-picker="false"
        @onChangTxStatus="changeTxStatus"
        @onChangeDate="changeTime"
        ref="statusDatePicker"
      ></tx-status-tabs-components>
    </template>
    <template v-slot:txCount>
      <div class="txCountWrap">
        <tx-count-component
          :title="$t('ExplorerLang.transactions.txs')"
          :icon="'iconTrainsaction'"
          :tx-count="totalTxNumber"
        >
          <template v-slot:displayShowAddressSendTx>
            <address-send-and-receive-tx
              v-if="isShowSendAndReceiveTxComponent"
            ></address-send-and-receive-tx>
          </template>
        </tx-count-component>
      </div>
    </template>
  </list-component>
</template>

<script>
import ListComponent from '@/components/common/ListComponent';
import { TxHelper } from '@/helper/TxHelper';
import { decimals, TX_TYPE } from '@/constant';
import Tools from '@/util/Tools';
import { converCoin, getMainToken } from '@/helper/IritaHelper';
import { getAmountByTx, getDenomMap, getDenomTheme } from '@/helper/txListAmoutHelper';
import prodConfig from '@/productionConfig';
import { getAddressTxList } from '@/service/api';
import TxTypes from '@/helper/TxTypes';
import TabsComponent from '@/components/common/TabsComponent';
import TxResetButtonComponent from '@/components/common/TxResetButtonComponent';
import TxStatusTabsComponents from '@/components/common/TxStatusTabsComponents';
import TxCountComponent from '@/components/TxCountComponent';
import AddressSendAndReceiveTx from '@/components/common/AddressSendAndReceiveTx';
import txCommonTable from '@/components/tableListColumnConfig/txCommonTable';
import SignerColunmn from '@/components/tableListColumnConfig/SignerColunmn';
import txCommonLatestTable from '@/components/tableListColumnConfig/txCommonLatestTable';
import { needAddColumn } from '@/components/tableListColumnConfig/allTxTableColumnConfig';

export default {
  name: 'TxsOptions',
  components: {
    AddressSendAndReceiveTx,
    TxCountComponent,
    TxStatusTabsComponents,
    TxResetButtonComponent,
    TabsComponent,
    ListComponent,
  },
  data() {
    return {
      isAddressTxLoading: false,
      mainTokenSymbol: '',
      transactionArray: [],
      txColumnList: [],
      pageSize: 5,
      totalTxNumber: 0,
      pageNum: 1,
      status: '',
      type: '',
      feeDecimals: decimals.fee,
      txTypeOption: [
        {
          value: '',
          label: this.$t('ExplorerLang.common.allTxType'),
        },
      ],
      txTypeArray: [''],
      statusOpt: [
        {
          value: '',
          label: this.$t('ExplorerLang.common.allTxStatus'),
        },
        {
          value: 1,
          label: this.$t('ExplorerLang.common.success'),
        },
        {
          value: 2,
          label: this.$t('ExplorerLang.common.failed'),
        },
      ],
      isShowSendAndReceiveTxComponent: false,
      isShowDenom: prodConfig.fee.isShowDenom,
      isShowFee: prodConfig.fee.isShowFee,
    };
  },
  created() {
    this.txColumnList = txCommonTable.concat(SignerColunmn, txCommonLatestTable);
    this.isShowSendAndReceiveTxComponent = prodConfig.isShowSendAndReceiveTxCount;
    this.getAllTxType();
    this.getTxByAddressCount();
    this.setMainToken();
  },
  mounted() {
    // 为展示loading 效果，故放在了 mounted 里面发起请求
    this.getTxByAddress();
  },
  methods: {
    async setMainToken() {
      const mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
    },
    async formatTxData(msgType) {
      this.transactionArray = [];
      try {
        if (this.txList && this.txList.length) {
          const fees = [];
          const amounts = [];
          for (const tx of this.txList) {
            let numberOfTo = '--';
            let numberOfToArr = [];
            let requestId = '--';
            let requestIdArr = [];
            let denomId = '--';
            let denomIdArr = [];
            let denomName = '--';
            let denomNameArr = [];
            let nftId = '--';
            let nftIdArr = [];
            let feedName = '--';
            let feedNameArr = [];
            let oracleCreator = '--';
            let oracleCreatorArr = [];
            let consumer = '--';
            let consumerArr = [];
            let digest = '--';
            let digestArr = [];
            let digest_algo = '--';
            let digest_algoArr = [];
            let symbol = '--';
            let symbolArr = [];
            let minUnit = '--';
            let minUnitArr = [];
            let owner = '--';
            let ownerArr = [];
            let dstOwner = '--';
            let dstOwnerArr = [];
            let srcOwner = '--';
            let srcOwnerArr = [];
            let sender = '--';
            let senderArr = [];
            let proposalId = '--';
            let proposalIdArr = [];
            let option = '--';
            let optionArr = [];
            let voter = '--';
            let voterArr = [];
            let depositor = '--';
            let depositorArr = [];
            let title = '--';
            let author = '--';
            let authorArr = [];
            let provider = '--';
            let providerArr = [];
            let requestContextId = '--';
            let requestContextIdArr = [];
            let serviceName = '--';

            let serviceNameArr = [];
            let clientId = '--';
            let clientIdArr = [];
            let portId = '--';
            let portIdArr = [];
            let channelId = '--';
            let channelIdArr = [];
            let connectionId = '--';
            let connectionIdArr = [];
            let receiver = '--';
            let receiverArr = [];
            const sameMsg = [];
            let sameMsgFromAddrArr = [];
            let sameMsgToAddrArr = [];
            let msg;
            // farm => stake unstake
            let poolId = '--';
            let poolIdArr = [];
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
            if (tx?.msgs?.length > 0) {
              tx.msgs.forEach((item) => {
                if (item.type === msgType) {
                  sameMsg.push(item);
                  msg = item;
                }
              });
            }

            /*
             * 处理单一类型多msg的情况
             * */
            if (sameMsg?.length > 1) {
              // 处理from 跟 to 的情况
              sameMsg.forEach((item) => {
                const addrObj = TxHelper.getFromAndToAddressFromMsg(item);
                if (addrObj?.from) {
                  sameMsgFromAddrArr.push(addrObj.from);
                }
                if (addrObj?.to) {
                  sameMsgToAddrArr.push(addrObj.to);
                }

                if (item?.type === TX_TYPE.multisend && item?.msg?.outputs?.length) {
                  numberOfToArr.push(item.msg.outputs.length);
                }
                if (item?.type === TX_TYPE.respond_service && item?.msg?.request_id) {
                  requestIdArr.push(item.msg.request_id);
                }
                if (
                  item?.type === TX_TYPE.burn_nft ||
                  item?.type === TX_TYPE.edit_nft ||
                  item?.type === TX_TYPE.mint_nft ||
                  (item?.type === TX_TYPE.transfer_nft && item?.msg?.denom && item?.msg?.id)
                ) {
                  denomIdArr.push(item.msg.denom);
                  nftIdArr.push(item.msg.id);
                }

                if (
                  item?.type === TX_TYPE.start_feed ||
                  item?.type === TX_TYPE.edit_feed ||
                  item?.type === TX_TYPE.pause_feed ||
                  (item?.type === TX_TYPE.create_feed && item?.msg?.feed_name && item?.msg?.creator)
                ) {
                  feedNameArr.push(item.msg.feed_name);
                  oracleCreatorArr.push(item.msg.creator);
                }

                if (item?.type === TX_TYPE.request_rand && item?.msg?.consumer) {
                  consumerArr.push(item.msg.consumer);
                }
                if (
                  item?.type === TX_TYPE.create_client ||
                  (item?.type === TX_TYPE.update_client && item?.msg?.client_id)
                ) {
                  clientIdArr.push(item.msg.client_id);
                }
                if (
                  item?.type === TX_TYPE.call_service ||
                  item?.type === TX_TYPE.respond_service ||
                  (item?.msg?.consumer && item?.msg?.request_context_id && item?.msg?.service_name)
                ) {
                  consumerArr.push(item.msg.consumer);
                  requestContextIdArr.push(item.msg.request_context_id);
                  serviceNameArr.push(item.msg.service_name);
                }
                if (
                  (item?.type === TX_TYPE.issue_denom && item?.msg?.id) ||
                  item?.msg?.name ||
                  item?.msg?.sender
                ) {
                  senderArr.push(item.msg.sender);
                  denomIdArr.push(item.msg.id);
                  denomNameArr.push(item.msg.name);
                }
                if (
                  item?.type === TX_TYPE.channel_open_init ||
                  item?.type === TX_TYPE.channel_open_confirm ||
                  item?.type === TX_TYPE.channel_open_try ||
                  (item?.type === TX_TYPE.channel_open_ack &&
                    item?.msg?.channel_id &&
                    item?.msg?.port_id)
                ) {
                  portIdArr.push(item.msg.port_id);
                  channelIdArr.push(item.msg.channel_id);
                }
                if (
                  item?.type === TX_TYPE.connection_open_init ||
                  item?.type === TX_TYPE.connection_open_confirm ||
                  item?.type === TX_TYPE.connection_open_try ||
                  (item?.type === TX_TYPE.connection_open_ack &&
                    item?.msg?.connection_id &&
                    item?.msg?.client_id)
                ) {
                  clientIdArr.push(item.msg.client_id);
                  connectionIdArr.push(item.msg.connection_id);
                }

                if (
                  item?.type === TX_TYPE.create_record &&
                  item?.msg?.contents?.length &&
                  item?.msg?.contents[0]?.digest &&
                  item?.msg?.contents[0]?.digest_algo
                ) {
                  digestArr.push(item.msg.contents[0].digest);
                  digest_algoArr.push(item.msg.contents[0].digest_algo);
                }
                if (
                  item?.type === TX_TYPE.issue_token &&
                  item?.msg?.symbol &&
                  item?.msg?.owner &&
                  item?.msg?.min_unit
                ) {
                  symbolArr.push(item.msg.symbol);
                  minUnitArr.push(item.msg.min_unit);
                  ownerArr.push(item.msg.owner);
                }
                if (
                  item?.type === TX_TYPE.acknowledge_packet &&
                  item?.msg?.packet?.data?.receiver
                ) {
                  receiverArr.push(item.msg.packet.data.receiver);
                }
                if (item?.type === TX_TYPE.edit_token && item?.msg?.symbol && item?.msg?.owner) {
                  symbolArr.push(item.msg.symbol);
                  ownerArr.push(item.msg.owner);
                }
                if (
                  item?.type === TX_TYPE.transfer_token_owner &&
                  item?.msg?.symbol &&
                  item?.msg?.dst_owner &&
                  item?.msg?.src_owner
                ) {
                  symbolArr.push(item.msg.symbol);
                  dstOwnerArr.push(item.msg.dst_owner);
                  srcOwnerArr.push(item.msg.src_owner);
                }
                if (
                  item?.type === TX_TYPE.mint_token &&
                  item?.msg?.owner &&
                  item?.msg?.symbol &&
                  item?.msg?.amount &&
                  item?.msg?.to
                ) {
                  symbolArr.push(item.msg.symbol);
                  ownerArr.push(item.msg.owner);
                }
                if (
                  item?.type === TX_TYPE.burn_token &&
                  item?.msg?.sender &&
                  item?.msg?.symbol &&
                  item?.msg?.amount
                ) {
                  symbolArr.push(item.msg.symbol);
                  senderArr.push(item.msg.sender);
                }
                if (
                  item?.type === TX_TYPE.vote &&
                  item?.msg?.option &&
                  item?.msg?.proposal_id &&
                  item?.msg?.voter
                ) {
                  proposalIdArr.push(item.msg.proposal_id);
                  optionArr.push(item.msg.option);
                  voterArr.push(item.msg.voter);
                }
                if (
                  item?.type === TX_TYPE.deposit &&
                  item?.msg?.depositor &&
                  item?.msg?.proposal_id
                ) {
                  proposalIdArr.push(item.msg.proposal_id);
                  depositorArr.push(item.msg.depositor);
                }
                if (item?.type === TX_TYPE.submit_proposal && item?.msg?.content?.title) {
                  title = item.msg.content.title;
                }
                if (
                  item?.type === TX_TYPE.pause_request_context ||
                  item?.type === TX_TYPE.start_request_context ||
                  item?.type === TX_TYPE.update_request_context ||
                  (item?.type === TX_TYPE.kill_request_context &&
                    item?.msg?.consumer &&
                    item?.msg?.request_context_id)
                ) {
                  consumerArr.push(item.msg.consumer);
                  requestContextIdArr.push(item.msg.request_context_id);
                }
                if (item?.type === TX_TYPE.define_service && item?.msg?.author && item?.msg?.name) {
                  authorArr.push(item.msg.author);
                  serviceNameArr.push(item.msg.service_name);
                }
                if (
                  item?.type === TX_TYPE.bind_service ||
                  item?.type === TX_TYPE.refund_service_deposit ||
                  item?.type === TX_TYPE.disable_service_binding ||
                  item?.type === TX_TYPE.enable_service_binding ||
                  (item?.type === TX_TYPE.update_service_binding &&
                    item?.msg?.owner &&
                    item?.msg?.provider &&
                    item?.msg?.service_name)
                ) {
                  ownerArr.push(item.msg.owner);
                  providerArr.push(item.msg.provider);
                  serviceNameArr.push(item.msg.service_name);
                }
                if (
                  item?.type === TX_TYPE.update_request_context &&
                  item?.msg?.ex &&
                  item?.msg?.ex?.service_name
                ) {
                  serviceNameArr.push(item.msg.service_name);
                }
                // farm -> stake
                if (item?.type === TX_TYPE.stake && item?.msg?.pool_id) {
                  poolIdArr.push(item.msg.pool_id);
                }
              });
              /*
               * 同一类型多msg 去重
               * */
              sameMsgFromAddrArr = Array.from(new Set(sameMsgFromAddrArr));
              sameMsgToAddrArr = Array.from(new Set(sameMsgToAddrArr));
              portIdArr = Array.from(new Set(portIdArr));
              channelIdArr = Array.from(new Set(channelIdArr));
              connectionIdArr = Array.from(new Set(connectionIdArr));
              receiverArr = Array.from(new Set(receiverArr));
              numberOfToArr = Array.from(new Set(numberOfToArr));
              requestIdArr = Array.from(new Set(requestIdArr));
              denomIdArr = Array.from(new Set(denomIdArr));
              nftIdArr = Array.from(new Set(nftIdArr));
              feedNameArr = Array.from(new Set(feedNameArr));
              clientIdArr = Array.from(new Set(clientIdArr));
              denomNameArr = Array.from(new Set(denomNameArr));
              oracleCreatorArr = Array.from(new Set(oracleCreatorArr));
              consumerArr = Array.from(new Set(consumerArr));
              digestArr = Array.from(new Set(digestArr));
              digest_algoArr = Array.from(new Set(digest_algoArr));
              symbolArr = Array.from(new Set(symbolArr));
              minUnitArr = Array.from(new Set(minUnitArr));
              ownerArr = Array.from(new Set(ownerArr));
              dstOwnerArr = Array.from(new Set(dstOwnerArr));
              srcOwnerArr = Array.from(new Set(srcOwnerArr));
              senderArr = Array.from(new Set(senderArr));
              proposalIdArr = Array.from(new Set(proposalIdArr));
              optionArr = Array.from(new Set(optionArr));
              voterArr = Array.from(new Set(voterArr));
              depositorArr = Array.from(new Set(depositorArr));
              authorArr = Array.from(new Set(authorArr));
              providerArr = Array.from(new Set(providerArr));
              requestContextIdArr = Array.from(new Set(requestContextIdArr));
              serviceNameArr = Array.from(new Set(serviceNameArr));
              poolIdArr = Array.from(new Set(poolIdArr));
            } else {
              if (msg?.type === TX_TYPE.multisend && msg?.msg?.outputs?.length) {
                numberOfTo = msg.msg.outputs.length;
              }
              if (msg?.type === TX_TYPE.respond_service && msg?.msg?.request_id) {
                requestId = msg.msg.request_id;
              }
              if (
                msg?.type === TX_TYPE.burn_nft ||
                msg?.type === TX_TYPE.edit_nft ||
                msg?.type === TX_TYPE.mint_nft ||
                (msg?.type === TX_TYPE.transfer_nft && msg?.msg?.denom && msg?.msg?.id)
              ) {
                denomId = msg.msg.denom;
                nftId = msg.msg.id;
              }
              if (
                msg?.type === TX_TYPE.start_feed ||
                msg?.type === TX_TYPE.edit_feed ||
                msg?.type === TX_TYPE.pause_feed ||
                (msg?.type === TX_TYPE.create_feed && msg?.msg?.feed_name && msg?.msg?.creator)
              ) {
                feedName = msg.msg.feed_name;
                oracleCreator = msg.msg.creator;
              }

              if (msg?.type === TX_TYPE.request_rand && msg?.msg?.consumer) {
                consumer = msg.msg.consumer;
              }
              if (
                msg?.type === TX_TYPE.create_client ||
                (msg?.type === TX_TYPE.update_client && msg?.msg?.client_id)
              ) {
                clientId = msg.msg.client_id;
              }
              if (
                msg?.type === TX_TYPE.call_service ||
                msg?.type === TX_TYPE.respond_service ||
                (msg?.msg?.consumer && msg?.msg?.request_context_id && msg?.msg?.service_name)
              ) {
                consumer = msg.msg.consumer;
                requestContextId = msg.msg.request_context_id;
                serviceName = msg.msg.service_name;
              }
              if (
                (msg?.type === TX_TYPE.issue_denom && msg?.msg?.id) ||
                msg?.msg?.name ||
                msg?.msg?.sender
              ) {
                sender = msg.msg.sender;
                denomId = msg.msg.id;
                denomName = msg.msg.name;
              }
              if (
                msg?.type === TX_TYPE.channel_open_init ||
                msg?.type === TX_TYPE.channel_open_confirm ||
                msg?.type === TX_TYPE.channel_open_try ||
                (msg?.type === TX_TYPE.channel_open_ack &&
                  msg?.msg?.channel_id &&
                  msg?.msg?.port_id)
              ) {
                portId = msg.msg.port_id;
                channelId = msg.msg.channel_id;
              }
              if (
                msg?.type === TX_TYPE.connection_open_init ||
                msg?.type === TX_TYPE.connection_open_confirm ||
                msg?.type === TX_TYPE.connection_open_try ||
                (msg?.type === TX_TYPE.connection_open_ack &&
                  msg?.msg?.connection_id &&
                  msg?.msg?.client_id)
              ) {
                clientId = msg.msg.client_id;
                connectionId = msg.msg.connection_id;
              }

              if (
                msg?.type === TX_TYPE.create_record &&
                msg?.msg?.contents?.length &&
                msg?.msg?.contents[0]?.digest &&
                msg?.msg?.contents[0]?.digest_algo
              ) {
                digest = msg.msg.contents[0].digest;
                digest_algo = msg.msg.contents[0].digest_algo;
              }
              if (
                msg?.type === TX_TYPE.issue_token &&
                msg?.msg?.symbol &&
                msg?.msg?.owner &&
                msg?.msg?.min_unit
              ) {
                symbol = msg.msg.symbol;
                minUnit = msg.msg.min_unit;
                owner = msg.msg.owner;
              }
              if (msg?.type === TX_TYPE.acknowledge_packet && msg?.msg?.packet?.data?.receiver) {
                receiver = msg.msg.packet.data.receiver;
              }
              if (msg?.type === TX_TYPE.edit_token && msg?.msg?.symbol && msg?.msg?.owner) {
                symbol = msg.msg.symbol;
                owner = msg.msg.owner;
              }
              if (
                msg?.type === TX_TYPE.transfer_token_owner &&
                msg?.msg?.symbol &&
                msg?.msg?.dst_owner &&
                msg?.msg?.src_owner
              ) {
                symbol = msg.msg.symbol;
                dstOwner = msg.msg.dst_owner;
                srcOwner = msg.msg.src_owner;
              }
              if (
                msg?.type === TX_TYPE.mint_token &&
                msg?.msg?.owner &&
                msg?.msg?.symbol &&
                msg?.msg?.amount &&
                msg?.msg?.to
              ) {
                symbol = msg.msg.symbol;
                owner = msg.msg.owner;
              }
              if (
                msg?.type === TX_TYPE.burn_token &&
                msg?.msg?.sender &&
                msg?.msg?.symbol &&
                msg?.msg?.amount
              ) {
                symbol = msg.msg.symbol;
                sender = msg.msg.sender;
              }
              if (
                msg?.type === TX_TYPE.vote &&
                msg?.msg?.option &&
                msg?.msg?.proposal_id &&
                msg?.msg?.voter
              ) {
                proposalId = msg.msg.proposal_id;
                option = msg.msg.option;
                voter = msg.msg.voter;
              }
              if (msg?.type === TX_TYPE.deposit && msg?.msg?.depositor && msg?.msg?.proposal_id) {
                proposalId = msg.msg.proposal_id;
                depositor = msg.msg.depositor;
              }
              if (msg?.type === TX_TYPE.submit_proposal && msg?.msg?.content?.title) {
                title = msg.msg.content.title;
              }
              if (
                msg?.type === TX_TYPE.pause_request_context ||
                msg?.type === TX_TYPE.start_request_context ||
                msg?.type === TX_TYPE.update_request_context ||
                (msg?.type === TX_TYPE.kill_request_context &&
                  msg?.msg?.consumer &&
                  msg?.msg?.request_context_id)
              ) {
                consumer = msg.msg.consumer;
                requestContextId = msg.msg.request_context_id;
              }
              if (msg?.type === TX_TYPE.define_service && msg?.msg?.author && msg?.msg?.name) {
                author = msg.msg.author;
                serviceName = msg.msg.name;
              }
              if (
                msg?.type === TX_TYPE.bind_service ||
                msg?.type === TX_TYPE.refund_service_deposit ||
                msg?.type === TX_TYPE.disable_service_binding ||
                msg?.type === TX_TYPE.enable_service_binding ||
                (msg?.type === TX_TYPE.update_service_binding &&
                  msg?.msg?.owner &&
                  msg?.msg?.provider &&
                  msg?.msg?.service_name)
              ) {
                owner = msg.msg.owner;
                provider = msg.msg.provider;
                serviceName = msg.msg.service_name;
              }
              if (
                msg?.type === TX_TYPE.update_request_context &&
                msg?.msg?.ex &&
                msg?.msg?.ex?.service_name
              ) {
                serviceName = msg.msg.ex.service_name;
              }
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
                  : this.getAmountUnit(res?.denom.toLocaleUpperCase());
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
                  : this.getAmountUnit(res?.denom.toLocaleUpperCase());
                totalReward1NativeDenom = msg?.msg?.total_reward?.[0].denom.toLocaleUpperCase();
              }
              if (len === 2) {
                const res = await converCoin(msg?.msg?.total_reward?.[1]);
                totalReward2 = Tools.toDecimal(res.amount, 2);
                totalReward2Denom = res?.denom.startsWith('lpt')
                  ? res?.denom.toLocaleUpperCase()
                  : this.getAmountUnit(res?.denom.toLocaleUpperCase());
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
                  : this.getAmountUnit(res?.denom.toLocaleUpperCase());
                farmAmountNativeDenom = msg?.msg?.initial_deposit?.[0].denom.toLocaleUpperCase();
              }
            }
            // farm => destroy_pool
            if (msg?.type === TX_TYPE.destroy_pool || msg?.type === TX_TYPE.adjust_pool) {
              poolId = Tools.formatPoolId(msg?.msg?.pool_id);
              poolCreator = msg.msg.creator;
            }

            const addrObj = TxHelper.getFromAndToAddressFromMsg(msg);
            amounts.push(msg ? (sameMsg?.length > 1 ? ' ' : await getAmountByTx(msg, true)) : '--');
            const from =
              sameMsg?.length > 1
                ? sameMsgFromAddrArr?.length > 1
                  ? ' '
                  : sameMsgFromAddrArr?.length === 1
                  ? sameMsgFromAddrArr[0]
                  : '--'
                : addrObj.from || '--';
            const to =
              sameMsg?.length > 1
                ? sameMsgToAddrArr?.length > 1
                  ? ' '
                  : sameMsgToAddrArr?.length === 1
                  ? sameMsgToAddrArr[0]
                  : '--'
                : addrObj.to || '--';
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
            if (this.isShowFee) {
              fees.push(
                tx.fee && tx.fee.amount && tx.fee.amount.length > 0
                  ? await converCoin(tx.fee.amount[0])
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
              if (denom !== undefined && /(lpt|lpt-|LPT|LPT-)/g.test(denom)) {
                isShowMore = true;
              }
            }
            const _contractMethod =
              (this?.$i18n?.messages &&
                this?.$i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract &&
                this?.$i18n?.messages &&
                this?.$i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract[
                  tx?.msgs[0]?.msg?.ex?.ddc_method
                ]) ||
              tx?.msgs[0]?.msg?.ex?.ddc_method;
            this.transactionArray.push({
              txHash: tx.tx_hash,
              blockHeight: tx.height,
              txType: tx.msgs ? (tx.msgs || []).map((item) => item.type) : tx.type,
              from,
              author: authorArr?.length > 1 ? ' ' : authorArr?.length === 1 ? authorArr[0] : author,
              provider:
                providerArr?.length > 1
                  ? ' '
                  : providerArr?.length === 1
                  ? providerArr[0]
                  : provider,
              requestContextId:
                requestContextIdArr?.length > 1
                  ? ' '
                  : requestContextIdArr?.length === 1
                  ? requestContextIdArr[0]
                  : requestContextId,
              fromMonikers,
              toMonikers,
              receiver:
                receiverArr?.length > 1
                  ? ' '
                  : receiverArr?.length === 1
                  ? receiverArr[0]
                  : receiver,
              to,
              portId: portIdArr?.length > 1 ? ' ' : portIdArr?.length === 1 ? portIdArr[0] : portId,
              channelId:
                channelIdArr?.length > 1
                  ? ' '
                  : channelIdArr?.length === 1
                  ? channelIdArr[0]
                  : channelId,
              connectionId:
                connectionIdArr?.length > 1
                  ? ' '
                  : connectionIdArr?.length === 1
                  ? connectionIdArr[0]
                  : connectionId,
              validatorMoniker,
              validatorAddress,
              numberOfTo:
                numberOfToArr?.length > 1
                  ? ' '
                  : numberOfToArr?.length === 1
                  ? numberOfToArr[0]
                  : numberOfTo,
              requestId:
                requestIdArr?.length > 1
                  ? ' '
                  : requestIdArr?.length === 1
                  ? requestIdArr[0]
                  : requestId,
              denomId:
                denomIdArr?.length > 1 ? ' ' : denomIdArr?.length === 1 ? denomIdArr[0] : denomId,
              denomName:
                denomNameArr?.length > 1
                  ? ' '
                  : denomNameArr?.length === 1
                  ? denomNameArr[0]
                  : denomName,
              nftId: nftIdArr?.length > 1 ? ' ' : nftIdArr?.length === 1 ? nftIdArr[0] : nftId,
              clientId:
                clientIdArr?.length > 1
                  ? ' '
                  : clientIdArr?.length === 1
                  ? clientIdArr[0]
                  : clientId,
              feedName:
                feedNameArr?.length > 1
                  ? ' '
                  : feedNameArr?.length === 1
                  ? feedNameArr[0]
                  : feedName,
              oracleCreator:
                oracleCreatorArr?.length > 1
                  ? ' '
                  : oracleCreatorArr?.length === 1
                  ? oracleCreatorArr[0]
                  : oracleCreator,
              consumer:
                consumerArr?.length > 1
                  ? ' '
                  : consumerArr?.length === 1
                  ? consumerArr[0]
                  : consumer,
              serviceName:
                serviceNameArr?.length > 1
                  ? ' '
                  : serviceNameArr?.length === 1
                  ? serviceNameArr[0]
                  : serviceName,
              digest: digestArr?.length > 1 ? ' ' : digestArr?.length === 1 ? digestArr[0] : digest,
              digest_algo:
                digest_algoArr?.length > 1
                  ? ' '
                  : digest_algoArr?.length === 1
                  ? digest_algoArr[0]
                  : digest_algo,
              symbol: symbolArr?.length > 1 ? ' ' : symbolArr?.length === 1 ? symbolArr[0] : symbol,
              minUnit:
                minUnitArr?.length > 1 ? ' ' : minUnitArr?.length === 1 ? minUnitArr[0] : minUnit,
              owner: ownerArr?.length > 1 ? ' ' : ownerArr?.length === 1 ? ownerArr[0] : owner,
              dstOwner:
                dstOwnerArr?.length > 1
                  ? ' '
                  : dstOwnerArr?.length === 1
                  ? dstOwnerArr[0]
                  : dstOwner,
              srcOwner:
                srcOwnerArr?.length > 1
                  ? ' '
                  : srcOwnerArr?.length === 1
                  ? srcOwnerArr[0]
                  : srcOwner,
              sender: senderArr?.length > 1 ? ' ' : senderArr?.length === 1 ? senderArr[0] : sender,
              proposalId:
                proposalIdArr?.length > 1
                  ? ' '
                  : proposalIdArr?.length === 1
                  ? proposalIdArr[0]
                  : proposalId,
              option: optionArr?.length > 1 ? ' ' : optionArr?.length === 1 ? optionArr[0] : option,
              voter: voterArr?.length > 1 ? ' ' : voterArr?.length === 1 ? voterArr[0] : voter,
              depositor:
                depositorArr?.length > 1
                  ? ' '
                  : depositorArr?.length === 1
                  ? depositorArr[0]
                  : depositor,
              title,
              signer:
                tx.signers?.length > 1 ? ' ' : tx.signers?.length === 1 ? tx.signers[0] : '--',
              status: tx.status,
              msgCount: tx?.msgs?.length,
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
                this.$t('ExplorerLang.table.suffix')
              ),
              isShowMore,
              denomTheme: {
                denomColor: '',
                tooltipContent: '',
              },
              // farm stake/unstake/harvest
              poolId:
                poolIdArr?.length > 1
                  ? ' '
                  : poolIdArr?.length === 1
                  ? Tools.formatPoolId(poolIdArr[0])
                  : poolId,
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
            });
            /**
             * @description: from parseTimeMixin
             */
            this.parseTime('transactionArray', 'Time', 'ageTime');
          }
          if (fees && fees.length > 0 && this.isShowFee) {
            const fee = await Promise.all(fees);
            this.transactionArray.forEach((item, index) => {
              // this.transactionArray[index].Tx_Fee = fee[index] && fee[index].amount ?  this.isShowDenom ? `${Tools.toDecimal(fee[index].amount,this.feeDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : '--';
              // remove denom
              this.transactionArray[index].Tx_Fee =
                fee[index] && fee[index].amount
                  ? this.isShowDenom
                    ? `${Tools.toDecimal(fee[index].amount, this.feeDecimals)}`
                    : `${Tools.toDecimal(fee[index].amount, this.feeDecimals)}`
                  : '--';
            });
          }
          console.log(this.transactionArray, '这个数据又是啥');
          if (amounts && amounts.length > 0) {
            const amount = await Promise.all(amounts);
            this.denomMap = await getDenomMap();
            this.transactionArray.forEach((item, index) => {
              if (amount[index]?.length === 2) {
                /**
                 * 取 % 后面拼接的原始denom, 用来匹配theme
                 */
                const result1 = amount[index][0].split('%');
                const result2 = amount[index][1].split('%');
                this.transactionArray[index].swapDenomTheme1 = getDenomTheme(
                  result1[1],
                  this.denomMap
                );
                this.transactionArray[index].swapDenomTheme2 = getDenomTheme(
                  result2[1],
                  this.denomMap
                );
                this.transactionArray[index].swapAmount1 = this.getAmount(result1[0]);
                this.transactionArray[index].swapAmount1Denom = this.getAmountUnit(result1[0]);
                this.transactionArray[index].swapAmount2 = this.getAmount(result2[0]);
                this.transactionArray[index].swapAmount2Denom = this.getAmountUnit(result2[0]);
              } else {
                /**
                 * 取 % 后面拼接的原始denom, 用来匹配theme
                 */
                const result = amount[index].split('%');
                this.transactionArray[index].denomTheme = getDenomTheme(result[1], this.denomMap);
                this.transactionArray[index].amount = this.getAmount(result[0]);
                this.transactionArray[index].denom = this.getAmountUnit(result[0]);
                const denom = /[A-Za-z\-]{2,15}/.exec(amount[index])?.length
                  ? /[A-Za-z\-]{2,15}/.exec(amount[index])[0]
                  : ' ';
                if (denom !== undefined && /(lpt|LPT|lpt-|LPT-)/g.test(denom)) {
                  this.transactionArray[index].amount = '';
                }
              }
              /**
               * 目标：给farm下的farmAmount totalReward1 totalReward2 initialDeposit上色
               * 方法：借助了farmAmountNativeDenom 用于保存原始denom,不使用转换后的symbol, totalReward同理
               * farmAmount initalDeposit 都是用dnomeTheme
               */
              if (this.transactionArray[index].farmAmountDenom) {
                this.transactionArray[index].denomTheme = getDenomTheme(
                  this.transactionArray[index].farmAmountNativeDenom,
                  this.denomMap
                );
              } else if (this.transactionArray[index].totalReward1Denom) {
                this.transactionArray[index].swapDenomTheme1 = getDenomTheme(
                  this.transactionArray[index].totalReward1NativeDenom,
                  this.denomMap
                );
                this.transactionArray[index].swapDenomTheme2 = getDenomTheme(
                  this.transactionArray[index].totalReward2NativeDenom,
                  this.denomMap
                );
              }
            });
          }
          /* this.$nextTick(() => {
						setTimeout(() => {
							this.colWidthList = this.$adjustColumnWidth(this.$refs['listTable'].$el);
							this.loading = false;
						});
					}); */
        }
        this.isAddressTxLoading = false;
      } catch (error) {
        this.isAddressTxLoading = false;
        console.log(error);
      }
    },
    async getTxByAddressCount() {
      try {
        const res = await getAddressTxList(
          this.$route.params.param,
          this.type,
          this.status,
          null,
          null,
          true
        );
        if (res?.count) {
          this.totalTxNumber = res.count;
        } else {
          this.totalTxNumber = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getTxByAddress() {
      this.isAddressTxLoading = true;
      try {
        const res = await getAddressTxList(
          this.$route.params.param,
          this.type,
          this.status,
          this.pageNum,
          this.pageSize,
          false
        );
        if (res?.data && res.data.length > 0) {
          this.txList = res.data;
        } else {
          this.txList = [];
        }
        this.formatTxData(this.type);
      } catch (e) {
        this.txList = [];
        this.formatTxData(this.type);
        console.error(e);

        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getAllTxType() {
      try {
        const res = await TxTypes.getData();
        this.txTypeOption = TxHelper.formatTxType(res.data);
        // const res = await getAllTxTypes();
        // this.txTypeOption = TxHelper.formatTxType(res.data);
        // this.txTypeOption = res?.txTypeDataOptions
        this.txTypeOption.unshift({
          value: '',
          label: this.$t('ExplorerLang.common.allTxType'),
          slot: 'allTxType',
        });
      } catch (e) {
        console.error(e);
      }
    },
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getTxByAddress();
      this.type
        ? (this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, this.type))
        : (this.txTypeArray = ['']);
      this.status_temp = this.status;
      this.type_temp = this.type;
    },
    getFilterTxs(param) {
      if (param?.value) {
        this.type = param.value;
      } else if (param?.value === '') {
        // 处理点击all的情况
        this.type = '';
      } else if (Array.isArray(param)) {
        const notAllMsgType = param.filter((item) => {
          return item.label !== 'secondaryAll';
        });
        const currentSelectSecondMsgTypes = notAllMsgType.map((item) => {
          return item.value;
        });

        if (currentSelectSecondMsgTypes?.length) {
          this.type = currentSelectSecondMsgTypes.join(',');
        }
      }
      this.txColumnList = txCommonTable.concat(SignerColunmn, txCommonLatestTable);
      if (this.type && needAddColumn[this.type]) {
        this.txColumnList = txCommonTable.concat(needAddColumn[this.type], txCommonLatestTable);
      }
      this.totalTxNumber = 0;
      this.pageNum = 1;
      this.getTxByAddressCount();
      this.getTxByAddress();
    },
    resetFilterCondition() {
      this.type_temp = '';
      this.status_temp = '';
      this.type = '';
      this.status = '';
      this.pageNum = 1;
      this.getTxByAddressCount();
      this.getTxByAddress();
      this.txTypeArray = [''];
      this.$store.commit('currentTxModelIndex', 0);
      sessionStorage.setItem('lastChoiceMsgModelIndex', 0);
      sessionStorage.setItem('txTimeRange', []);
      sessionStorage.removeItem('currentChoiceMsgType');
      this.$refs.statusDatePicker.resetParams(); // 新增
      this.txColumnList = txCommonTable.concat(SignerColunmn, txCommonLatestTable);
    },
    changeTxStatus(status) {
      this.status = status;
      if (!status) {
        this.status = '';
      }
      this.getTxByAddressCount();
      this.getTxByAddress();
    },
    changeTime() {},
    parseTime(txListKeys, key, parsedKey) {
      if (!txListKeys) {
        return;
      }

      !this.txListTimer &&
        (this.txListTimer = setInterval(() => {
          Array.isArray(txListKeys)
            ? txListKeys.forEach((txListKey) => {
                this[txListKey].forEach((item) => {
                  item[parsedKey] = Tools.formatAge(
                    Tools.getTimestamp(),
                    item[key] * 1000,
                    this.$t('ExplorerLang.table.suffix')
                  );
                });
              })
            : this[txListKeys].forEach((item) => {
                item[parsedKey] = Tools.formatAge(
                  Tools.getTimestamp(),
                  item[key] * 1000,
                  this.$t('ExplorerLang.table.suffix')
                );
              });
        }, 1000));
    },
    getAmount(amount) {
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
    },
    getAmountUnit(amount) {
      if (!amount) {
        return '';
      }
      const amountRule = /^[0-9]+.?[0-9]*$/;
      if (amountRule.test(amount)) {
        return ' ';
      }
      const denomRule = /[A-Za-z\/]+/;
      const result = amount.match(denomRule);
      return result ? result[0] : ' ';
    },
  },
};
</script>

<style scoped></style>
