<template>
  <div class="tx_content_container">
    <div class="tx_content_wrap">
      <div class="tx_content_header_title">
        <p class="tc_content_header">{{ $t('ExplorerLang.transactions.title') }}</p>
      </div>
      <list-component
        :is-show-token-type="true"
        :is-loading="isLoading"
        :token-symbol="mainTokenSymbol"
        :list-data="transactionArray"
        :column-list="txColumnList"
        :pagination="{
          pageSize: Number(pageSize),
          dataCount: Number(txCount) || 0,
          pageNum: Number(pageNum),
        }"
        @pageChange="pageChange"
        :empty-text="$t('ExplorerLang.table.emptyDescription')"
      >
        <template v-slot:msgType>
          <tabs-component :tab-list="txTypeOption" @onSelectMagType="getFilterTxs"></tabs-component>
        </template>
        <template v-slot:resetButton>
          <tx-reset-button-component
            @resetParams="resetFilterCondition"
          ></tx-reset-button-component>
        </template>

        <template v-slot:datePicket>
          <tx-status-tabs-components
            @onChangTxStatus="changeTxStatus"
            @onChangeDate="changeTime"
            ref="statusDatePicker"
          ></tx-status-tabs-components>
        </template>
        <template v-slot:txCount>
          <tx-count-component
            :title="$t('ExplorerLang.transactions.txs')"
            :icon="'iconTrainsaction'"
            :tx-count="txCount"
            :countMsgs="countMsgs"
            :loading="countLoading"
          ></tx-count-component>
        </template>
      </list-component>
    </div>
  </div>
</template>

<script>
import { addressRoute, formatMoniker, getMainToken, getConfig } from '@/helper/IritaHelper';
import TxTypes from '@/helper/TxTypes';
import { formatTxDataFn, getCountMsgs2 as getCountMsgs } from '@/helper/txList/common';
import Tools from '../util/Tools';
import MPagination from './common/MPagination';
import TxListComponent from './common/TxListComponent';
import { TxHelper } from '../helper/TxHelper';
import { getTxList, getTxCountApi } from '../service/api';
import {
  TX_TYPE,
  TX_STATUS,
  ColumnMinWidth,
  monikerNum,
  decimals,
  IRIS_ADDRESS_PREFIX,
  COSMOS_ADDRESS_PREFIX,
} from '../constant';
import ListComponent from './common/ListComponent';
import parseTimeMixin from '../mixins/parseTime';
import prodConfig from '../productionConfig';
import TabsComponent from './common/TabsComponent';
import TxStatusTabsComponents from './common/TxStatusTabsComponents';
import TxCountComponent from './TxCountComponent';
import TxResetButtonComponent from './common/TxResetButtonComponent';
import { getColumnByTxTyp } from './tableListColumnConfig/common';

