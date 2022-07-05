<template>
  <div class="tx_detail_container">
    <div class="tx_detail_content_wrap">
      <div class="tx_detail_content">
        <!-- 标题 -->
        <div class="tx_detail_title">
          <div class="tx_detail_title_first">
            {{ `${$t('ExplorerLang.transactionInformation.transactionInformation')} |` }}
          </div>
          <div class="tx_detail_title_hash">
            {{ txHash }}
            <MClip style="margin-left: 0.01rem" :text="txHash"></MClip>
          </div>
        </div>
        <div class="tx_information_content">
          <p class="tx_information_list_title">
            {{ $t('ExplorerLang.transactionInformation.baseInfo') }}
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.blockHeight') }}：</span>
            <span
              ><router-link :to="`/block/${blockHeight}`">{{ blockHeight }}</router-link></span
            >
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.status') }}：</span>
            <span :style="{ color: status === $t('ExplorerLang.common.failed') ? '#fa8593' : '' }">
              {{ status }}
              <el-tooltip
                popper-class="tooltip"
                placement="top"
                v-if="status === $t('ExplorerLang.common.failed')"
              >
                <div slot="content">
                  {{ log }}
                </div>
                <i class="iconfont iconyiwen"></i>
              </el-tooltip>
            </span>
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.timestamp') }}：</span>
            <span>{{ timestamp }}</span>
          </p>

          <p class="tx_information_list_item" v-if="isShowFee">
            <span>
              {{
                productNameWC === productName
                  ? $t('ExplorerLang.table.energy')
                  : $t('ExplorerLang.transactionInformation.fee')
              }}：</span
            >
            <span>{{ fee }}</span>
          </p>
          <!-- <p class="tx_information_list_item" v-if="isShowFee">
					  <span>{{ $t('ExplorerLang.transactionInformation.gasUsed') }}：</span>
					  <span>{{ gasUsed }}</span>
					</p> -->

          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.signer') }}：</span>
            <span style="word-break: break-all">
              <!--					<p style="margin-bottom: 0.05rem" v-for="item in signer" :key= "item" class="address_link" @click="addressRoute(item)">{{ item }}</p>-->
              <router-link
                style="margin-bottom: 0.05rem"
                v-for="item in signer"
                :key="item"
                class="address_link"
                :to="`/address/${item}`"
                >{{ item }}</router-link
              >
            </span>
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.memo') }}：</span>
            <span style="word-break: break-all">{{ memo }}</span>
          </p>
        </div>
        <!-- 交易消息 -->
        <div class="tx_information_tx_message_content" v-if="messages.length !== 0">
          <div class="tx_information_tx_content">
            <div class="tx_information_tx_message_title">
              {{ $t('ExplorerLang.transactionInformation.transactionMessageTitle') }}
            </div>
            <div v-for="(item, index) in messages" :key="index">
              <TxMessage
                :msg="item"
                :msgIndex="index"
                :eventsNew="eventsNew"
                :monikers="monikers"
                :ddcSigner="signer"
              />
              <div
                class="tx_information_tx_message_line"
                v-if="messages.length > 1 && index != messages.length - 1"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { converCoin, addressRoute } from '@/helper/IritaHelper';
import Tools from '../util/Tools';
import MPagination from './common/MPagination';
import MClip from './common/MClip.vue';
import TxMessage from './common/TxMessage.vue';
import { getTxDetail, getRelevanceTxList } from '../service/api';
import { TX_TYPE, TX_STATUS, ColumnMinWidth, PRODUCT_WENCHANG } from '../constant';
import { moduleSupport } from '../helper/ModulesHelper';
import slef_axios from '../axios';
import prodConfig from '../productionConfig';

