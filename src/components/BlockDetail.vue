<template>
  <div class="block_detail_container">
    <div class="block_detail_content_wrap">
      <!-- 标题 -->
      <div class="block_detail_header_content">
				 <span class="block_height_content">
                    <i :class="active?'flag_item_left':'flag_item_left_disabled'" class="iconfont iconshangyigequkuai"
                       @click="skipNext(-1)"></i>
                        <span class="information_value" style="flex:none;">{{ heightValue }}</span>
                    <i :class="activeNext?'flag_item_right':'flag_item_right_disabled'"
                       class="iconfont iconxiayigequkuai" @click="skipNext(1)"></i>
                </span>
      </div>
      <!-- 区块基本信息 -->
      <div class="block_detail_content" v-if="!moduleSupport('107', prodConfig.navFuncList)">
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.blockHash') }}</span>
          <span style="word-break: break-all;">{{ blockHash }}</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.transaction') }}</span>
          <span>{{ txNumber }}</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.timestamp') }}</span>
          <span>{{ time }}</span>
        </div>

      </div>
      <div class="block_detail_content" v-if="moduleSupport('107', prodConfig.navFuncList)">
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.blockHash') }}</span>
          <span>{{ blockStakingHash }}</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.proposer') }}</span>
          <span v-if="proposerAddress !== '' && proposerAddress !== '--'"><router-link class="common_link_style"
                                                                                       :to="`/staking/${proposerAddress}`">{{
              proposerValue
            }}</router-link></span>
          <span v-if="proposerAddress === '' && proposerValue">{{ proposerValue }}</span>
          <span v-if="proposerAddress === '--'">--</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.validators') }}</span>
          <span>{{ validatorValue }}</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.votingPower') }}</span>
          <span>{{ votingPowerValue }}</span>
        </div>
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.transaction') }}</span>
          <span>{{ transactionsValue }}</span>
        </div>
        <!-- 单个区块的奖励没有 -->
        <!--<div class="block_information_item">
          <span>{{$t('ExplorerLang.blockDetail.inflation')}}</span>
          <span>{{inflationValue}}</span>
        </div>-->
        <div class="block_information_item">
          <span>{{ $t('ExplorerLang.blockDetail.timestamp') }}</span>
          <span v-if="timestampValue">{{ timestampValue }}</span>
          <span v-if="!timestampValue">--</span>
        </div>
      </div>
      <!-- 区块交易 -->
      <div class="block_transaction_content" v-if="transactionArray.length > 0">
        <div class="block_transaction_title_content">{{ $t('ExplorerLang.blockDetail.transactions') }}</div>
        <list-component
            :empty-text="$t('ExplorerLang.table.emptyDescription')"
            :list-data="transactionArray"
            :column-list="transactionArrayConfig"
            :token-symbol="mainTokenSymbol"
            :pagination="{
                pageSize:Number(blockTransferPageSize),
							  dataCount: blockTransferCount,
							  pageNum:Number(blockTransferPageNumber)
							}"
            @pageChange="pageChange"
        ></list-component>
      </div>
      <!-- Validator Set 表格 -->
      <div class="block_validator_set_container" v-if="moduleSupport('107', prodConfig.navFuncList)">
        <div class="block_validator_set_title">{{ $t('ExplorerLang.blockDetail.validatorSet') }}</div>
        <div class="block_validator_set_content">
          <el-table class="table" :data="validatorSetList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
            <el-table-column type="index" :min-width="ColumnMinWidth.No"
                             :label="$t('ExplorerLang.table.number')"></el-table-column>
            <el-table-column prop="moniker" :label="$t('ExplorerLang.table.name')"
                             :min-width="ColumnMinWidth.validatirName">
              <template v-slot:default="{ row }">
                <div class="moniker_conent">
                  <div class="proposer_img_content" v-if="row.flProposer">
                    <img src="../assets/proposer_img.png"/>
                  </div>
                  <span class="skip_route">
										<el-tooltip popper-class="tooltip" :disabled="!row.isTooltip" :content="row.monikerValue"
                                placement="bottom">
											<router-link v-if="row.moniker !== '--'"
                                   :to="`/staking/${row.OperatorAddress}`">{{
                          row.moniker ? row.moniker : ''
                        }}</router-link>
											<span v-else>{{ row.moniker }}</span>
										</el-tooltip>
									</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="OperatorAddress" :label="$t('ExplorerLang.table.operator')"
                             :min-width="ColumnMinWidth.address">
              <template v-slot:default="{ row }">
                <div class="common_hover_address_parent skip_route">
                  <el-tooltip
                      :content="row.OperatorAddress"
                      placement="top"
                      effect="dark"
                      :disabled="Tools.disabled(row.OperatorAddress)">
										<span v-if="row.OperatorAddress !== '--'" @click="addressRoute(row.OperatorAddress)"
                          style="font-family: Arial"
                          class="link_style common_font_style address_link">{{ formatAddress(row.OperatorAddress) }}
										</span>
                    <span v-else>{{ row.OperatorAddress }}</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="Consensus" :min-width="ColumnMinWidth.consensus"
                             :label="$t('ExplorerLang.table.consensusAddress')"></el-table-column>
            <el-table-column align="right" prop="ProposerPriority" :min-width="ColumnMinWidth.proposerPriority"
                             :label="$t('ExplorerLang.table.proposerPriority')"></el-table-column>
            <el-table-column align="right" prop="VotingPower" :min-width="ColumnMinWidth.votingPower"
                             :label="$t('ExplorerLang.table.votingPower')"></el-table-column>
          </el-table>
        </div>
        <div class="pagination" style='margin-top:0.2rem;margin-bottom: 0.2rem;'>
          <m-pagination v-show="validatorSetListCount > pageSize"
                        :total="validatorSetListCount"
                        :pageSize="pageSize"
                        :page="validatorSetPageNum"
                        :page-change="pageChangeValidatorSet">
          </m-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TxListComponent from "./common/TxListComponent";
