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
import { decimals } from '@/constant';
import Tools from '@/util/Tools';
import { getMainToken } from '@/helper/IritaHelper';
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
import { formatTxDataFn } from '@/helper/txList/common';

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
      try {
        const res = await formatTxDataFn(msgType, this.txList, {
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
      } finally {
        this.isAddressTxLoading = false;
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
