<template>
  <div class="address_info_container">
    <address-information-component
      :address="address"
      :data="assetsItems"
      :isProfiler="isProfiler"
    />
    <div class="delegations_wrap">
      <div class="delegations_container">
        <!-- Delegations -->
        <div class="one_table_container">
          <p class="validator_information_content_title">
            {{ $t('ExplorerLang.validatorDetail.delegationsTitle') }}
            <span v-show="totalDelegatorValue" class="address_information_delegation_value">{{
              totalDelegatorValue
            }}</span>
          </p>
          <div class="delegations_table_container">
            <el-table
              :data="delegationsItems"
              :empty-text="$t('ExplorerLang.table.emptyDescription')"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('ExplorerLang.table.address')"
                :min-width="ColumnMinWidth.address"
                class-name="address"
                prop="address"
              >
                <template v-slot:default="{ row }">
                  <el-tooltip :content="`${row.address}`">
                    <span
                      v-if="row.moniker"
                      class="address_link"
                      @click="addressRoute(row.address)"
                    >
                      {{ formatMoniker(row.moniker, monikerNum.otherTable) }}
                    </span>
                    <span
                      v-if="!row.moniker"
                      class="address_link"
                      style="font-family: Arial"
                      @click="addressRoute(row.address)"
                    >
                      {{ formatAddress(row.address) }}
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.amount')"
                :min-width="ColumnMinWidth.ownerDetailDelegationsAmount"
                align="right"
                prop="amount"
              >
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.amount') }}</span>
                  <el-tooltip :content="mainTokenSymbol" placement="top">
                    <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.shares')"
                :min-width="ColumnMinWidth.shares"
                align="left"
                prop="shares"
              ></el-table-column>
              <!-- <el-table-column prop="block" :label="$t('ExplorerLang.table.block')" min-width="100">
													<template v-slot:default="{ row }">
													<router-link style="font-family: Arial;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
													</template>
												</el-table-column> -->
            </el-table>
          </div>
          <m-pagination
            v-if="flDelegationNextPage"
            :page="delegationCurrentPage"
            :page-change="delegationPageChange"
            :page-size="tablePageSize"
            :total="delegationCountNum"
          ></m-pagination>
        </div>
        <!-- Unbonding Delegations -->
        <div class="second_table_container">
          <p class="validator_information_content_title">
            {{ $t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}
            <span
              v-show="totalUnBondingDelegatorValue"
              class="address_information_unbonding_delegation_value"
              >{{ totalUnBondingDelegatorValue }}</span
            >
          </p>
          <div class="delegations_table_container">
            <el-table
              :data="unBondingDelegationsItems"
              :empty-text="$t('ExplorerLang.table.emptyDescription')"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('ExplorerLang.table.address')"
                :min-width="ColumnMinWidth.address"
                class-name="address"
                prop="address"
              >
                <template v-slot:default="{ row }">
                  <el-tooltip :content="`${row.address}`">
                    <span
                      v-if="row.moniker"
                      class="address_link"
                      @click="addressRoute(row.address)"
                    >
                      {{ formatMoniker(row.moniker, monikerNum.otherTable) }}
                    </span>
                    <span
                      v-if="!row.moniker"
                      class="address_link"
                      style="font-family: Arial"
                      @click="addressRoute(row.address)"
                    >
                      {{ formatAddress(row.address) }}
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.amount')"
                :min-width="ColumnMinWidth.amount"
                prop="amount"
              >
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.amount') }}</span>
                  <el-tooltip :content="mainTokenSymbol" placement="top">
                    <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.block')"
                :min-width="ColumnMinWidth.blockListHeight"
                prop="block"
              >
                <template v-slot:default="{ row }">
                  <router-link
                    :style="{ color: '$theme_c !important' }"
                    :to="'/block/' + row.block"
                    style="font-family: Arial"
                    >{{ row.block }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.endTime')"
                :min-width="ColumnMinWidth.time"
                prop="endTime"
              ></el-table-column>
            </el-table>
          </div>
          <m-pagination
            v-if="flUnBondingDelegationNextPage"
            :page="unBondingDelegationCurrentPage"
            :page-change="unBondingDelegationPageChange"
            :page-size="tablePageSize"
            :total="unBondingDelegationCountNum"
          ></m-pagination>
        </div>
      </div>
    </div>
    <!-- Delegator Rewards 标题 -->
    <div class="address_information_redelegation_header_title">
      {{ $t('ExplorerLang.addressInformation.delegatorRewards.title') }}
      <span
        v-show="totalDelegatorRewardValue"
        class="address_information_redelegation_rewards_value"
        >{{ totalDelegatorRewardValue }}</span
      >
    </div>
    <div class="address_information_redelegation_tx_container">
      <div class="address_information_delegator_rewards_content">
        <!-- Withdraw To: -->
        <div class="address_information_detail_option">
          <span class="address_information_detail_option_name"
            >{{ $t('ExplorerLang.addressInformation.delegatorRewards.withdrawTo') }}:</span
          >
          <span class="address_information_detail_option_value">
            <router-link
              v-if="withdrewToAddress !== $route.params.param"
              :to="`/address/${withdrewToAddress}`"
              >{{ withdrewToAddress }}</router-link
            >
            <span v-if="withdrewToAddress === $route.params.param">{{ withdrewToAddress }}</span>
          </span>
        </div>
        <!-- Delegator Rewards 的表格 -->
        <div class="address_information_list_content">
          <div>
            <el-table
              :data="rewardsItems"
              :empty-text="$t('ExplorerLang.table.emptyDescription')"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('ExplorerLang.table.address')"
                :min-width="ColumnMinWidth.address"
                align="left"
                class-name="address"
                prop="address"
              >
                <template v-slot:default="{ row }">
                  <el-tooltip :content="`${row.address}`">
                    <router-link
                      v-if="row.moniker"
                      :to="`/staking/${row.address}`"
                      class="address_link"
                    >
                      {{ formatMoniker(row.moniker, monikerNum.otherTable) }}
                    </router-link>
                    <router-link
                      v-if="!row.moniker"
                      :to="`/staking/${row.address}`"
                      class="address_link"
                      style="font-family: Arial"
                    >
                      {{ formatAddress(row.address) }}
                    </router-link>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('ExplorerLang.table.amount')"
                :min-width="ColumnMinWidth.amount"
                align="right"
                prop="amount"
              >
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.amount') }}</span>
                  <el-tooltip :content="mainTokenSymbol" placement="top">
                    <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 换页 -->
        <div v-if="flRewardsDelegationNextPage" class="pagination_content">
          <keep-alive>
            <m-pagination
              :page="rewardsDelegationCurrentPage"
              :page-change="rewardsDelegationPageChange"
              :page-size="pageSize"
              :total="rewardsDelegationCountNum"
            ></m-pagination>
          </keep-alive>
        </div>
      </div>
      <!-- Validator Rewards -->
      <div
        :class="OperatorAddress !== '--' ? '' : 'hide_style'"
        :style="{
          visibility: OperatorAddress && OperatorAddress !== '--' ? 'visible' : 'hidden',
        }"
        class="address_information_detail_container"
      >
        <!-- 标题 -->
        <div class="address_information_redelegation_title">
          {{ $t('ExplorerLang.addressInformation.validatorRewards.title') }}
          <span
            v-show="totalValidatorRewards"
            class="address_information_validator_rewards_value"
            >{{ totalValidatorRewards }}</span
          >
        </div>
        <!-- 需展示的数据 -->
        <ul class="address_information_detail_content">
          <li class="address_information_detail_option">
            <span class="address_information_detail_option_name"
              >{{ $t('ExplorerLang.addressInformation.validatorRewards.validatorMoniker') }}:</span
            >
            <div class="validator_status_content">
              <span class="address_information_detail_option_value">
                <router-link
                  v-show="OperatorAddress !== '--' && validatorMoniker !== '--'"
                  :to="`/staking/${OperatorAddress}`"
                  >{{ validatorMoniker }}</router-link
                >
                <span v-show="OperatorAddress === '--' || validatorMoniker === '--'">{{
                  validatorMoniker
                }}</span>
              </span>
              <span
                v-if="validatorStatus === 'active'"
                class="address_information_address_status_active"
                >{{ $t('ExplorerLang.staking.status.active') }}</span
              >
              <span
                v-if="validatorStatus === 'candidate'"
                class="address_information_address_status_candidate"
                >{{ $t('ExplorerLang.staking.status.candidate') }}</span
              >
              <span
                v-if="validatorStatus === 'jailed'"
                class="address_information_address_status_jailed"
                >{{ $t('ExplorerLang.staking.status.jailed') }}</span
              >
            </div>
          </li>
          <li class="address_information_detail_option" style="margin-top: 0.05rem">
            <span class="address_information_detail_option_name"
              >{{ $t('ExplorerLang.addressInformation.validatorRewards.operatorAddress') }}:</span
            >
            <span class="address_information_detail_option_value">
              <router-link v-show="OperatorAddress !== '--'" :to="`/staking/${OperatorAddress}`">{{
                OperatorAddress
              }}</router-link>
              <span v-show="OperatorAddress === '--'">{{ OperatorAddress }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAddressInformationApi,
  getDelegationListApi,
  getIbcTransferByHash,
  getRewardsItemsApi,
  getUnBondingDelegationListApi,
  getValidatorRewardsApi,
} from '@/service/api';
import { addressRoute, converCoin, formatMoniker, getMainToken } from '@/helper/IritaHelper';
import Tools from '@/util/Tools';
import { ibcDenomPrefix, monikerNum, ColumnMinWidth } from '@/constant';
import AddressInformationComponent from '@/components/AddressInformationComponent';
import BigNumber from 'bignumber.js';
import moveDecimal from 'move-decimal-point';

export default {
  name: 'AssetsTabOptions',
  components: { AddressInformationComponent },
  data() {
    return {
      address: '',
      assetsItems: [],
      isProfiler: false,
      totalDelegatorValue: 0,
      delegationsItems: [],
      ColumnMinWidth,
      addressRoute,
      formatMoniker,
      mainTokenSymbol: '',
      flDelegationNextPage: false,
      flUnBondingDelegationNextPage: false,
      flRewardsDelegationNextPage: false,
      tablePageSize: 5,
      unBondingDelegationCountNum: 0,
      unBondingDelegationCurrentPage: 1,
      delegationCurrentPage: 1,
      delegationCountNum: 0,
      totalUnBondingDelegator: 0,
      totalUnBondingDelegatorValue: 0,
      unBondingDelegationsItems: [],
      totalDelegatorRewardValue: 0,
      withdrewToAddress: '',
      rewardsItems: [],
      pageSize: 5,
      rewardsDelegationCountNum: 0,
      rewardsDelegationCurrentPage: 1,
      OperatorAddress: '',
      totalValidatorRewards: 0,
      validatorMoniker: '',
      validatorStatus: '',
      fixedNumber: 2, // 展示2位小数
      computerNumber: 5, // 计算保留5位小数
      monikerNum,
      delegatorRewardsValue: 0,
      validatorRewardsValue: 0,
    };
  },
  created() {
    this.address = this.$route.params.param;
    this.getAddressInformation();
    this.getRewardsItems();
    this.getAssetList();
    this.getDelegationList();
    this.getUnBondingDelegationList();
    this.setMainToken();
    this.getAddressMainToken();
  },
  mounted() {},
  watch: {
    totalDelegator() {
      this.getAssetList();
    },
    totalDelegatorReward(totalDelegatorReward) {
      this.getAssetList();
    },
    totalUnBondingDelegator(totalDelegatorReward) {
      this.getAssetList();
    },
    OperatorAddress() {
      this.getValidatorRewards();
    },
  },
  methods: {
    async getAddressMainToken() {
      this.mainToken = await getMainToken();
    },
    async rewardsDelegationPageChange(pageNums) {
      const pageNum = pageNums - 1;
      this.rewardsItems = [];
      const data = this.flRewardsDelegationNextPage
        ? this.rewardsDelegationPageNationArrayData[pageNum]
        : this.rewardsDelegationPageNationArrayData;
      for (const item of data) {
        if (item.reward && item.reward.length > 0) {
          const amount = await converCoin(item.reward[0]);
          item.reward[0].amount = amount.amount;
        }
        this.rewardsItems.push({
          address: item.validator_address,
          // amount: `${Tools.formatStringToFixedNumber(new BigNumber(item.reward[0].amount).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`,
          amount: `${Tools.formatStringToFixedNumber(
            new BigNumber(item.reward[0].amount).toFormat(),
            this.fixedNumber
          )}`,
          moniker: item.moniker,
        });
      }
    },
    async delegationPageChange(pageNums) {
      const pageNum = pageNums - 1;
      this.delegationsItems = [];
      const data = this.flDelegationNextPage
        ? this.delegationPageNationArrayData[pageNum]
        : this.delegationPageNationArrayData;
      for (const item of data) {
        const amount = await converCoin(item.amount);
        this.delegationsItems.push({
          address: item.address,
          // amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)} ${amount.denom.toUpperCase()}`,
          amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)}`,
          shares: new BigNumber(Number(item.shares).toFixed(2)).toFormat(),
          block: item.height,
          moniker: item.moniker,
        });
      }
    },
    async unBondingDelegationPageChange(pageNums) {
      const pageNum = pageNums - 1;
      this.unBondingDelegationsItems = [];
      const data = this.flUnBondingDelegationNextPage
        ? this.unBondingDelegationPageNationArrayData[pageNum]
        : this.unBondingDelegationPageNationArrayData;
      for (const item of data) {
        const amount = await converCoin(item.amount);
        this.unBondingDelegationsItems.push({
          address: item.address,
          // amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)} ${amount.denom.toUpperCase()}`,
          amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)}`,
          block: item.height,
          // endTime: Tools.format2UTC(item.end_time),
          endTime: Tools.getFormatDate(new Date(item.end_time).getTime()),
          moniker: item.moniker,
        });
      }
    },
    async setMainToken() {
      const mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
    },
    async getAddressInformation() {
      try {
        const res = await getAddressInformationApi(this.$route.params.param);
        if (res) {
          let arrayIndexOneData;
          if (res.amount) {
            res.amount.forEach((item) => {
              if (item?.denom === this.mainToken?.denom) {
                arrayIndexOneData = item;
              }
            });
            if (arrayIndexOneData) {
              res.amount.unshift(arrayIndexOneData);
            }
            res.amount = Array.from(new Set(res.amount));
            this.assetList = res.amount;
          }
          this.validatorMoniker = res.moniker ? res.moniker : '--';
          this.OperatorAddress = res.operator_address ? res.operator_address : '--';
          this.validatorStatus = res.status;
          this.withdrewToAddress = res.withdrawAddress ? res.withdrawAddress : '--';
          this.isProfiler = res.isProfiler;
          this.getAssetList();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getRewardsItems() {
      const res = await getRewardsItemsApi(this.$route.params.param);
      try {
        if (res && res.rewards && res.rewards.length > 0) {
          res.rewards.map((item) => {
            if (item.reward && item.reward.length === 0) {
              item.reward.push({
                amount: 0,
                denom: this.mainToken.denom,
              });
            }
          });
          const copyResult = JSON.parse(JSON.stringify(res));
          const amount = await converCoin((res.total || [])[0]);
          this.delegatorRewardsValue = res.total ? amount.amount : 0;
          this.totalDelegatorReward = amount.amount;
          this.rewardsDelegationPageNationArrayData = this.pageNation(copyResult.rewards);
          if (res.rewards.length > this.pageSize) {
            this.flRewardsDelegationNextPage = true;
          } else {
            this.flRewardsDelegationNextPage = false;
          }
          this.rewardsDelegationCountNum = res.rewards.length;
          this.rewardsDelegationPageChange(this.rewardsDelegationCurrentPage);
          this.totalDelegatorRewardValue = `${Tools.formatStringToFixedNumber(
            new BigNumber(moveDecimal(this.totalDelegatorReward.toString(), 0)).toFormat(),
            this.fixedNumber
          )} ${this.mainToken.symbol.toUpperCase()}`;
          this.allRewardsAmountValue =
            Number(this.delegatorRewardsValue) + Number(this.validatorRewardsValue);
          this.allRewardsValue = `${Tools.formatStringToFixedNumber(
            new BigNumber(this.allRewardsAmountValue.toString()).toFormat(),
            this.fixedNumber
          )} ${this.mainToken.symbol.toUpperCase()}`;
          this.getAssetList();
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getValidatorRewards() {
      try {
        if (this.OperatorAddress && this.OperatorAddress !== '--') {
          const data = await getValidatorRewardsApi(this.OperatorAddress);
          if (data) {
            const commission =
              data.val_commission &&
              data.val_commission.commission &&
              data.val_commission.commission[0];
            if (commission) {
              const amount = await converCoin(commission);
              this.validatorRewardsValue = amount.amount;
              // this.totalValidatorRewards = `${ Number(amount.amount).toFixed(2)} ${this.mainToken.symbol.toUpperCase()}` || '--'
              this.totalValidatorRewards =
                `${Tools.formatStringToFixedNumber(
                  new BigNumber(amount.amount.toString()).toFormat(),
                  this.fixedNumber
                )} ${this.mainToken.symbol.toUpperCase()}` || '--';
              this.allRewardsAmountValue =
                Number(this.delegatorRewardsValue) + Number(amount.amount);
            } else {
              this.totalValidatorRewards = '--';
            }
            this.allRewardsValue = `${Tools.formatStringToFixedNumber(
              this.allRewardsAmountValue.toString(),
              this.fixedNumber
            )} ${this.mainToken.symbol.toUpperCase()}`;
            this.getAssetList();
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getAssetList() {
      const assetList = [];
      const balanceAmountsArr = [];
      // console.time('amount')
      for (const key in this.assetList) {
        const item = this.assetList[key];
        balanceAmountsArr.push(item && item.amount ? converCoin(item) : {});
      }
      const balanceAmounts = await Promise.all(balanceAmountsArr);
      for (const key in this.assetList) {
        const item = this.assetList[key];
        // let balanceAmount = item && item.amount ? await converCoin(item) : {};
        const balanceAmount = balanceAmounts[key];
        if (item && item.denom && item.denom === this.mainToken.denom) {
          assetList.unshift({
            token: this.mainToken.symbol.toUpperCase(),
            balance:
              balanceAmount && balanceAmount.amount
                ? `${new BigNumber(
                    Tools.formatStringToFixedNumber(balanceAmount.amount, this.fixedNumber)
                  ).toFormat()} ${balanceAmount.denom.toUpperCase()}`
                : 0,
            balanceNumber: balanceAmount.amount,
            delegatedValue: this.totalDelegator ? this.totalDelegator : 0,
            delegated: this.totalDelegator
              ? `${Tools.formatStringToFixedNumber(
                  new BigNumber(this.totalDelegator).toFormat(),
                  this.fixedNumber
                )} ${this.mainToken.symbol.toUpperCase()}`
              : 0,
            unBondingValue: this.totalUnBondingDelegator ? this.totalUnBondingDelegator : 0,
            unBonding: this.totalUnBondingDelegator
              ? `${Tools.formatStringToFixedNumber(
                  new BigNumber(this.totalUnBondingDelegator).toFormat(),
                  this.fixedNumber
                )} ${this.mainToken.symbol.toUpperCase()}`
              : 0,
            rewards: this.allRewardsValue
              ? `${Tools.formatStringToFixedNumber(
                  new BigNumber(this.allRewardsAmountValue).toFormat(),
                  this.fixedNumber
                )} ${this.mainToken.symbol.toUpperCase()}`
              : 0,
            rewardsValue: this.allRewardsAmountValue ? this.allRewardsAmountValue : 0,
            totalAmount: `${Tools.formatStringToFixedNumber(
              new BigNumber(
                (
                  Number(
                    Tools.formatStringToFixedNumber(
                      balanceAmount.amount?.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.totalDelegator?.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.totalUnBondingDelegator?.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.allRewardsAmountValue?.toString(),
                      this.computerNumber
                    )
                  )
                )?.toString()
              ).toFormat(),
              this.fixedNumber
            )} ${this.mainToken.symbol?.toUpperCase()}`,
          });
        } else if (balanceAmount && balanceAmount.denom) {
          let { denom } = balanceAmount;
          if (denom.startsWith(ibcDenomPrefix)) {
            const hash = denom.replace(ibcDenomPrefix, '');
            const res = await getIbcTransferByHash(hash).catch((error) => {
              console.error(error);
            });
            if (res && res.denom_trace && res.denom_trace.base_denom) {
              denom = (ibcDenomPrefix + res.denom_trace.base_denom).toUpperCase();
            }
          }
          assetList.push({
            token: item.denom.toUpperCase(),
            balance: balanceAmount.amount
              ? `${new BigNumber(balanceAmount.amount).toFormat()} ${denom.toUpperCase()}`
              : 0,
            delegated: 0,
            unBonding: 0,
            rewards: 0,
            totalAmount: balanceAmount.amount
              ? `${new BigNumber(
                  balanceAmount.amount
                ).toFormat()} ${balanceAmount.denom.toUpperCase()}`
              : 0,
          });
        }
      }
      this.assetsItems = assetList;
      //  console.timeEnd('amount')
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
    async getUnBondingDelegationList() {
      try {
        const { data: res, count } = await getUnBondingDelegationListApi(
          this.$route.params.param,
          1,
          1000
        );
        if (res && res.length > 0) {
          this.unBondingDelegationCountNum = count;
          const copyResult = JSON.parse(JSON.stringify(res));
          this.unBondingDelegationPageNationArrayData = this.pageNation(copyResult);
          if (res.length > this.pageSize) {
            this.flUnBondingDelegationNextPage = true;
          } else {
            this.flUnBondingDelegationNextPage = false;
          }
          this.unBondingDelegationPageChange(this.unBondingDelegationCurrentPage);
          if (res.length > 0) {
            // res.forEach(async (item) => {
            // 	if (item.amount && item.amount.amount) {
            // 		let amount = await converCoin(item.amount)
            // 		item.amount.amount = amount.amount
            // 	}
            // });
            let totalUnBondingDelegator = res.reduce((total, item) => {
              return Number(item.amount.amount) + Number(total);
            }, 0);
            totalUnBondingDelegator = await converCoin({
              amount: totalUnBondingDelegator,
              denom: res[0].amount.denom,
            });
            this.totalUnBondingDelegator = totalUnBondingDelegator.amount;
          }
          this.totalUnBondingDelegatorValue = `${Tools.formatStringToFixedNumber(
            new BigNumber(this.totalUnBondingDelegator.toString()).toFormat(),
            this.fixedNumber
          )} ${this.mainToken.symbol.toUpperCase()}`;
        } else {
          this.unBondingDelegationCountNum = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address) || '--';
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
