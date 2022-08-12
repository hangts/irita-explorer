<template>
  <div class="address_container_content">
    <div class="address_content_wrap">
      <div class="address_content_title">
        <div class="address_content_title_first">
          {{ `${$t('ExplorerLang.addressDetail.addressDetail')} |` }}
        </div>
        <div class="address_content_title_address">
          {{ address }}
          <m-clip v-if="address" :text="address" style="margin-left: 0.09rem"></m-clip>
        </div>
      </div>
      <div class="address_tab_container">
        <vue-scroll :ops="opsConfig">
          <div class="address_tab_content">
            <div
              class="address_tab_item"
              :key="index"
              v-for="(item, index) in tabList"
              :class="item.isActive ? 'active_content' : ''"
              @click="selectOptions(index)"
            >
              <span>{{ item.label }}</span>
            </div>
          </div>
        </vue-scroll>
      </div>

      <div v-if="moduleSupport('107', prodConfig.navFuncList) && isAsset">
        <!-- 地址详情 -->
        <assets-tab-options></assets-tab-options>
      </div>

      <div
        class="address_nft_content"
        v-if="moduleSupport('103', prodConfig.navFuncList) && isNftInfo"
      >
        <nft-tab-options></nft-tab-options>
      </div>

      <div
        class="consumer_transaction_content"
        v-if="moduleSupport('105', prodConfig.navFuncList) && isIservice"
      >
        <i-service-consumer-options></i-service-consumer-options>
      </div>

      <div
        class="provider_transaction_content"
        v-if="moduleSupport('105', prodConfig.navFuncList) && isIservice"
      >
        <i-service-provider-options></i-service-provider-options>
      </div>

      <div
        class="address_content"
        v-if="moduleSupport('106', prodConfig.navFuncList) && isIdentity"
      >
        <identity-options></identity-options>
      </div>

      <div v-if="isTx" class="address_transaction_content">
        <txs-options></txs-options>
      </div>
      <!-- bsn ddc -->
      <div
        class="address_transaction_content"
        v-if="moduleSupport('117', prodConfig.navFuncList) && isDDC"
      >
        <bsn-ddc-options></bsn-ddc-options>
      </div>
      <!-- energy asset -->
      <div v-if="moduleSupport('116', prodConfig.navFuncList) && isEnergyAsset">
        <energy-asset-options></energy-asset-options>
      </div>
      <div v-if="moduleSupport('119', prodConfig.navFuncList) && isMtAsset">
        <mt-tab-options></mt-tab-options>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig, converCoin, getMainToken, getTxType } from '@/helper/IritaHelper';
import { getDelegationListApi } from '@/service/api';
import BigNumber from 'bignumber.js';
import AddressSendAndReceiveTx from '@/components/common/AddressSendAndReceiveTx';
import addressDetailNftTabColumnConfig from '@/components/tableListColumnConfig/addressDetailNftTabColumnConfig';
import AddressInfoComponent from '@/addressPage/AssetsTabOptions';
import AssetsTabOptions from '@/addressPage/AssetsTabOptions';
import NFTTabOptions from '@/addressPage/NftTabOptions';
import NftTabOptions from '@/addressPage/NftTabOptions';
import TxsOptions from '@/addressPage/TxsOptions';
import IServiceConsumerOptions from '@/addressPage/IServiceConsumerOptions';
import IServiceProviderOptions from '@/addressPage/IServiceProviderOptions';
import IdentityOptions from '@/addressPage/IdentityOptions';
import BsnDdcOptions from '@/addressPage/BsnDdcOptions';
import EnergyAssetOptions from '@/addressPage/EnergyAssetOptions';
import Tools from '../util/Tools';
import MPagination from './common/MPagination';
import { moduleSupport } from '../helper/ModulesHelper';
import TxListComponent from './common/TxListComponent';
import prodConfig from '../productionConfig';
import Constant, { TX_TYPE, TX_STATUS, ColumnMinWidth, decimals } from '../constant';
import AddressInformationComponent from './AddressInformationComponent';
import LargeString from './common/LargeString';
import ListComponent from './common/ListComponent';
import txCommonTable from './tableListColumnConfig/txCommonTable';
import txCommonLatestTable from './tableListColumnConfig/txCommonLatestTable';
import { needAddColumn } from './tableListColumnConfig/allTxTableColumnConfig';
import TabsComponent from './common/TabsComponent';
import TxStatusTabsComponents from './common/TxStatusTabsComponents';
import TxCountComponent from './TxCountComponent';
import MClip from './common/MClip';
import SignerColunmn from './tableListColumnConfig/SignerColunmn';
import TxResetButtonComponent from './common/TxResetButtonComponent';
import energyAssetColumn from './tableListColumnConfig/energyAssetColumn';
import {
  energyAsset,
  assetInfo,
  nftCount,
  ddc,
  identity,
  iService,
  tx,
  mtAsset,
} from './ownerDetail/lib';
import MtTabOptions from "../addressPage/MtTabOptions";

