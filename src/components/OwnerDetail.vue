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
      <div v-if="moduleSupport('107', prodConfig.navFuncList)" v-show="isAsset">
        <!-- 地址详情 -->
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
                <span class="address_information_delegation_value" v-show="totalDelegatorValue">{{
                  totalDelegatorValue
                }}</span>
              </p>
              <div class="delegations_table_container">
                <el-table
                  :empty-text="$t('ExplorerLang.table.emptyDescription')"
                  :data="delegationsItems"
                  style="width: 100%"
                >
                  <el-table-column
                    class-name="address"
                    prop="address"
                    :label="$t('ExplorerLang.table.address')"
                    :min-width="ColumnMinWidth.address"
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
                          style="font-family: Arial"
                          class="address_link"
                          @click="addressRoute(row.address)"
                        >
                          {{ formatAddress(row.address) }}
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    :label="$t('ExplorerLang.table.amount')"
                    align="right"
                    :min-width="ColumnMinWidth.ownerDetailDelegationsAmount"
                  >
                    <template slot="header" slot-scope="scope">
                      <span>{{ $t('ExplorerLang.table.amount') }}</span>
                      <el-tooltip :content="mainTokenSymbol" placement="top">
                        <i class="iconfont iconyiwen yiwen_icon" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="shares"
                    :label="$t('ExplorerLang.table.shares')"
                    align="left"
                    :min-width="ColumnMinWidth.shares"
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
                :page-size="tablePageSize"
                :total="delegationCountNum"
                :page-change="delegationPageChange"
              ></m-pagination>
            </div>
            <!-- Unbonding Delegations -->
            <div class="second_table_container">
              <p class="validator_information_content_title">
                {{ $t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}
                <span
                  class="address_information_unbonding_delegation_value"
                  v-show="totalUnBondingDelegatorValue"
                  >{{ totalUnBondingDelegatorValue }}</span
                >
              </p>
              <div class="delegations_table_container">
                <el-table
                  :empty-text="$t('ExplorerLang.table.emptyDescription')"
                  :data="unBondingDelegationsItems"
                  style="width: 100%"
                >
                  <el-table-column
                    class-name="address"
                    prop="address"
                    :label="$t('ExplorerLang.table.address')"
                    :min-width="ColumnMinWidth.address"
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
                          style="font-family: Arial"
                          class="address_link"
                          @click="addressRoute(row.address)"
                        >
                          {{ formatAddress(row.address) }}
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    :label="$t('ExplorerLang.table.amount')"
                    :min-width="ColumnMinWidth.amount"
                  >
                    <template slot="header" slot-scope="scope">
                      <span>{{ $t('ExplorerLang.table.amount') }}</span>
                      <el-tooltip :content="mainTokenSymbol" placement="top">
                        <i class="iconfont iconyiwen yiwen_icon" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="block"
                    :label="$t('ExplorerLang.table.block')"
                    :min-width="ColumnMinWidth.blockListHeight"
                  >
                    <template v-slot:default="{ row }">
                      <router-link
                        style="font-family: Arial"
                        :to="'/block/' + row.block"
                        :style="{ color: '$theme_c !important' }"
                        >{{ row.block }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    :label="$t('ExplorerLang.table.endTime')"
                    :min-width="ColumnMinWidth.time"
                  ></el-table-column>
                </el-table>
              </div>
              <m-pagination
                v-if="flUnBondingDelegationNextPage"
                :page-size="tablePageSize"
                :total="unBondingDelegationCountNum"
                :page="unBondingDelegationCurrentPage"
                :page-change="unBondingDelegationPageChange"
              ></m-pagination>
            </div>
          </div>
        </div>
        <!-- Delegator Rewards 标题 -->
        <div class="address_information_redelegation_header_title">
          {{ $t('ExplorerLang.addressInformation.delegatorRewards.title') }}
          <span
            class="address_information_redelegation_rewards_value"
            v-show="totalDelegatorRewardValue"
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
                <span v-if="withdrewToAddress === $route.params.param">{{
                  withdrewToAddress
                }}</span>
              </span>
            </div>
            <!-- Delegator Rewards 的表格 -->
            <div class="address_information_list_content">
              <div>
                <el-table
                  :empty-text="$t('ExplorerLang.table.emptyDescription')"
                  :data="rewardsItems"
                  style="width: 100%"
                >
                  <el-table-column
                    class-name="address"
                    prop="address"
                    :label="$t('ExplorerLang.table.address')"
                    align="left"
                    :min-width="ColumnMinWidth.address"
                  >
                    <template v-slot:default="{ row }">
                      <el-tooltip :content="`${row.address}`">
                        <router-link
                          v-if="row.moniker"
                          class="address_link"
                          :to="`/staking/${row.address}`"
                        >
                          {{ formatMoniker(row.moniker, monikerNum.otherTable) }}
                        </router-link>
                        <router-link
                          v-if="!row.moniker"
                          style="font-family: Arial"
                          class="address_link"
                          :to="`/staking/${row.address}`"
                        >
                          {{ formatAddress(row.address) }}
                        </router-link>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    :label="$t('ExplorerLang.table.amount')"
                    align="right"
                    :min-width="ColumnMinWidth.amount"
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
            <div class="pagination_content" v-if="flRewardsDelegationNextPage">
              <keep-alive>
                <m-pagination
                  :page-size="pageSize"
                  :total="rewardsDelegationCountNum"
                  :page="rewardsDelegationCurrentPage"
                  :page-change="rewardsDelegationPageChange"
                ></m-pagination>
              </keep-alive>
            </div>
          </div>
          <!-- Validator Rewards -->
          <div
            class="address_information_detail_container"
            :class="OperatorAddress !== '--' ? '' : 'hide_style'"
            :style="{
              visibility: OperatorAddress && OperatorAddress !== '--' ? 'visible' : 'hidden',
            }"
          >
            <!-- 标题 -->
            <div class="address_information_redelegation_title">
              {{ $t('ExplorerLang.addressInformation.validatorRewards.title') }}
              <span
                class="address_information_validator_rewards_value"
                v-show="totalValidatorRewards"
                >{{ totalValidatorRewards }}</span
              >
            </div>
            <!-- 需展示的数据 -->
            <ul class="address_information_detail_content">
              <li class="address_information_detail_option">
                <span class="address_information_detail_option_name"
                  >{{
                    $t('ExplorerLang.addressInformation.validatorRewards.validatorMoniker')
                  }}:</span
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
                    class="address_information_address_status_active"
                    v-if="validatorStatus === 'active'"
                    >{{ $t('ExplorerLang.staking.status.active') }}</span
                  >
                  <span
                    class="address_information_address_status_candidate"
                    v-if="validatorStatus === 'candidate'"
                    >{{ $t('ExplorerLang.staking.status.candidate') }}</span
                  >
                  <span
                    class="address_information_address_status_jailed"
                    v-if="validatorStatus === 'jailed'"
                    >{{ $t('ExplorerLang.staking.status.jailed') }}</span
                  >
                </div>
              </li>
              <li class="address_information_detail_option" style="margin-top: 0.05rem">
                <span class="address_information_detail_option_name"
                  >{{
                    $t('ExplorerLang.addressInformation.validatorRewards.operatorAddress')
                  }}:</span
                >
                <span class="address_information_detail_option_value">
                  <router-link
                    v-show="OperatorAddress !== '--'"
                    :to="`/staking/${OperatorAddress}`"
                    >{{ OperatorAddress }}</router-link
                  >
                  <span v-show="OperatorAddress === '--'">{{ OperatorAddress }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        class="address_nft_content"
        v-if="moduleSupport('103', prodConfig.navFuncList)"
        v-show="isNftInfo"
      >
        <!--				<div class="content_title">
                  {{ $t('ExplorerLang.addressDetail.assets') }}
                  <span> {{ this.assetCount }}</span>
                </div>-->
        <list-component
          :is-loading="assetLoading"
          :list-data="assetArray"
          :column-list="assetColumnArray"
          :large-string-min-height="LargeStringMinHeight"
          :large-string-line-height="LargeStringLineHeight"
          :nft-key="nftKey"
          :pagination="{
            pageSize: Number(assetPageSize),
            dataCount: assetCount,
            pageNum: Number(assetPageNum),
          }"
          @pageChange="assetPageChange"
        >
          <template v-slot:txCount>
            <tx-count-component
              :title="
                assetCount > 1
                  ? $t('ExplorerLang.nftAsset.subTitles')
                  : $t('ExplorerLang.nftAsset.subTitle')
              "
              :icon="'iconNFT'"
              :tx-count="assetCount"
            ></tx-count-component>
          </template>
        </list-component>
      </div>

      <div
        class="consumer_transaction_content"
        v-if="moduleSupport('105', prodConfig.navFuncList)"
        v-show="isIservice"
      >
        <div class="content_title">
          {{ $t('ExplorerLang.addressDetail.consumerTitle') }}
        </div>
        <el-table
          class="table"
          :data="consumerTxList"
          row-key="txHash"
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
          :span-method="arraySpanMethod"
        >
          <el-table-column
            :min-width="ColumnMinWidth.serviceName"
            :label="$t('ExplorerLang.table.serviceName')"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="!scope.row.isChildren"
                :content="scope.row.serviceName"
                placement="top"
              >
                <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
                  {{ scope.row.serviceName }}
                </router-link>
              </el-tooltip>
              <span class="serviceNameText" v-if="scope.row.isChildren && scope.row.index == 0">{{
                getRespondCount(scope.row.count)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="tx_type"
            :width="ColumnMinWidth.minTxType"
            :label="$t('ExplorerLang.table.txType')"
            prop="txType"
          ></el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.state"
            :label="$t('ExplorerLang.table.requestStatus')"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.state" class="consumer_transaction_content_available">
                <span
                  class="consumer_transaction_content_available_icon"
                  :style="`background:${getBgColorWithState(scope.row.state)}`"
                ></span>
                <span>{{
                  scope.row.state === 'Running'
                    ? '--'
                    : $t('ExplorerLang.table.' + getContentWithState(scope.row.state))
                }}</span>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.blockListHeight"
            :label="$t('ExplorerLang.table.block')"
          >
            <template slot-scope="scope">
              <router-link :to="`/block/${scope.row.blockHeight}`"
                >{{ scope.row.blockHeight }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            class-name="hash_status"
            :min-width="ColumnMinWidth.addressTxHash"
            :label="$t('ExplorerLang.table.txHash')"
          >
            <template slot-scope="scope">
              <div class="address_transaction_content_hash">
                <div class="status">
                  <img
                    class="status_icon"
                    :src="
                      require(`../assets/${
                        scope.row.status == TX_STATUS.success ? 'success.png' : 'failed.png'
                      }`)
                    "
                  />
                </div>
                <el-tooltip :content="scope.row.txHash" placement="top">
                  <div>
                    <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                      {{ formatTxHash(scope.row.txHash) }}
                    </router-link>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            class-name="requestId"
            :min-width="ColumnMinWidth.requestId"
            :label="$t('ExplorerLang.table.requestId')"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.requestContextId"
                placement="top"
                effect="dark"
                :disabled="Tools.disabled(scope.row.requestContextId)"
              >
                <span>{{ formatAddress(scope.row.requestContextId) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            class-name="address"
            :min-width="ColumnMinWidth.address"
            :label="$t('ExplorerLang.table.provider')"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.txType == TX_TYPE_DISPLAY.respond_service"
                :content="scope.row.provider"
                placement="top"
              >
                <router-link :to="`/address/${scope.row.provider}`">
                  {{ formatAddress(scope.row.provider) }}
                </router-link>
              </el-tooltip>
              <div v-if="scope.row.txType == TX_TYPE_DISPLAY.call_service">
                <el-tooltip
                  v-if="(scope.row.provider || []).length === 1"
                  :content="scope.row.provider[0]"
                  placement="top"
                >
                  <router-link :to="`/address/${scope.row.provider[0]}`">
                    {{ formatAddress(scope.row.provider[0]) }}
                  </router-link>
                </el-tooltip>
                <div class="service_tx_muti_to_container" v-else>
                  <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                    {{ `${scope.row.provider.length} ${$t('ExplorerLang.unit.providers')}` }}
                  </router-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.time"
            :label="$t('ExplorerLang.table.timestamp')"
          >
            <template slot-scope="scope">
              <span>{{ `${scope.row.time}` }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination_content" v-show="consumerTxCount > consumerTxPageSize">
          <m-pagination
            :page-size="consumerTxPageSize"
            :total="consumerTxCount"
            :page="consumerTxPageNum"
            :page-change="consumerTxPageChange"
          >
          </m-pagination>
        </div>
      </div>
      <div
        class="provider_transaction_content"
        v-if="moduleSupport('105', prodConfig.navFuncList)"
        v-show="isIservice"
      >
        <div class="content_title">
          {{ $t('ExplorerLang.addressDetail.providerTitle') }}
        </div>
        <el-table
          class="table"
          :data="providerTxList"
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
        >
          <el-table-column
            :min-width="ColumnMinWidth.serviceName"
            :label="$t('ExplorerLang.table.serviceName')"
          >
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.serviceName" placement="top">
                <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
                  {{ scope.row.serviceName }}
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.respondTimes"
            :label="$t('ExplorerLang.table.respondTimes')"
          >
            <template slot-scope="scope">
              <router-link :to="`/service/respond/${scope.row.serviceName}/${address}`">
                {{ `${scope.row.respond_times} ${$t('ExplorerLang.unit.time')}` }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.available"
            :label="$t('ExplorerLang.table.isAvailable')"
          >
            <template slot-scope="scope">
              <div class="provider_transaction_content_available">
                <span
                  class="provider_transaction_content_available_icon"
                  :style="`background:${scope.row.isAvailable ? '#B1E96E' : '#C4C4C4'}`"
                ></span>
                <span class="provider_transaction_content_available_status">{{
                  scope.row.isAvailable
                }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :min-width="ColumnMinWidth.price" :label="$t('ExplorerLang.table.price')">
								  <template slot-scope="scope">
									  <span>{{scope.row.pricing}}</span>
								  </template>
							  </el-table-column>
							  <el-table-column :min-width="ColumnMinWidth.deposit" :label="$t('ExplorerLang.table.deposit')">
								  <template slot-scope="scope">
									  <span>{{scope.row.deposit}}</span>
								  </template>
							  </el-table-column> -->
          <el-table-column
            :min-width="ColumnMinWidth.qos"
            :label="$t('ExplorerLang.table.minBlock')"
          >
            <template slot-scope="scope">
              <span>{{ `${scope.row.qos} ${$t('ExplorerLang.unit.blocks')}` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.time"
            :label="$t('ExplorerLang.table.bindTime')"
          >
            <template slot-scope="scope">
              <span>{{ `${scope.row.time}` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :width="ColumnMinWidth.time"
            :label="$t('ExplorerLang.table.disabledTime')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isAvailable ? '--' : scope.row.unbindTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination_content" v-show="providerTxCount > providerTxPageSize">
          <m-pagination
            :page-size="providerTxPageSize"
            :total="providerTxCount"
            :page="providerTxPageNum"
            :page-change="providerTxPageChange"
          >
          </m-pagination>
        </div>
        <div class="content_title" style="margin-top: 0.4rem">
          {{ $t('ExplorerLang.addressDetail.respondRecord') }}
        </div>
        <el-table
          class="table"
          :data="respondRecordList"
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
        >
          <el-table-column
            :min-width="ColumnMinWidth.serviceName"
            :label="$t('ExplorerLang.table.serviceName')"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.serviceName"
                :content="scope.row.serviceName"
                placement="top"
              >
                <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
                  {{ scope.row.serviceName }}
                </router-link>
              </el-tooltip>
              <span v-if="!scope.row.serviceName">--</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="tx_type"
            :width="ColumnMinWidth.txType"
            :label="$t('ExplorerLang.table.txType')"
            prop="type"
          ></el-table-column>
          <el-table-column
            class-name="hash_status"
            :min-width="ColumnMinWidth.respondHash"
            :label="$t('ExplorerLang.table.respondHash')"
          >
            <template slot-scope="scope">
              <div class="respond_transaction_content_hash">
                <div class="status">
                  <img
                    class="status_icon"
                    :src="
                      require(`../assets/${
                        scope.row.respondStatus == TX_STATUS.success ? 'success.png' : 'failed.png'
                      }`)
                    "
                  />
                </div>
                <el-tooltip :content="scope.row.respondHash" placement="top">
                  <div>
                    <router-link :to="`/tx?txHash=${scope.row.respondHash}`">
                      {{ formatTxHash(scope.row.respondHash) }}
                    </router-link>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            class-name="requestId"
            :min-width="ColumnMinWidth.requestId"
            :label="$t('ExplorerLang.table.requestId')"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.requestContextId"
                placement="top"
                effect="dark"
                :disabled="Tools.disabled(scope.row.requestContextId)"
              >
                <span>{{ formatAddress(scope.row.requestContextId) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.blockListHeight"
            :label="$t('ExplorerLang.table.block')"
          >
            <template slot-scope="scope">
              <router-link :to="`/block/${scope.row.height}`">{{ scope.row.height }}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.time"
            :label="$t('ExplorerLang.table.timestamp')"
            prop="time"
          >
            <template slot-scope="scope">
              <span>{{ Tools.formatLocalTime(scope.row.time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="address"
            :min-width="ColumnMinWidth.address"
            :label="$t('ExplorerLang.table.consumer')"
          >
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.consumer" placement="top">
                <router-link
                  v-if="scope.row.consumer && scope.row.consumer.length"
                  :to="`/address/${scope.row.consumer}`"
                >
                  {{ formatAddress(scope.row.consumer) }}
                </router-link>
              </el-tooltip>
              <span v-if="!scope.row.consumer">--</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="hash_status"
            :min-width="ColumnMinWidth.requestHash"
            :label="$t('ExplorerLang.table.requestHash')"
          >
            <template slot-scope="scope">
              <div class="address_transaction_content_hash">
                <div class="status">
                  <img
                    v-if="scope.row.requestHash && scope.row.requestHash != '--'"
                    class="status_icon"
                    src="../assets/success.png"
                  />
                </div>
                <el-tooltip
                  v-if="scope.row.requestHash && scope.row.requestHash != '--'"
                  :content="scope.row.requestHash"
                  placement="top"
                >
                  <div>
                    <router-link :to="`/tx?txHash=${scope.row.requestHash}`">
                      {{ formatTxHash(scope.row.requestHash) }}
                    </router-link>
                  </div>
                </el-tooltip>
                <span v-else>{{ '--' }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination_content" v-show="respondRecordCount > respondRecordPageSize">
          <m-pagination
            :page-size="respondRecordPageSize"
            :total="respondRecordCount"
            :page="respondRecordPageNum"
            :page-change="respondRecordPageChange"
          >
          </m-pagination>
        </div>
      </div>

      <div
        class="address_content"
        v-if="moduleSupport('106', prodConfig.navFuncList)"
        v-show="isIdentity"
      >
        <div class="content_title">
          {{ $t('ExplorerLang.addressDetail.identities') }}
        </div>
        <el-table
          class="table"
          :data="identityList"
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
        >
          <el-table-column
            :min-width="ColumnMinWidth.identity"
            :label="$t('ExplorerLang.table.identity')"
          >
            <template slot-scope="scope">
              <router-link :to="`/identity/${scope.row.id}`">{{ scope.row.id }}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.txHash"
            :label="$t('ExplorerLang.table.txHash')"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.txHash"
                placement="top"
                :disabled="!Tools.isValid(scope.row.txHash)"
              >
                <router-link :to="`/tx?txHash=${scope.row.txHash}`"
                  >{{ formatTxHash(scope.row.txHash) }}
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="ColumnMinWidth.time"
            :label="$t('ExplorerLang.table.timestamp')"
            prop="time"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.time }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination_content" v-show="identityCount > identityPageSize">
          <m-pagination
            :page-size="identityPageSize"
            :total="identityCount"
            :page="identityPageNum"
            :page-change="identityPageChange"
          >
          </m-pagination>
        </div>
      </div>

      <div v-if="isTx" class="address_transaction_content">
        <!--				<div class="content_title">-->
        <!--					{{ $t("ExplorerLang.addressDetail.txRecord") }}-->
        <!--				</div>-->
        <!--				<div class="address_transaction_condition_container">
					  <span class="address_transaction_condition_count">
						{{ `${totalTxNumber} ${$t("ExplorerLang.unit.Txs")}` }}
					  </span>
					&lt;!&ndash; <el-select popper-class="tooltip" v-model="type_temp" filterable>
								  <el-option v-for="(item, index) in txTypeOption"
											 :key="index"
											 :label="item.label"
											 :value="item.value"></el-option>
							  </el-select> &ndash;&gt;
					<el-cascader popper-class="tooltip" :placeholder="$t('ExplorerLang.common.allTxType')"
								 v-model="txTypeArray" :options="txTypeOption" :props="{ expandTrigger: 'hover' }"
								 :show-all-levels="false" :filterable="true" @change="handleChange"></el-cascader>
					<el-select popper-class="tooltip" v-model="status_temp">
						<el-option v-for="(item, index) in statusOpt" :key="index" :label="item.label"
								   :value="item.value"></el-option>
					</el-select>
					<div class="address_transaction_condition_action">
						<div class="search_btn" @click="handleSearchClick">
							{{ $t("ExplorerLang.transactions.search") }}
						</div>
						<div class="reset_btn" @click="resetFilterCondition">
							<i class="iconfont iconzhongzhi"></i>
						</div>
					</div>
				</div>-->
        <!--				<TxListComponent v-if="address" :txData="txList" :address="address"></TxListComponent>-->
        <list-component
          :is-show-token-type="true"
          :is-loading="isLoading"
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
            <tabs-component
              :tab-list="txTypeOption"
              @onSelectMagType="getFilterTxs"
            ></tabs-component>
          </template>
          <template v-slot:resetButton>
            <tx-reset-button-component
              @resetParams="resetFilterCondition"
            ></tx-reset-button-component>
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
            <!-- todo start -->
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
            <!-- todo end -->
          </template>
        </list-component>
      </div>
      <!-- bsn ddc -->
      <div
        class="address_transaction_content"
        v-if="moduleSupport('117', prodConfig.navFuncList)"
        v-show="isDDC"
      >
        <div class="content_title">
          {{ $t('ExplorerLang.ddc.mainTitle') }}
        </div>
        <list-component
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
          :list-data="ddcList"
          :column-list="ddcListColumn"
          :pagination="{
            pageSize: Number(ddcPageSize),
            dataCount: ddcCount,
            pageNum: Number(ddcPageNum),
          }"
          @pageChange="ddcPageChange"
        />
      </div>
      <!-- energy asset -->
      <div v-if="moduleSupport('116', prodConfig.navFuncList)" v-show="isEnergyAsset">
        <list-component
          :is-loading="isLoading"
          :list-data="energyAssetData"
          :column-list="energyAssetColumn"
          :pagination="{ pageSize: 5, dataCount: 0, pageNum: 1 }"
        >
        </list-component>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addressRoute,
  formatMoniker,
  getConfig,
  converCoin,
  getMainToken,
  getTxType,
} from '@/helper/IritaHelper';
import {
  getNfts,
  getAddressTxList,
  getCallServiceWithAddress,
  getRespondServiceWithAddress,
  getRespondServiceRecord,
  getServiceBindingByServiceName,
  getServiceContextsByServiceName,
  getIdentityListByAddress,
  getAllTxTypes,
  getAddressInformationApi,
  getDelegationListApi,
  getUnBondingDelegationListApi,
  getRewardsItemsApi,
  getValidatorRewardsApi,
  getIbcTransferByHash,
  getDdcList,
  getEnergyAssetApi,
} from '@/service/api';
import BigNumber from 'bignumber.js';
import moveDecimal from 'move-decimal-point';
import AddressSendAndReceiveTx from '@/components/common/AddressSendAndReceiveTx';
import addressDetailNftTabColumnConfig from '@/components/tableListColumnConfig/addressDetailNftTabColumnConfig';
import Tools from '../util/Tools';
import MPagination from './common/MPagination';
import { TxHelper } from '../helper/TxHelper';
import { moduleSupport } from '../helper/ModulesHelper';
import TxListComponent from './common/TxListComponent';
import prodConfig from '../productionConfig';
import Constant, {
  TX_TYPE,
  TX_STATUS,
  ColumnMinWidth,
  monikerNum,
  ibcDenomPrefix,
  decimals,
  UGAS,
} from '../constant';
import AddressInformationComponent from './AddressInformationComponent';
import LargeString from './common/LargeString';
import ListComponent from './common/ListComponent';
import txCommonTable from './tableListColumnConfig/txCommonTable';
import txCommonLatestTable from './tableListColumnConfig/txCommonLatestTable';
import { needAddColumn } from './tableListColumnConfig/allTxTableColumnConfig';
import TabsComponent from './common/TabsComponent';
import { getAmountByTx, getDenomMap, getDenomTheme } from '../helper/txListAmoutHelper';
import TxStatusTabsComponents from './common/TxStatusTabsComponents';
import TxCountComponent from './TxCountComponent';
import MClip from './common/MClip';
import SignerColunmn from './tableListColumnConfig/SignerColunmn';
import TxResetButtonComponent from './common/TxResetButtonComponent';
import ddcListColumnConfig from './tableListColumnConfig/ddcListColumnConfig';
import energyAssetColumn from './tableListColumnConfig/energyAssetColumn';
import { energyAsset, assetInfo, nftCount, ddc, identity, iService, tx } from './ownerDetail/lib';
import TxTypes from '@/helper/TxTypes';

export default {
  name: 'OwnerDetail',
  components: {
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
      addressRoute,
      formatMoniker,
      monikerNum,
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
      isProfiler: false,
      assetsItems: [],
      assetList: [],
      withdrewToAddress: '',
      validatorMoniker: '',
      validatorStatus: '',
      OperatorAddress: '',
      fixedNumber: 2, // 展示2位小数
      computerNumber: 5, // 计算保留5位小数
      totalDelegatorReward: 0,
      totalDelegatorRewardValue: 0,
      totalUnBondingDelegator: 0,
      totalUnBondingDelegatorValue: 0,
      totalDelegator: 0,
      totalDelegatorValue: 0,
      totalValidatorRewards: 0,
      delegatorRewardsValue: 0,
      validatorRewardsValue: 0,
      allRewardsValue: 0,
      allRewardsAmountValue: 0,
      tablePageSize: 5,
      flDelegationNextPage: false,
      flUnBondingDelegationNextPage: false,
      flRewardsDelegationNextPage: false,
      delegationCountNum: 0,
      unBondingDelegationCountNum: 0,
      rewardsDelegationCountNum: 0,
      delegationCurrentPage: 1,
      unBondingDelegationCurrentPage: 1,
      rewardsDelegationCurrentPage: 1,
      delegationsItems: [],
      unBondingDelegationsItems: [],
      rewardsItems: [],
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
      this.getAssetList();
      this.getTxByAddress();
      this.getConsumerTxListCount();
      this.getConsumerTxList();
      this.getRspondRecordListCount();
      this.getRspondRecordList();
      this.getProviderTxListCount();
      this.getProviderTxList();
    },
    totalDelegatorReward(totalDelegatorReward) {
      this.getAssetList();
    },
    totalUnBondingDelegator(totalDelegatorReward) {
      this.getAssetList();
    },
    totalDelegator() {
      this.getAssetList();
    },
    OperatorAddress() {
      this.getValidatorRewards();
    },
  },
  async created() {
    this.mainToken = await getMainToken();
    await this.getConfigTokenData();
  },
  async mounted() {
    this.isShowSendAndReceiveTxComponent = prodConfig.isShowSendAndReceiveTxCount;
    this.txColumnList = txCommonTable.concat(SignerColunmn, txCommonLatestTable);
    this.ddcListColumn = ddcListColumnConfig;
    await this.getTxTypeData();
    document.documentElement.scrollTop = 0;
    this.address = this.$route.params.param;
    this.getTabList();
    this.setMainToken();
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
      this.getTxByAddressCount();
      this.getTxByAddress();
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
        this.getEnergyAssetList();
      }
      if (moduleSupport('107', prodConfig.navFuncList)) {
        this.tabList.push({ ...assetInfo });
        this.getAddressInformation();
        this.getRewardsItems();
        this.getAssetList();
        this.getDelegationList();
        this.getUnBondingDelegationList();
      }
      if (moduleSupport('103', prodConfig.navFuncList)) {
        this.tabList.push({ ...nftCount });
        this.getNftListCount();
        this.getNftList();
      }
      if (moduleSupport('117', prodConfig.navFuncList)) {
        this.tabList.push({ ...ddc });
        this.getDdcListCount();
        this.getDdcList();
      }
      if (moduleSupport('106', prodConfig.navFuncList)) {
        this.tabList.push({ ...identity });
        this.getIdentityListCount();
        this.getIdentityList();
      }
      if (moduleSupport('105', prodConfig.navFuncList)) {
        this.tabList.push({ ...iService });
        this.getRspondRecordListCount();
        this.getRspondRecordList();
        this.getProviderTxListCount();
        this.getProviderTxList();
        this.getConsumerTxListCount();
        this.getConsumerTxList();
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
            default:
              this.isTx = true;
              this.getTxByAddressCount();
              this.getTxByAddress();
              this.getAllTxType();
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
    assetPageChange(pageNum) {
      this.assetPageNum = pageNum;
      this.getNftList();
    },
    async getNftList() {
      try {
        this.assetLoading = true;
        const nftData = await getNfts(
          this.assetPageNum,
          this.assetPageSize,
          false,
          '',
          '',
          this.$route.params.param
        );
        this.assetLoading = false;
        if (nftData && nftData.data) {
          this.assetArray = nftData.data.map((item) => {
            return {
              id: item.nft_id,
              denomName: item.denom_name || item.denom_id,
              denomId: item.denom_id,
              nftName: item.nft_name,
              owner: item.owner,
              tokenData: item.tokenData,
              tokenUri: item.tokenUri,
            };
          });
        }
      } catch (e) {
        this.assetLoading = false;
        console.error(e);
      }
    },
    async getNftListCount() {
      try {
        const nftData = await getNfts(null, null, true, '', '', this.$route.params.param);
        if (nftData?.count) {
          this.assetCount = nftData.count;
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 身份id列表
    identityPageChange(pageNum) {
      this.identityPageNum = pageNum;
      this.getIdentityList();
    },
    async getIdentityList() {
      try {
        const res = await getIdentityListByAddress(
          this.$route.params.param,
          this.identityPageNum,
          this.identityPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.identityList = res.data.map((item) => {
            return {
              id: item.identities_id,
              txHash: item.update_tx_hash || '--',
              time: Tools.formatLocalTime(item.update_block_time) || '--',
            };
          });
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getIdentityListCount() {
      try {
        const res = await getIdentityListByAddress(this.$route.params.param, null, null, true);
        if (res?.count) {
          this.identityCount = res.count;
        } else {
          this.identityCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
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
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
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

    // 地址相关交易记录
    async getTxByAddress() {
      this.isLoading = true;
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
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getTxByAddress();
      this.type
        ? (this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, this.type))
        : (this.txTypeArray = ['']);
      this.status_temp = this.status;
      this.type_temp = this.type;
    },
    // 服务调用-消费者
    async getConsumerTxList() {
      try {
        const res = await getCallServiceWithAddress(
          this.consumerTxPageNum,
          this.consumerTxPageSize,
          false,
          this.$route.params.param
        );
        if (res?.data?.length > 0) {
          this.consumerTxList = [];
          for (const item of res.data) {
            const result = {
              serviceName: item.msgs[0].msg.service_name || '--',
              txHash: item.tx_hash,
              blockHeight: item.height,
              txType: this.TX_TYPE_DISPLAY[item.type],
              provider: item.msgs[0].msg.providers,
              time: Tools.formatLocalTime(item.time),
              state: 'Running',
              status: item.status,
              respond: [],
            };
            item.events.forEach((item) => {
              (item.attributes || []).forEach((attr) => {
                if (attr.key == 'request_context_id') {
                  result.requestContextId = attr.value;
                }
              });
            });
            const context = await this.getContext(result.requestContextId || '');
            if (context && context.result) {
              result.state = context.result.state;
            }
            this.consumerTxList.push(result);
            if (item.respond && item.respond.length) {
              item.respond.forEach((r, index) => {
                const respondResult = {
                  index,
                  isChildren: true,
                  count: item.respond.length,
                  serviceName: (r.msgs[0].msg.ex || {}).service_name || '',
                  txHash: r.tx_hash,
                  blockHeight: r.height,
                  txType: this.TX_TYPE_DISPLAY[r.type],
                  provider: r.msgs[0].msg.provider,
                  time: Tools.formatLocalTime(r.time),
                  requestContextId: (r.msgs[0].msg.ex || {}).request_context_id,
                  requestStatus: '--',
                  status: r.status,
                };
                this.consumerTxList.push(respondResult);
              });
            }
          }
        } else {
          this.consumerTxList = [];
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getContext(requestContextId) {
      try {
        return await getServiceContextsByServiceName(requestContextId);
      } catch (error) {
        console.log(error);
      }
    },
    async getConsumerTxListCount() {
      try {
        const res = await getCallServiceWithAddress(null, null, true, this.$route.params.param);
        if (res?.count) {
          this.consumerTxCount = res.count;
        } else {
          this.consumerTxCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    consumerTxPageChange(pageNum) {
      this.consumerTxPageNum = pageNum;
      this.getConsumerTxList();
    },
    providerTxPageChange(pageNum) {
      this.providerTxPageNum = pageNum;
      this.getProviderTxList();
    },
    // 响应记录
    async getRspondRecordList() {
      try {
        const res = await getRespondServiceRecord(
          '',
          this.$route.params.param,
          this.respondRecordPageNum,
          this.respondRecordPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.respondRecordList = (res.data || []).map((tx) => {
            tx.type = this.TX_TYPE_DISPLAY[tx.type];
            return tx;
          });
        } else {
          this.respondRecordList = [];
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getRspondRecordListCount() {
      try {
        const res = await getRespondServiceRecord('', this.$route.params.param, null, null, true);
        if (res?.count) {
          this.respondRecordCount = res.count;
        } else {
          this.respondRecordCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    respondRecordPageChange(pageNum) {
      this.respondRecordPageNum = pageNum;
      this.getRspondRecordList();
    },
    // 服务调用-提供者
    async getProviderTxList() {
      try {
        const res = await getRespondServiceWithAddress(
          this.$route.params.param,
          this.providerTxPageNum,
          this.providerTxPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.providerTxList = [];
          for (const item of res.data) {
            const result = {
              serviceName: (item.msgs[0].msg.ex || {}).service_name,
              provider: item.msgs[0].msg.provider,
              owner: item.msgs[0].msg.owner,
              respond_times: item.respond_times,
              pricing: JSON.parse(item.msgs[0].msg.pricing || '{}').price,
              qos: item.msgs[0].msg.qos,
              time: Tools.formatLocalTime(item.time),
              unbindTime: item.unbinding_time ? Tools.formatLocalTime(item.unbinding_time) : '--',
              txHash: item.tx_hash,
              blockHeight: item.height,
              txType: item.type,
              status: item.status,
            };
            if (item.msgs[0].msg.deposit && item.msgs[0].msg.deposit.length) {
              result.deposit = `${item.msgs[0].msg.deposit[0].amount} ${item.msgs[0].msg.deposit[0].denom}`;
            }
            const bindings = await getServiceBindingByServiceName(result.serviceName);
            result.isAvailable = this.$t('ExplorerLang.common.false');
            (bindings.result || []).forEach((bind) => {
              if (result.provider === bind.provider && result.owner == bind.owner) {
                result.isAvailable = bind.available
                  ? this.$t('ExplorerLang.common.true')
                  : this.$t('ExplorerLang.common.false');
                result.pricing = JSON.parse(bind.pricing || '{}').price;
                result.qos = bind.qos;
                if (bind.disabled_time) {
                  const time = new Date(bind.disabled_time).getTime();
                  result.unbindTime = time > 0 ? Tools.formatLocalTime(time / 1000) : '--';
                }
              }
            });
            if (result.pricing && result.pricing.length) {
              result.pricing = result.pricing.replace('point', ' point');
            }
            this.providerTxList.push(result);
          }
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getProviderTxListCount() {
      try {
        const res = await getRespondServiceWithAddress(this.$route.params.param, null, null, true);
        if (res?.count) {
          this.providerTxCount = res.count;
        } else {
          this.providerTxCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
      return '--';
    },
    getCallProviders(providers) {
      if (providers && providers.length > 2) {
        return providers.slice(0, 2);
      }
      return providers;
    },
    getContentWithState(state) {
      let content = '';
      switch (state) {
        case 0:
          content = 'running';
          break;
        case 1:
          content = 'paused';
          break;
        case 2:
          content = 'completed';
          break;
      }
      return content;
    },
    getBgColorWithState(state) {
      let bgColor = '';
      switch (state) {
        case 0:
          bgColor = '#B1E96E';
          break;
        case 1:
          bgColor = '#E96E6E';
          break;
        case 2:
          bgColor = '#FFC456';
          break;
      }
      return bgColor;
    },
    arraySpanMethod(table) {
      if (table.columnIndex === 0) {
        if (table.row.isChildren) {
          if (table.row.index == 0) {
            return {
              rowspan: table.row.count,
              colspan: 1,
            };
          }
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    },
    getRespondCount(count) {
      return this.$t('ExplorerLang.unit.totalRespond').replace(/\$\{\%value\%\}/, count);
    },
    handleSearchClick() {
      this.type = this.type_temp;
      this.status = this.status_temp;
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
    async getAddressInformation() {
      try {
        const res = await getAddressInformationApi(this.$route.params.param);
        if (res) {
          let arrayIndexOneData;
          if (res.amount) {
            res.amount.forEach((item) => {
              if (item.denom === this.mainToken.denom) {
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
                      balanceAmount.amount.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.totalDelegator.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.totalUnBondingDelegator.toString(),
                      this.computerNumber
                    )
                  ) +
                  Number(
                    Tools.formatStringToFixedNumber(
                      this.allRewardsAmountValue.toString(),
                      this.computerNumber
                    )
                  )
                ).toString()
              ).toFormat(),
              this.fixedNumber
            )} ${this.mainToken.symbol.toUpperCase()}`,
          });
        } else if (balanceAmount && balanceAmount.denom) {
          let { denom } = balanceAmount;
          if (denom.startsWith(ibcDenomPrefix)) {
            const hash = denom.replace(ibcDenomPrefix, '');
            const res = await getIbcTransferByHash(hash).catch(error => {
							console.error(error)
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
    formatAddress(address) {
      return Tools.formatValidatorAddress(address) || '--';
    },
    handleChange(value) {
      value ? (this.type_temp = value[1] ? value[1] : '') : '';
    },
    async getConfigTokenData() {
      const res = await getConfig();
      this.tokenData = res.tokenData;
    },
    ddcPageChange(pageNum) {
      this.ddcPageNum = pageNum;
      this.getDdcList();
    },
    async getDdcList() {
      try {
        const ddcData = await getDdcList({
          owner: this.$route.params.param,
          ddc_id: '',
          contract_address: '',
          useCount: false,
          pageNum: this.ddcPageNum,
          pageSize: this.ddcPageSize,
        });
        if (ddcData && ddcData.data) {
          this.ddcList = ddcData.data.map((item) => {
            return {
              ddcId: item.ddc_id,
              ddcName: item.ddc_name,
              contractAddr: item.contract_address,
              owner: item.owner,
              creator: item.creator,
              ddcUri: item.ddc_uri || '--',
              Time: Tools.formatLocalTime(item.lastest_tx_time),
            };
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getDdcListCount() {
      try {
        const res = await getDdcList({
          owner: this.$route.params.param,
          ddc_id: '',
          contract_address: '',
          useCount: true,
        });
        if (res?.count) {
          this.ddcCount = res.count;
        } else {
          this.ddcCount = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getEnergyAssetList() {
      this.isLoading = true;
      const res = await getEnergyAssetApi(this.address);
      this.isLoading = false;
      if (res && res.result && res.result.length > 0) {
        const energyItem = res.result.find((item) => item.denom === UGAS);
        this.energyAssetData = [
          {
            title: this.$t('ExplorerLang.table.energy'),
            amount: energyItem?.amount || '--',
          },
        ];
      } else {
        this.energyAssetData = [
          {
            title: this.$t('ExplorerLang.table.energy'),
            amount: '--',
          },
        ];
      }
    },
  },
	beforeDestroy(){
		sessionStorage.removeItem('currentTxModelIndex')
		sessionStorage.removeItem('lastChoiceMsgModelIndex')
		sessionStorage.removeItem('currentChoiceMsgType')
	}
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
      margin-bottom: 0.16rem;

      .address_tab_content {
        display: flex;
        // margin-left: 0.28rem;
        padding-bottom: 0.14rem;

        .address_tab_item {
          cursor: pointer;
          width: 1.2rem;
          height: 0.3rem;
          line-height: 0.3rem;
          border: 0.01rem solid $bd_first_c;
          border-right: none;
          font-size: 0.14rem;
          background-color: $bg_white_c;
        }

        .address_tab_item:first-child {
          border-radius: 0.08rem 0 0 0.08rem;
        }

        .address_tab_item:last-child {
          border-right: 0.01rem solid $bd_first_c;
          border-radius: 0 0.08rem 0.08rem 0;
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

@media screen and (max-width: 1280px) {
  .address_container_content {
    .address_content_wrap {
      .delegations_wrap {
        .delegations_container {
          display: block;

          .one_table_container {
            width: 100%;
          }

          .second_table_container {
            width: 100%;
            margin-left: 0rem;
          }
        }
      }

      .address_information_redelegation_header_title {
        margin-left: 0rem;
      }

      .address_information_redelegation_tx_container {
        flex-direction: column;
        // margin: 0 0.1rem;
        .address_information_delegator_rewards_content {
          width: 100%;
          margin-right: 0;

          .address_information_detail_option {
            padding-left: 0;
            display: flex;

            .address_information_detail_option_value {
              padding-right: 0.1rem;
              word-break: break-word;
            }
          }

          .address_information_list_content {
            overflow-x: auto;
          }
        }

        .address_information_detail_container {
          width: 100%;

          .address_information_redelegation_title {
            padding: 0.2rem 0;
          }

          .address_information_detail_content {
            .address_information_detail_option {
              display: flex;
              align-items: center;
              flex-direction: row;

              .address_information_detail_option_name {
                margin-right: 0.05rem;
              }

              .validator_status_content {
                display: flex;
                margin: 0.05rem 0;
              }

              .address_information_detail_option_value {
                word-break: break-word;
              }
            }
          }
        }

        .hide_style {
          display: none;
        }
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .address_container_content {
    .address_content_wrap {
      .pagination_content {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .address_container_content {
    .address_content_wrap {
      .address_transaction_content {
        .address_transaction_condition_container {
          flex-direction: column;
          align-items: flex-start;

          .address_transaction_condition_count {
            margin-bottom: 0.1rem;
          }

          ::v-deep .el-select {
            width: 100%;
            margin-bottom: 0.1rem;
          }
        }
      }

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
}

@media screen and (max-width: 705px) {
  .address_container_content {
    .address_content_wrap {
      .address_content_title {
        margin-left: 0rem;
      }

      .address_tab_container {
        .address_tab_content {
          margin-left: 0rem;
        }
      }
    }
  }
}

@media screen and (max-width: 551px) {
  .address_container_content {
    .address_content_wrap {
      .address_content_title {
        display: block;
      }

      .address_information_redelegation_tx_container {
        .address_information_delegator_rewards_content {
          .address_information_detail_option {
            display: block;

            .address_information_detail_option_value {
              display: block;
            }
          }
        }

        .address_information_detail_container {
          .address_information_detail_content {
            .address_information_detail_option {
              .address_information_detail_option_name {
                min-width: 1.2rem;
                margin-right: 0.01rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