export default {
  name: 'TxList',
  components: {
    TxResetButtonComponent,
    TxCountComponent,
    TxStatusTabsComponents,
    TabsComponent,
    ListComponent,
    MPagination,
    TxListComponent,
  },
  mixins: [parseTimeMixin],
  data() {
    const { txType, status, beginTime, endTime, pageNum, pageSize } = Tools.urlParser();
    return {
      isLoading: false,
      IBC: 'IBC',
      HashLock: 'Hash Lock',
      PickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() < new Date(this.pickerStartTime).getTime() || time.getTime() > Date.now()
          );
        },
      },
      TX_TYPE,
      TX_STATUS,
      transactionArray: [],
      txCount: 0,
      txTypeOption: [],
      statusOpt: [
        {
          value: 0,
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
      statusValue: status || '',
      txType: txType || '',
      beginTime: beginTime || '',
      endTime: endTime || '',
      txStatus: '',
      pageNum: pageNum || 1,
      pageSize: pageSize || 15,
      txTypeArray: [''],
      txColumnList: [],
      tyepWidth: ColumnMinWidth.txType,
      TxHelper,
      ColumnMinWidth,
      Tools,
      addressRoute,
      formatMoniker,
      monikerNum,
      feeDecimals: decimals.fee,
      txDataList: [],
      colWidthList: [],
      loading: false,
      mainTokenSymbol: '',
      IRIS_ADDRESS_PREFIX,
      COSMOS_ADDRESS_PREFIX,
      isShowIbc: false,
      isShowHashLock: false,
      countMsgs: [], // 写成数组为了后面拓展
      countLoading: false,
    };
  },
  async created() {
    await this.getConfigTokenData();
  },
  mounted() {
    this.getFilterTxs('init');
    this.getAllTxType();
    this.setMainToken();
  },
  methods: {
    changeTxStatus(txStatus) {
      this.statusValue = Number(txStatus);
      this.getFilterTxs();
    },
    changeTime(selectTime) {
      this.beginTime = '';
      this.endTime = '';
      if (selectTime?.length === 2) {
        this.beginTime = selectTime[0];
        this.endTime = selectTime[1];
        sessionStorage.setItem('txTimeRange', JSON.stringify(selectTime));
      }

      this.getFilterTxs();
    },
    getFilterTxs(param) {
      this.updateTxtype(param);
      this.txColumnList = getColumnByTxTyp(this.txType);

      this.statusValue = Number(this.statusValue || 0);
      this.pageNum = 1;

      const url = this.stringifyUrl(
        '/#/txs',
        {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          txType: this.txType,
          status: this.statusValue,
          beginTime: this.beginTime,
          endTime: this.endTime,
        },
        [undefined, null, 0, '']
      );

      param === 'init' ? history.replaceState(null, null, url) : history.pushState(null, null, url);
      this.getTxListDataCount({ useCount: true, ...prodConfig.txQueryKeys2 });
      this.getTxListData(this.pageNum, this.pageSize);
    },
    /* filterTxByTxType(e){
			if(e === 'allTxType' || e === undefined){
				this.TxType = ''
			} else {
				this.TxType = e
			}
		}, */
    resetUrl() {
      this.beginTime = '';
      this.endTime = '';
      this.txType = '';
      this.statusValue = 0;
      this.txStatus = '';
      this.beginTime = '';
      this.endTime = '';
      sessionStorage.setItem('currentChoiceMsgType', JSON.stringify(this.txType));
      history.pushState(
        null,
        null,
        `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`
      );
    },
    async getTxListData(pageNum, pageSize) {
      this.isLoading = true;

      const { txType, status, beginTime, endTime } = Tools.urlParser();
      let params = { type: txType, status, beginTime, endTime };
      if (pageNum && pageSize) {
        params = { ...params, pageNum, pageSize };
      }

      // 先清空数据
      this.txData = [];
      this.formatTxData(txType);

      try {
        const res = await getTxList(params);
        if (Number(this.pageNum) === Number(res.pageNum)) {
          this.txData = res.data;
          this.formatTxData(txType);
        }
        if (pageNum) {
          this.pageNum = res.pageNum;
        }
        if (pageSize) {
          this.pageSize = res.pageSize;
        }
      } catch (e) {
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      } finally {
        this.isLoading = false;
      }
    },
    async getTxListDataCount(
      otherParams = {
        useCount: false,
        msg_count: false,
      }
    ) {
      const { txType, status, beginTime, endTime } = Tools.urlParser();
      let params = { type: txType, status, beginTime, endTime };
      if (otherParams) {
        params = { ...params, ...otherParams };
      }
      try {
        this.countLoading = true;
        // 先清空数据
        this.txCount = '--';
        this.countMsgs = getCountMsgs({});

        const res = await getTxCountApi(params);
        if (params.useCount) {
          this.txCount = res.total_tx;
        }

        this.countMsgs = getCountMsgs(res || {});
      } catch (e) {
        // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      } finally {
        this.countLoading = false;
      }
    },
    async getAllTxType() {
      try {
        const res = await TxTypes.getData();
        const typeList = TxHelper.formatTxType(res.data);
        typeList.unshift({
          value: '',
          label: this.$t('ExplorerLang.common.allTxType'),
          slot: 'allTxType',
        });
        this.txTypeOption = typeList;
        sessionStorage.setItem('typeList', JSON.stringify(typeList));
        this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, this.txType);
      } catch (e) {
        console.error(e);
        // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    getStartTime(time) {
      this.beginTime = time;
    },
    getEndTime(time) {
      this.endTime = time;
    },
    resetFilterCondition() {
      this.txType = '';
      this.statusValue = '';
      this.beginTime = '';
      this.endTime = '';
      this.pageNum = 1;
      this.pageSize = 15;
      this.$refs.statusDatePicker.resetParams();
      this.resetUrl();
      this.getTxListDataCount({ useCount: true, ...prodConfig.txQueryKeys2 });
      this.getTxListData(this.pageNum, this.pageSize);
      this.$store.commit('currentTxModelIndex', 0);
      sessionStorage.setItem('lastChoiceMsgModelIndex', 0);
      sessionStorage.setItem('txTimeRange', []);
      this.txTypeArray = [''];
      this.txColumnList = getColumnByTxTyp();
    },
    isValid(value) {
      return !(!value || !value.length || value === '--');
    },
    async setMainToken() {
      const mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
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
    pageChange(pageNum) {
      if (this.pageNum === pageNum) return;
      this.pageNum = pageNum;

      const { txType, status, beginTime, endTime, pageSize } = Tools.urlParser();
      let url = `/#/txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=false`;
      if (txType) {
        url += `&txType=${txType}`;
        this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, txType);
        this.txType = txType;
      } else {
        this.txTypeArray = [''];
        this.txType = '';
      }
      if (status) {
        url += `&status=${status}`;
        this.statusValue = Number(status);
      } else {
        this.statusValue = 0;
      }
      if (beginTime) {
        url += `&beginTime=${beginTime}`;
        this.beginTime = beginTime;
      } else {
        this.beginTime = '';
      }
      if (endTime) {
        url += `&endTime=${endTime}`;
        this.endTime = endTime;
      } else {
        this.endTime = '';
      }
      history.pushState(null, null, url);
      this.getTxListData(this.pageNum, this.pageSize);
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address);
    },
    async formatTxData(msgType) {
      try {
        const res = await formatTxDataFn(msgType, this.txData, {
          isShowFee: prodConfig.fee.isShowFee,
          isShowDenom: prodConfig.fee.isShowDenom,
          feeDecimals: decimals.fee,
          parseTimeFn: () => {
            this.parseTime('transactionArray', 'Time', 'ageTime');
          },
        });
        this.transactionArray = res.transactionArray;
      } catch (e) {
        console.log(e);
      }
    },
    async getConfigTokenData() {
      const res = await getConfig();
      this.tokenData = res.tokenData;
    },

    updateTxtype(param) {
      if (param?.value) {
        this.txType = param.value;
      } else if (param?.value === '') {
        // 处理点击all的情况
        this.txType = '';
      } else if (Array.isArray(param)) {
        const notAllMsgType = param.filter((item) => {
          return item.label !== 'secondaryAll';
        });
        const currentSelectSecondMsgTypes = notAllMsgType.map((item) => {
          return item.value;
        });

        if (currentSelectSecondMsgTypes?.length) {
          this.txType = currentSelectSecondMsgTypes.join(',');
        }
      }
    },

    stringifyUrl(url, param, filters) {
      return `${url}${Tools.formatParams(param, filters)}`;
    },
  },
  beforeDestroy() {
    this.$store.commit('currentTxModelIndex', 0);
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

.tx_content_container {
  width: 100%;

  .tx_content_wrap {
    max-width: 12.3rem;

    .tx_content_header_title {
      text-align: left;
      margin-top: 0.4rem;
      padding-bottom: 0.1rem;

      .tc_content_header {
        font-size: 0.22rem;
        font-weight: 600;
        color: #171d44;
        line-height: 0.26rem;
      }
    }

    .tx_content_header_wrap {
      display: flex;
      justify-content: flex-start;
    }
  }

  @media screen and (max-width: 910px) {
    .tx_content_wrap {
      width: 100%;

      .tx_content_header_wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .tx_type_mobile_content {
          margin-bottom: 0.1rem;

          &:last-child {
            width: 100%;
            justify-content: flex-end;

            .search_btn {
              margin-left: 0;
            }
          }

          .tx_type_transactions {
            margin-right: 0.26rem !important;
          }
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .tx_content_wrap {
      .pagination_content {
        .tooltip_box {
          text-align: end;
        }

        .common_pagination_content {
          border: 0;
          text-align: end;
        }
      }
    }
  }
  @media screen and (min-width: 768px) {
    .tx_content_wrap {
      .pagination_content {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .tx_content_wrap {
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 0.15rem;

    .service_tx_to_container {
      .service_tx_muti_to_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .service_tx_muti_to_ellipsis {
          color: $t_link_c;
        }
      }
    }

    .service_tx_status {
      position: relative;
      top: 0.02rem;
      left: -0.04rem;
      width: 0.13rem;
      height: 0.13rem;
    }

    .tx_content_header_wrap {
      padding: 0.3rem 0 0.13rem 0;

      .tx_transaction_content_hash {
        display: flex;
        align-items: center;
      }

      .total_tx_content {
        // height: 0.64rem;
        line-height: 0.4rem;
        color: $t_first_c;
        font-size: $s18;
        font-weight: bold;
        margin: 0rem 0.2rem 0rem 0rem;
        //text-indent: 0.2rem;
      }

      /*.filer_content {
					display: flex;
					align-items: center;*/
      .tx_type_mobile_content {
        display: flex;
        align-items: center;

        .tooltip_content {
          padding: 0 0 0 0.1rem;
        }

        ::v-deep.el-cascader {
          width: 1.3rem;
          margin-right: 0.1rem;

          .el-input {
            input::-webkit-input-placeholder {
              /* 使用webkit内核的浏览器 */
              color: $t_first_c;
            }

            input:-moz-placeholder {
              /* Firefox版本4-18 */
              color: $t_first_c;
            }

            input::-moz-placeholder {
              /* Firefox版本19+ */
              color: $t_first_c;
            }

            input:-ms-input-placeholder {
              /* IE浏览器 */
              color: $t_first_c;
            }

            .el-input__inner {
              padding-left: 0.07rem;
              height: 0.32rem;
              font-size: $s14 !important;
              line-height: 0.32rem;

              &::-webkit-input-placeholder {
                font-size: $s14 !important;
              }
            }

            .el-input__inner:focus {
              border-color: $theme_c !important;
            }

            .el-input__suffix {
              .el-input__suffix-inner {
                .el-input__icon {
                  line-height: 0.32rem;
                }
              }
            }
          }

          .is-focus {
            .el-input__inner {
              border-color: $theme_c !important;
            }
          }
        }

        ::v-deep .el-select {
          width: 1.3rem;
          margin-right: 0.1rem;

          .el-input {
            .el-input__inner {
              padding-left: 0.07rem;
              height: 0.32rem;
              font-size: $s14 !important;
              line-height: 0.32rem;

              &::-webkit-input-placeholder {
                font-size: $s14 !important;
              }
            }

            .el-input__inner:focus {
              border-color: $theme_c !important;
            }

            .el-input__suffix {
              .el-input__suffix-inner {
                .el-input__icon {
                  line-height: 0.32rem;
                }
              }
            }
          }

          .is-focus {
            .el-input__inner {
              border-color: $theme_c !important;
            }
          }
        }

        ::v-deep .el-date-editor {
          width: 1.3rem;

          .el-icon-circle-close {
            display: none !important;
          }

          .el-input__inner {
            height: 0.32rem;
            padding-left: 0.07rem;
            padding-right: 0;
            line-height: 0.32rem;

            &::-webkit-input-placeholder {
              font-size: $s14 !important;
            }

            &:focus {
              border-color: $theme_c;
            }
          }

          .el-input__prefix {
            right: 5px;
            left: 1rem;

            .el-input__icon {
              line-height: 0.32rem;
            }
          }
        }

        .joint_mark {
          margin: 0 0.08rem;
        }

        .reset_btn {
          background: $bg_button_c;
          color: $t_button_c;
          border-radius: 0.04rem;
          margin-left: 0.1rem;
          cursor: pointer;

          i {
            padding: 0.08rem;
            font-size: $s14;
            line-height: 1;
            display: inline-block;
          }
        }

        .search_btn {
          cursor: pointer;
          background: $bg_button_c;
          margin-left: 0.1rem;
          color: $t_button_c;
          border-radius: 0.04rem;
          padding: 0.05rem 0.18rem;
          font-size: $s14;
          line-height: 0.2rem;
          white-space: nowrap;
        }
      }

      //}
    }

    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }

    .pagination_content {
      margin: 0.1rem 0 0.2rem 0;

      .tooltip_box {
        display: flex;
        align-items: center;
        background-color: white;
        padding: 0.05rem 0.2rem;
        font-size: $s12;
        color: #8d8b8b;

        .tooltip_title {
          margin-right: 0.24rem;
        }

        .tooltip_title_box {
          display: flex;
        }

        .tooltip_title_IBC {
          margin-right: 0.24rem;
          display: flex;
          align-items: center;
          position: relative;

          &::before {
            left: -0.12rem;
            content: ' ';
            position: absolute;
            height: 0.08rem;
            width: 0.08rem;
            border-radius: 0.04rem;
            background-color: #d47d78;
          }
        }

        .tooltip_title_HTLT {
          display: flex;
          align-items: center;
          position: relative;

          &::before {
            left: -0.12rem;
            content: ' ';
            position: absolute;
            height: 0.08rem;
            width: 0.08rem;
            border-radius: 0.04rem;
            background-color: #51a3a3;
          }
        }
      }
    }
  }
}
</style>