export default {
  name: 'OwnerDetail',
  components: {
    MtTabOptions,
    EnergyAssetOptions,
    BsnDdcOptions,
    IdentityOptions,
    IServiceProviderOptions,
    IServiceConsumerOptions,
    TxsOptions,
    NftTabOptions,
    NFTTabOptions,
    AssetsTabOptions,
    AddressInfoComponent,
    AddressSendAndReceiveTx,
    TxResetButtonComponent,
    MClip,
    TxCountComponent,
    TxStatusTabsComponents,
    TabsComponent,
    ListComponent,
    MPagination,
    TxListComponent,
    AddressInformationComponent,
    LargeString,
  },
  data() {
    return {
      assetLoading: false,
      feeDecimals: decimals.fee,
      isShowDenom: prodConfig.fee.isShowDenom,
      isShowFee: prodConfig.fee.isShowFee,
      transactionArray: [],
      isLoading: false,
      txColumnList: [],
      TX_TYPE_DISPLAY: {},
      IBC: 'IBC',
      HashLock: 'Hash Lock',
      TX_TYPE,
      TX_STATUS,
      ColumnMinWidth,
      prodConfig,
      moduleSupport,
      Tools,
      assetArray: [],
      assetPageNum: 1,
      assetPageSize: 5,
      assetCount: 0,
      denomArray: [],
      address: '',
      pageNum: 1,
      pageSize: 5,
      txList: [],
      totalTxNumber: 0,
      providerTxList: [],
      providerTxPageNum: 1,
      providerTxPageSize: 5,
      providerTxCount: 0,
      consumerTxPageNum: 1,
      consumerTxPageSize: 5,
      consumerTxCount: 0,
      consumerTxList: [],
      respondRecordList: [],
      respondRecordPageNum: 1,
      respondRecordPageSize: 5,
      respondRecordCount: 0,
      identityList: [],
      identityPageNum: 1,
      identityPageSize: 5,
      identityCount: 0,
      type: '',
      status: '',
      type_temp: '',
      status_temp: '',
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
      txTypeOption: [
        {
          value: '',
          label: this.$t('ExplorerLang.common.allTxType'),
        },
      ],
      assetList: [],
      totalDelegatorReward: 0,
      totalDelegator: 0,
      allRewardsValue: 0,
      allRewardsAmountValue: 0,
      delegationPageNationArrayData: [],
      unBondingDelegationPageNationArrayData: [],
      rewardsDelegationPageNationArrayData: [],
      mainToken: {},
      tabList: [],
      isAsset: false,
      isNftInfo: false,
      nftKey: 0,
      isIdentity: false,
      isIservice: false,
      isTx: false,
      isDDC: false,
      ddcList: [],
      ddcListColumn: [],
      ddcPageSize: 5,
      ddcCount: 0,
      ddcPageNum: 1,
      LargeStringMinHeight: 69,
      LargeStringLineHeight: 23,
      mainTokenSymbol: '',
      energyAssetData: [],
      energyAssetColumn,
      isEnergyAsset: false,
      isMtAsset: false,
      isShowSendAndReceiveTxComponent: false,
      opsConfig: {
        rail: {
          opacity: 1,
          background: '#E6E6E6',
          // border: '1px solid #cecece',
          size: '6px',
        },
        bar: {
          keepShow: true,
          size: '6px',
          minSize: 0.1,
          background: '#cdcdcd',
        },
        vuescroll: {
          wheelScrollDuration: 0,
          wheelDirectionReverse: false,
          locking: true,
          checkShifKey: true,
        },
      },
      assetColumnArray: addressDetailNftTabColumnConfig,
    };
  },
  watch: {
    $route() {
      this.address = this.$route.params.param;
      this.getTxByAddress();
    },
  },
  async created() {
    // this.mainToken = await getMainToken();
    await this.getConfigTokenData();
  },
  async mounted() {
    this.isShowSendAndReceiveTxComponent = prodConfig.isShowSendAndReceiveTxCount;
    this.txColumnList = txCommonTable.concat(SignerColunmn, txCommonLatestTable);
    // this.ddcListColumn = ddcListColumnConfig;
    await this.getTxTypeData();
    document.documentElement.scrollTop = 0;
    this.address = this.$route.params.param;
    this.getTabList();
  },
  methods: {
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
    },
    changeTxStatus(status) {
      this.status = status;
      if (!status) {
        this.status = '';
      }
    },
    changeTime() {},
    async getTxTypeData() {
      try {
        const res = await getTxType();
        this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY;
      } catch (error) {
        console.log(error);
      }
    },
    async setMainToken() {
      const mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
    },
    getTabList() {
      this.tabList = [];
      if (moduleSupport('116', prodConfig.navFuncList)) {
        this.tabList.push({ ...energyAsset });
      }
      if (moduleSupport('107', prodConfig.navFuncList)) {
        this.tabList.push({ ...assetInfo });
      }
      if (moduleSupport('103', prodConfig.navFuncList)) {
        this.tabList.push({ ...nftCount });
      }
      if (moduleSupport('119', prodConfig.navFuncList)) {
        this.tabList.push({ ...mtAsset });
      }
      if (moduleSupport('117', prodConfig.navFuncList)) {
        this.tabList.push({ ...ddc });
      }
      if (moduleSupport('106', prodConfig.navFuncList)) {
        this.tabList.push({ ...identity });
      }
      if (moduleSupport('105', prodConfig.navFuncList)) {
        this.tabList.push({ ...iService });
      }
      this.tabList.push({ ...tx });
      this.tabList[0].isActive = true;
      this.showAndHideByModule();
    },
    showAndHideByModule() {
      this.isNftInfo = false;
      this.isIservice = false;
      this.isIdentity = false;
      this.isAsset = false;
      this.isTx = false;
      this.isDDC = false;
      this.isEnergyAsset = false;
      this.isMtAsset = false;
      this.tabList.forEach((item) => {
        if (item.isActive) {
          switch (item.moduleNumber) {
            case '103':
              this.nftKey++;
              this.isNftInfo = true;
              break;
            case '105':
              this.isIservice = true;
              break;
            case '106':
              this.isIdentity = true;
              break;
            case '107':
              this.isAsset = true;
              break;
            case '116':
              this.isEnergyAsset = true;
              break;
            case '117':
              this.isDDC = true;
              break;
            case '119':
              this.isMtAsset = true;
              break;
            default:
              this.isTx = true;
          }
        }
      });
    },
    selectOptions(index) {
      this.tabList.forEach((item) => {
        item.isActive = false;
      });
      this.tabList[index].isActive = true;
      this.showAndHideByModule();
    },
    pageNation(dataArray) {
      let index = 0;
      let newArray = [];
      if (dataArray.length > this.pageSize) {
        while (index < dataArray.length) {
          newArray.push(dataArray.slice(index, (index += this.pageSize)));
        }
      } else {
        newArray = dataArray;
      }
      return newArray;
    },
    async getDelegationList() {
      try {
        const { data: res, count } = await getDelegationListApi(this.$route.params.param, 1, 1000);
        if (res && res.length > 0) {
          this.delegationCountNum = count;
          const copyResult = JSON.parse(JSON.stringify(res));
          this.delegationPageNationArrayData = this.pageNation(copyResult);
          if (res.length > this.pageSize) {
            this.flDelegationNextPage = true;
          } else {
            this.flDelegationNextPage = false;
          }
          this.delegationPageChange(this.delegationCurrentPage);
          if (res.length > 0) {
            // res.forEach(async (item) => {
            // 	if (item.amount && item.amount.amount) {
            // 		const amount = await converCoin(item.amount)
            // 		item.amount.amount = amount.amount
            // 		if (item.amount.amount.toString().indexOf('.') !== -1) {
            // 			let splitNumber = item.amount.amount.toString().split('.')[1].substr(0, 2);
            // 			item.amount.amount = Number(`${item.amount.amount.toString().split('.')[0]}.${splitNumber}`) * 100
            // 		} else {
            // 			item.amount.amount = item.amount.amount * 100
            // 		}
            // 	}
            // });

            let totalAmount = res.reduce((total, item) => {
              return Number(item.amount.amount) + Number(total);
            }, 0);
            totalAmount = await converCoin({
              amount: totalAmount,
              denom: res[0].amount.denom,
            });
            this.totalDelegator = totalAmount.amount;
          }
          this.totalDelegatorValue = `${Tools.formatStringToFixedNumber(
            new BigNumber(this.totalDelegator.toString()).toFormat(),
            this.fixedNumber
          )} ${this.mainToken.symbol.toUpperCase()}`;
        } else {
          this.delegationsItems = [];
          this.delegationCountNum = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getConfigTokenData() {
      const res = await getConfig();
      this.tokenData = res.tokenData;
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem('currentTxModelIndex');
    sessionStorage.removeItem('lastChoiceMsgModelIndex');
    sessionStorage.removeItem('currentChoiceMsgType');
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

::v-deep .el-table__empty-block {
  height: 0.48rem !important;
  min-height: 0.48rem !important;
}

.txCountWrap {
  display: flex;
  flex-wrap: wrap;

  > div + div {
    margin-left: 20px;
  }
}

.address_container_content {
  padding: 0 0.15rem;

  .address_content_wrap {
    max-width: 12rem;
    margin: 0 auto;

    .address_content_title {
      display: flex;
      justify-content: flex-start;
      color: $t_first_c;
      font-size: $s18;
      line-height: 0.21rem;
      margin: 0.3rem 0 0.15rem 0rem;
      text-align: left;
      font-family: PublicSans;
      font-weight: 600;

      .address_content_title_first {
        white-space: nowrap;
        margin-right: 0.05rem;
      }

      .address_content_title_address {
        font-size: $s16;
        font-family: PublicSans;
        font-weight: 400;
        color: $t_first_c;
        line-height: 0.2rem;
        word-break: break-all;
      }
    }

    .address_tab_container {
      margin-top: 0.2rem;
      .address_tab_content {
        display: flex;
        // margin-left: 0.28rem;
        padding-bottom: 0.14rem;

        .address_tab_item {
          white-space: nowrap;
          cursor: pointer;
          padding: 0 0.16rem;
          margin-right: 0.16rem;
          line-height: 0.3rem;
          border-right: none;
          font-size: 0.14rem;
          background-color: $bg_white_c;
          border-radius: 0.06rem;
          box-shadow: 0 0 0.01rem 0 rgba(0,0,0,0.01), 0 0.02rem 0.08rem 0 rgba(0,0,0,0.04), 0 0.17rem 0.32rem 0 rgba(0,0,0,0.01);
        }
        .address_tab_item:last-child {
          margin-right: 0;
        }
      }

      .active_content {
        background: $theme_c !important;
        color: $t_white_c;
        border: 0.01rem solid transparent !important;
      }
    }

    .address_nft_content {
      background: $bg_white_c;
    }

    .address_content {
      background: $bg_white_c;
      padding: 0.25rem;
      border-radius: 0.05rem;
      // border: 0.01rem solid $bd_first_c;
      margin-bottom: 0.48rem;
    }

    .consumer_transaction_content {
      margin-bottom: 0.48rem;
      background: $bg_white_c;
      padding: 0.25rem;
      border-radius: 0.05rem;
      // border: 0.01rem solid $bd_first_c;
      .address_transaction_content_hash {
        display: flex;

        .status {
          .status_icon {
            width: 0.13rem;
            height: 0.13rem;
            margin-right: 0.05rem;
          }
        }
      }

      .serviceNameText {
        color: $t_second_c;
      }

      .consumer_transaction_content_hash {
        display: flex;
        align-items: center;
      }

      .consumer_transaction_content_available {
        display: flex;
        align-items: center;

        .consumer_transaction_content_available_icon {
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          margin-right: 0.1rem;
        }
      }

      .pagination_content {
        margin-top: 0.2rem;
        display: flex;
        justify-content: flex-end;
      }
    }

    .provider_transaction_content {
      margin-bottom: 0.48rem;
      background: $bg_white_c;
      padding: 0.25rem;
      border-radius: 0.05rem;
      // border: 0.01rem solid $bd_first_c;

      .respond_transaction_content_hash {
        display: flex;

        .status {
          .status_icon {
            width: 0.13rem;
            height: 0.13rem;
            margin-right: 0.05rem;
          }
        }
      }

      .address_transaction_content_hash {
        display: flex;

        .status {
          .status_icon {
            width: 0.13rem;
            height: 0.13rem;
            margin-right: 0.05rem;
          }
        }
      }

      .provider_transaction_content_available {
        display: flex;
        align-items: center;

        .provider_transaction_content_available_icon {
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          margin-right: 0.1rem;
        }
      }

      .pagination_content {
        margin-top: 0.2rem;
        display: flex;
        justify-content: flex-end;
      }
    }

    .address_transaction_content {
      // margin-top: 0.48rem;
      margin-bottom: 0.2rem;
      background: $bg_white_c;
      //padding: 0.25rem;
      border-radius: 0.05rem;
      // border: 0.01rem solid $bd_first_c;
      .content_title {
        padding-top: 0.25rem;
        padding-left: 0.25rem;
        color: #171d44;
        margin-bottom: 0.4rem;
        text-align: left;
        font-size: 0.16rem;
        font-family: PublicSans;
        font-weight: 600;
        line-height: 22px;
      }

      .list_table_content_container .box-card {
        padding-left: 0.25rem;
        padding-top: 0;
      }

      .address_transaction_content_hash {
        display: flex;
        align-items: center;
      }

      .address_transaction_condition_container {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 0.4rem;
        align-items: center;

        .address_transaction_condition_count {
          font-size: $s14;
          margin-right: 0.42rem;
          font-weight: 600;
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
          margin-right: 0.22rem;

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

        .search_btn {
          cursor: pointer;
          background: $bg_button_c;
          color: $t_button_c;
          border-radius: 0.04rem;
          padding: 0.05rem 0.18rem;
          font-size: $s14;
          line-height: 0.2rem;
          white-space: nowrap;
        }

        .address_transaction_condition_action {
          display: flex;

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
        }
      }
    }

    .content_title {
      color: $t_first_c;
      margin-bottom: 0.4rem;
      text-align: left;
      font-size: $s16;
      font-family: PublicSans;
      font-weight: 600;
      line-height: 22px;
    }

    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }

    .delegations_wrap {
      margin: 0 auto;

      .delegations_container {
        display: flex;
        .validator_information_content_title {
          height: 0.2rem;
          line-height: 0.2rem;
          color: $t_first_c;
          font-size: $s18;
          margin-top: 0.3rem;
          // padding-left: 0.2rem;
          margin-bottom: 0.06rem !important;
          text-align: left;

          .address_information_delegation_value,
          .address_information_unbonding_delegation_value {
            font-size: $s14;
            color: $t_second_c;
            line-height: 0.16rem;
            margin-left: 0.15rem;
          }
        }

        .one_table_container {
          width: calc(50% - 0.1rem);
        }

        .second_table_container {
          margin-left: 0.2rem;
          width: calc(50% - 0.1rem);
        }

        .delegations_table_container {
          overflow-x: auto;
          border-radius: 0.05rem;
          // border: 0.01rem solid $bd_first_c;
          //min-height: 2.34rem;
          //background: $bg_white_c;
        }
      }

      .common_pagination_content {
        margin-top: 0.2rem;
        float: right;
      }
    }

    .address_information_redelegation_header_title {
      text-align: left;
      font-size: $s18;
      color: $t_first_c;
      line-height: 0.21rem;
      margin: 0.27rem 0 0 0rem;

      .address_information_redelegation_rewards_value {
        font-size: $s14;
        color: $t_second_c;
        line-height: 0.16rem;
        margin-left: 0.15rem;
      }
    }

    .address_information_redelegation_tx_container {
      text-align: left;
      display: flex;
      margin-bottom: 0.2rem;

      .address_information_delegator_rewards_content {
        width: calc(50% - 0.1rem);
        margin-right: 0.2rem;

        .address_information_detail_option {
          padding: 0 0 0.1rem 0rem;

          .address_information_detail_option_name {
            font-size: $s14;
            color: $t_second_c;
            margin-right: 0.1rem;
          }

          .address_information_detail_option_value {
            font-size: $s14;

            a {
              color: $theme_c !important;
            }
          }
        }

        .address_information_list_content {
          overflow-x: auto;
          box-sizing: border-box;
          border-radius: 0.05rem;
          // border: 0.01rem solid $bd_first_c;
          min-height: 2.34rem;
          background: $bg_white_c;
        }

        .pagination_content {
          margin-top: 0.2rem;
          display: flex;
          justify-content: flex-end;
        }
      }

      .address_information_detail_container {
        width: calc(50% - 0.1rem);

        .address_information_redelegation_title {
          width: 100%;
          font-size: $s18;
          color: $t_first_c;
          padding: 0 0 0.06rem 0rem;

          .address_information_validator_rewards_value {
            font-size: $s14;
            color: $t_second_c;
            line-height: 0.16rem;
            margin-left: 0.15rem;
          }
        }

        .address_information_detail_content {
          // border: 0.01rem solid $bd_first_c;
          border-radius: 0.05rem;
          background: $bg_white_c;
          box-sizing: border-box;
          padding: 0.2rem;
          min-height: 2.34rem;

          .address_information_detail_option {
            display: flex;
            align-items: center;

            .address_information_detail_option_name {
              min-width: 1.3rem;
              font-size: $s14;
              color: $t_second_c;
              line-height: 0.16rem;
              margin-right: 0.3rem;
            }

            .address_information_detail_option_value {
              font-size: $s14;
              color: $t_first_c;
              margin-right: 0.1rem;

              a {
                color: $theme_c !important;
              }
            }

            .address_information_address_status_active {
              background: $theme_c;
              font-size: $s12;
              color: $t_button_c;
              padding: 0.02rem 0.14rem;
              border-radius: 0.22rem;
              margin-right: 0.1rem;
            }

            .address_information_address_status_candidate {
              background: $bg_candidate_c;
              font-size: $s12;
              color: $t_button_c;
              padding: 0.02rem 0.14rem;
              border-radius: 0.22rem;
              margin-right: 0.1rem;
            }

            .address_information_address_status_jailed {
              background: $bg_jailed_c;
              font-size: $s12;
              color: $t_button_c;
              padding: 0.02rem 0.14rem;
              border-radius: 0.22rem;
              margin-right: 0.1rem;
            }
          }
        }
      }
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