export default {
  name: 'TxDetail',
  components: { MPagination, MClip, TxMessage },
  data() {
    return {
      isShowFee: prodConfig.fee.isShowFee,
      isShowDenom: prodConfig.fee.isShowDenom,
      productName: prodConfig.product,
      productNameWC: PRODUCT_WENCHANG,
      Tools,
      moduleSupport,
      addressRoute,
      TX_TYPE,
      TX_STATUS,
      ColumnMinWidth,
      txHash: '',
      blockHeight: '',
      status: '',
      timestamp: '',
      signer: [],
      memo: '',
      txType: '',
      requestContextId: '',
      relevanceTxs: [],
      txCount: 0,
      pageNum: 1,
      pageSize: 10,
      messages: [],
      eventsNew: [],
      txHashValue: '',
      blockValue: '',
      timestampValue: '',
      feeValue: '',
      gasUsedValue: '',
      signerValue: '',
      memoValue: '',
      messageList: null,
      fromMoniker: '',
      toMoniker: '',
      log: '',
      gasPrice: '',
      gasLimit: '',
      gasUsed: '',
      gasWanted: '',
      logContentWidth: '',
      gasContentWidth: '',
      rateContentWidth: '',
      flShowRateToolTip: false,
      isProfiler: false,
      failTipStyle: false,
      fee: '',
      monikers: [],
      timeData: 0,
      timestampTimer: null,
    };
  },
  mounted() {
    this.getTransactionInformation();
    this.timestampTimer = setInterval(() => {
      if (this.timeData) {
        this.timestamp = this.formatTimestampAndAge(this.timeData);
      }
    }, 1000);
    this.iosOnpageshow();
  },
  watch: {
    gasPrice() {
      this.$nextTick(() => {
        this.gasContentWidth =
          document.getElementsByClassName('gas_tip_content_wrap')[0].clientWidth;
      });
    },
    messageList() {
      if (this.flShowRateToolTip) {
        this.$nextTick(() => {
          this.rateContentWidth = document.getElementsByClassName(
            'commission_rate_content_wrap'
          )[0].clientWidth;
        });
      }
    },
  },
  methods: {
    iosOnpageshow() {
      const broswerRule = /^.*((iPhone)|(iPad)|(Safari))+.*$/;
      if (broswerRule.test(navigator.userAgent)) {
        window.addEventListener('pageshow', this.bindPageshow, false);
      }
    },
    bindPageshow(e) {
      if (e.persisted || (window.performance && window.performance.navigation.type == 2)) {
        window.location.reload();
      }
    },
    async getTransactionInformation() {
      try {
        const res = await getTxDetail(this.$route.query.txHash);
        if (res) {
          this.monikers = res.monikers;
          this.messages = res.msgs || [];
          this.eventsNew = res.events_new;
          this.txHash = res.tx_hash || '--';
          this.blockHeight = res.height || '--';
          // console.log(res.status === TX_STATUS.success ? this.$t("ExplorerLang.common.success"): this.$t("ExplorerLang.common.failed"),'展示的信息是什么')

          if (res.status || res.status === 0) {
            this.status =
              res.status === TX_STATUS.success
                ? this.$t('ExplorerLang.common.success')
                : this.$t('ExplorerLang.common.failed');
          } else {
            this.status = '--';
          }
          // this.status = res.status === TX_STATUS.success ?"Failed":"Failed"
          this.log = res.log || '--';
          if (res.time) {
            this.timeData = res.time;
            this.timestamp = this.formatTimestampAndAge(res.time);
          } else {
            this.timestamp = '--';
          }
          if (res.fee && res.fee.amount && res.fee.amount[0] && this.isShowFee) {
            const fee = await converCoin(res.fee.amount[0]);
            this.fee = this.isShowDenom ? `${fee.amount} ${fee.denom.toUpperCase()}` : fee.amount;
          }
          this.fee = this.fee || '--';
          // this.gasUsed=res.fee.gas || '--'
          // this.signer = res.signers && res.signers[0] || '--'
          if (res.signers && res.signers.length > 0) {
            this.signer = res.signers;
          }
          this.memo = res.memo ? res.memo : '--';
          this.txType = (res.msgs && res.msgs[0] && res.msgs[0].type) || '--';
          switch (this.txType) {
            case TX_TYPE.transfer_denom:
              break;
            case TX_TYPE.tibc_update_client:
              break;
            case TX_TYPE.recv_clean_packet:
              break;
            case TX_TYPE.clean_packet:
              break;
            case TX_TYPE.tibc_acknowledge_packet:
              break;
            case TX_TYPE.tibc_recv_packet:
              break;
            case TX_TYPE.tibc_nft_transfer:
              break;
            case TX_TYPE.mint_nft:
              break;
            case TX_TYPE.burn_nft:
              break;
            case TX_TYPE.create_record:
              break;
            case TX_TYPE.define_service:
              break;
            case TX_TYPE.bind_service:
              break;
            case TX_TYPE.send:
              break;
            case TX_TYPE.call_service:
              res.events.forEach((item) => {
                (item.attributes || []).forEach((attr) => {
                  if (attr.key == 'request_context_id') {
                    this.requestContextId = attr.value || '--';
                  }
                });
              });
              break;
            case TX_TYPE.transfer_nft:
              break;
            case TX_TYPE.edit_nft:
              break;
            case TX_TYPE.issue_denom:
              break;
            case TX_TYPE.respond_service:
              this.requestContextId = (res.msgs[0].msg.ex || {}).request_context_id || '--';
              break;
            case TX_TYPE.pause_request_context:
              break;
            case TX_TYPE.start_request_context:
              break;
            case TX_TYPE.kill_request_context:
              break;
            case TX_TYPE.update_request_context:
              break;
            case TX_TYPE.update_service_binding:
              break;
            case TX_TYPE.disable_service_binding:
              break;
            case TX_TYPE.enable_service_binding:
              break;
            case TX_TYPE.refund_service_deposit:
              break;
            case TX_TYPE.recv_packet:
              break;
          }
          await this.relevanceTxListCount();
          this.relevanceTxList();
        }
      } catch (e) {
        console.log(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    formatTimestampAndAge(second) {
      const timestamp = Tools.formatLocalTime(second);
      const age = Tools.formatAge(Tools.getTimestamp(), second * 1000, 'ago', '>');
      return `${timestamp}  (${age})`;
    },
    pageChange(pageNum) {
      if (this.pageNum === pageNum) return;
      this.pageNum = pageNum;
      this.relevanceTxList();
    },
    async relevanceTxList() {
      let type = '';
      switch (this.txType) {
        case TX_TYPE.call_service:
          type = TX_TYPE.respond_service;
          break;
        case TX_TYPE.respond_service:
          type = TX_TYPE.call_service;
          break;
      }
      if (type && type.length && this.requestContextId && this.requestContextId.length) {
        try {
          const res = await getRelevanceTxList(
            type,
            this.requestContextId,
            this.pageNum,
            this.pageSize,
            false
          );
          if (res) {
            this.relevanceTxs = res.data.map((tx) => {
              const result = {
                status: tx.status,
                txHash: tx.tx_hash,
                txType: tx.type,
                blockHeight: tx.height,
                time: Tools.formatLocalTime(tx.time),
              };
              switch (tx.type) {
                case TX_TYPE.call_service:
                  result.provider = tx.msgs[0].msg.providers;
                  tx.events.forEach((item) => {
                    (item.attributes || []).forEach((attr) => {
                      if (attr.key == 'request_context_id') {
                        result.requestContextId = attr.value;
                      }
                    });
                  });
                  break;
                case TX_TYPE.respond_service:
                  result.provider = tx.msgs[0].msg.provider;
                  result.requestId = tx.msgs[0].msg.request_id;
                  break;
              }
              return result;
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async relevanceTxListCount() {
      let type = '';
      switch (this.txType) {
        case TX_TYPE.call_service:
          type = TX_TYPE.respond_service;
          break;
        case TX_TYPE.respond_service:
          type = TX_TYPE.call_service;
          break;
      }
      if (type && type.length && this.requestContextId && this.requestContextId.length) {
        try {
          const res = await getRelevanceTxList(type, this.requestContextId, null, null, true);
          if (res?.count) {
            this.txCount = res.count;
          } else {
            this.txCount = 0;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address);
    },
    getCallProviders(providers) {
      if (providers && providers.length > 2) {
        return providers.slice(0, 2);
      }
      return providers;
    },
    openUrl(url) {
      url = url.trim();
      if (url) {
        if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
          url = `http://${url}`;
        }
        window.open(url);
      }
    },
    getKeyBaseName(identity) {
      if (identity !== '--') {
        const url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
        if (identity) {
          slef_axios.http(url).then((res) => {
            if (res.them && res.them[0].basics.username) {
              window.open(`https://keybase.io/${res.them[0].basics.username}`);
            }
          });
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timestampTimer);
    window.removeEventListener('pageshow', this.bindPageshow, false);
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.tx_detail_container {
  padding: 0 0.15rem;
  .tx_detail_content_wrap {
    max-width: 12rem;
    margin: 0 auto;
    .tx_detail_content {
      .tx_detail_title {
        display: flex;
        justify-content: flex-start;
        color: $t_first_c;
        font-size: $s18;
        line-height: 0.21rem;
        margin: 0.3rem 0 0.15rem 0rem;
        text-align: left;
        font-family: PublicSans;
        font-weight: 600;
        .tx_detail_title_first {
          white-space: nowrap;
          margin-right: 0.05rem;
        }
        .tx_detail_title_hash {
          font-size: $s14;
          font-family: PublicSans;
          font-weight: 400;
          color: $t_first_c;
          line-height: 0.2rem;
          word-break: break-all;
          margin-right: 0.05rem;
        }
      }
      .tx_information_content {
        box-sizing: border-box;
        padding: 0.25rem;
        background: $bg_white_c;
        text-align: left;
        border-radius: 0.05rem;
        // border: 1px solid $bd_first_c;
        .tx_information_list_title {
          font-size: $s16;
          font-family: Arial;
          font-weight: 600;
          color: $t_first_c;
          line-height: 22px;
          margin-bottom: 0.36rem;
        }
        .tx_information_list_item {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 0.26rem;
          span:nth-of-type(1) {
            margin-right: 0.15rem;
            text-align: left;
            // min-width: 1.5rem;
            min-width: 1.64rem;
            color: $t_second_c;
            font-size: $s14;
            line-height: 0.16rem;
            font-weight: 600;
          }
          span:nth-of-type(2) {
            text-align: left;
            color: $t_first_c;
            font-size: $s14;
            line-height: 0.16rem;
          }
        }
        .tx_information_list_item:last-child {
          margin-bottom: 0;
        }
      }
      .tx_information_tx_message_content {
        margin: 0.48rem 0 0.1rem 0;
        .tx_information_tx_content {
          box-sizing: border-box;
          padding: 0.25rem;
          background: $bg_white_c;
          border-radius: 0.05rem;
          // border: 1px solid $bd_first_c;
          .tx_information_tx_message_title {
            text-align: left;
            font-size: $s16;
            font-weight: bold;
            font-weight: 600;
          }
          .tx_information_tx_message_line {
            height: 0.01rem;
            background: $bd_first_c;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 865px) {
  .tx_detail_container {
    .tx_detail_content_wrap {
      .tx_detail_content {
        .tx_detail_title {
          display: block;
          margin: 0.3rem 0 0.15rem 0.05rem;
          .tx_detail_title_first {
          }
          .tx_detail_title_hash {
          }
        }
        .tx_information_content {
          .tx_information_list_title {
          }
          .tx_information_list_item {
          }
          .tx_information_list_item:last-child {
          }
        }
        .tx_information_tx_message_content {
          .tx_information_tx_content {
            .tx_information_tx_message_title {
            }
            .tx_information_tx_message_line {
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .tx_detail_container {
    .tx_detail_content_wrap {
      .tx_detail_content {
        .tx_detail_title {
        }
        .tx_information_content {
          .tx_information_list_item {
            span:nth-of-type(1) {
              min-width: 1.4rem;
            }
            span:nth-of-type(2) {
            }
          }
          .tx_information_list_item:last-child {
          }
        }
        .tx_information_tx_message_content {
          .tx_information_tx_message_title {
          }
        }
      }
    }
  }
}
</style>