import {
  getBlockWithHeight,
  getLatestBlock,
  getBlockTxList,
  getValidatorSetList,
  stakingBlockInformation
} from '../service/api';
import Tools from "../util/Tools";
import {TX_TYPE, TX_STATUS, ColumnMinWidth, decimals} from '../constant';
import {moduleSupport} from "../helper/ModulesHelper";
import prodConfig from "../productionConfig"
import MPagination from "./common/MPagination";
import {addressRoute} from '@/helper/IritaHelper'
import ListComponent from "./common/ListComponent";
import txCommonTable from "./tableListColumnConfig/txCommonTable";
import txCommonLatestTable from "./tableListColumnConfig/txCommonLatestTable";
import SignerColunmn from "./tableListColumnConfig/SignerColunmn";
import {converCoin, getMainToken} from '@/helper/IritaHelper';

export default {
  name: "BlockDetail",
  components: {ListComponent, TxListComponent, MPagination},
  data() {
    return {
      mainTokenSymbol: '',
      Tools,
      addressRoute,
      ColumnMinWidth,
      moduleSupport,
      prodConfig,
      TX_TYPE,
      TX_STATUS,
      blockHash: 0,
      txNumber: 0,
      time: '',
      active: true,
      activeNext: true,
      maxBlock: 0,
      heightValue: '',
      transactionArray: [],
      blockStakingHash: '',
      proposerValue: "",
      proposerAddress: '',
      validatorValue: null,
      votingPowerValue: '',
      transactionsValue: '',
      inflationValue: null,
      timestampValue: '',
      validatorSetList: [],
      validatorSetListCount: 0,
      pageSize: 10,
      validatorSetPageNum: 1,
      cutNumber: 8,
      transactionArrayConfig: [],
      feeDecimals: decimals.fee,
      blockTransferPageNumber: 1,
      blockTransferPageSize: 10,
      blockTransferCount: 0
    }
  },
  watch: {
    $route() {
      this.getBlockInformation();
      this.getTransactionList();
      this.latestBlock()
      if (Number(this.$route.params.height) <= 1) {
        this.active = false;
      } else {
        this.active = true;
      }
      if (this.maxBlock !== 0) {
        if (Number(this.$route.params.height) >= this.maxBlock) {
          this.activeNext = false;
        } else {
          this.activeNext = true;
        }
      }
    },
  },
  mounted() {
    this.setMainToken();
    this.transactionArrayConfig = txCommonTable.concat(SignerColunmn, txCommonLatestTable)
    this.getBlockInformation();
    this.getTransactionList();
    this.getStakingBlockInformation()
    this.latestBlock()
    if (Number(this.$route.params.height) > 1) {
      this.active = true;
      this.activeNext = true;
    } else {
      this.active = false;
      this.activeNext = false
    }
    this.getValidatorSetList(this.validatorSetPageNum, this.pageSize, this.$route.params.height);
  },
  methods: {

    async setMainToken() {
      let mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
    },
    async getStakingBlockInformation() {
      try {
        const height = this.$route.params.height
        let res = await stakingBlockInformation(height)
        if (res) {
          this.proposerAddress = res.proposer_addr || '--';
          this.blockStakingHash = res.hash;
          this.proposerValue = res.proposer_moniker || (res.proposer_addr || '--');
          this.validatorValue = `${res.precommit_validator_num || 0} / ${res.total_validator_num || 0}`;
          this.votingPowerValue = res.precommit_voting_power ? `${Tools.formatPerNumber((Number(res.precommit_voting_power) / res.total_voting_power) * 100)} %` : '--';
          this.transactionsValue = res.txn;
          //TODO zhangjinbiao  单个区块的奖励没有
          // this.inflationValue =
          this.timestampValue = Tools.formatLocalTime(res.time);
        }
      } catch (e) {
        console.error(e)
      }
    },
    async latestBlock() {
      try {
        let blockData = await getLatestBlock();
        if (blockData) {
          this.getMaxBlock(blockData.height);
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getBlockInformation() {
      try {
        let blockData = await getBlockWithHeight(this.$route.params.height);
        if (blockData) {
          this.blockTransferCount = blockData.txn
          this.heightValue = blockData.height;
          this.blockHash = blockData.hash;
          this.txNumber = blockData.txn;
          this.time = Tools.formatLocalTime(blockData.time);
        }
      } catch (e) {
        console.error(e)
      }


    },
    getMaxBlock(latestHeight) {
      this.maxBlock = latestHeight;
      if (Number(this.$route.params.height) >= Number(latestHeight)) {
        this.activeNext = false;
      } else {
        this.activeNext = true;
      }
    },
    async getTransactionList() {
      try {
        const res = await getBlockTxList(this.blockTransferPageNumber, this.blockTransferPageSize, this.$route.params.height);
        if (res && res.data && res.data.length) {
          this.transactionArray = res.data.map((item, index) => {
            return {
              txType: (item.msgs || []).map(item => item.type),
              txHash: item.tx_hash,
              time: Tools.formatAge(Tools.getTimestamp(), item.time * 1000, this.$t('ExplorerLang.table.suffix')),
              Time: Tools.formatLocalTime(item.time),
              status: item.status,
              signer: item.signers[0],
              blockHeight: item.height,
              Tx_Fee: item.fee
            }
          })
          this.transactionArray.forEach(async (item, index) => {
            const fee = item && item.Tx_Fee && item.Tx_Fee.amount && item.Tx_Fee.amount.length ? await converCoin(item.Tx_Fee.amount[0]) : '--'
            item.Tx_Fee = fee && fee.amount && fee.denom ? Tools.toDecimal(fee.amount, this.feeDecimals) : '--'
          })
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    skipNext(num) {
      if (Number(this.$route.params.height) >= 1) {
        if (Number(this.$route.params.height) <= 1) {
          this.active = false;
          if (num !== -1) {
            this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
          }
        } else if (Number(this.$route.params.height) >= this.maxBlock) {
          if (num !== 1) {
            this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
          }
        } else {
          this.active = true;
          this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
        }
      }
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    pageChange(pageNum) {
      this.blockTransferPageNumber = pageNum;
      this.getTransactionList();
    },
    async getValidatorSetList() {
      try {
        let data = await getValidatorSetList(this.validatorSetPageNum, this.pageSize, this.$route.params.height)
        if (data && data.data && data.data.length > 0) {
          this.validatorSetListCount = data.count;
          this.validatorSetList = data.data.map(item => {
            return {
              'monikerValue': item.moniker,
              'moniker': Tools.formatString(item.moniker, this.cutNumber, '...') || '--',
              'OperatorAddress': item.operator_address || '--',
              'Consensus': item.consensus,
              'ProposerPriority': item.proposer_priority,
              'VotingPower': item.voting_power,
              'flProposer': item.is_proposer,
              'isTooltip': item.moniker.length > this.cutNumber,
            }
          })
        }
      } catch (e) {
        console.error(e);

      }
    },
    pageChangeValidatorSet(pageNum) {
      this.validatorSetPageNum = pageNum;
      this.getValidatorSetList()
    }
  }
}
</script>

<style scoped lang="scss">
.block_detail_container {
  a {
    color: $t_link_c !important;
  }

  padding: 0 0.15rem;

  .block_detail_content_wrap {
    max-width: 12rem;
    margin: 0 auto;

    .block_detail_header_content {
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      padding-left: 0.2rem;

      .block_height_content {
        .information_value {
          font-size: $s22;
          color: $t_second_c;
          margin: 0 0.07rem;
        }

        .flag_item_left {
          display: inline-block;
          font-size: $s20;
          margin-right: 0.05rem;
          cursor: pointer;
          color: $t_link_c !important;
        }

        .flag_item_left_disabled {
          display: inline-block;
          font-size: $s20;
          margin-right: 0.05rem;
          cursor: pointer;
          color: $t_second_c;
        }

        .flag_item_right {
          display: inline-block;
          font-size: $s20;
          margin-left: 0.05rem;
          color: $t_link_c;
          cursor: pointer;
        }

        .flag_item_right_disabled {
          display: inline-block;
          font-size: $s20;
          color: $t_second_c;
          margin-left: 0.05rem;
          cursor: pointer;
        }
      }
    }

    .block_detail_content {
      padding: 0.2rem;
      box-sizing: border-box;
      background: $bg_white_c;

      .block_information_item {
        display: flex;
        margin-bottom: 0.16rem;

        span:nth-of-type(1) {
          text-align: left;
          color: $t_second_c;
          font-size: $s14;
          min-width: 1.5rem;
        }

        span:nth-of-type(2) {
          text-align: left;
          color: $t_first_c;
          font-size: $s14;
          flex: 1;

          .common_link_style {
            color: $theme_c !important;
          }
        }
      }

      .block_information_item:last-child {
        margin-bottom: 0;
      }
    }

    .block_transaction_content {
      .block_transaction_title_content {
        font-size: $s18;
        font-weight: bold;
        margin: 0.3rem 0 0.1rem 0;
        text-align: left;
        text-indent: 0.2rem;
      }

      .tx_transaction_content_hash {
        display: flex;
        align-items: center;
      }

      ::v-deep .cell {
        padding: 0 0.04rem;
      }
    }

    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }

    .block_validator_set_container {
      margin: 0.1rem 0rem 0.2rem 0rem;
      padding-bottom: 0.01rem;

      .block_validator_set_title {
        height: 0.45rem;
        display: flex;
        align-items: center;
        font-size: $s18;
        font-weight: bold;
        padding-left: 0.2rem;
        color: $t_first_c
      }

      .block_validator_set_content {
        background: $bg_white_c;
        overflow-x: auto;
        overflow-y: hidden;

        .table {
          color: $t_second_c;

          .moniker_conent {
            display: flex;

            .proposer_img_content {
              width: 0.13rem;
              margin-right: 0.06rem;
              display: flex;
              align-items: center;

              img {
                width: 100%;
              }
            }
          }
        }

        .no_data_show {
          display: flex;
          min-height: 2rem;

          img {
            width: 1.5rem;
          }
        }

        ::v-deep .m-table-header {
          width: 12rem !important;
        }

        ::v-deep table.m_table {
          min-width: 12rem !important;
          text-align: left;
        }

      }

      .pagination {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}


@media screen and (max-width: 768px) {
  .block_detail_container {
    .block_detail_content_wrap {
      .block_detail_header_content {
        .block_height_content {
          .information_value {

          }

          .flag_item_left {

          }

          .flag_item_left_disabled {

          }

          .flag_item_right {

          }

          .flag_item_right_disabled {

          }
        }
      }

      .block_detail_content {

        .block_information_item {
          word-break: break-all;

          span:nth-of-type(1) {
            min-width: 1rem;
          }

          span:nth-of-type(2) {

          }
        }

        .block_information_item:last-child {

        }
      }

      .block_transaction_content {
        .block_transaction_title_content {

        }
      }
    }
  }
}
</style>
