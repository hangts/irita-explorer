<template>
	<div class="">
		<div class="vaildtor_detail_container">
			<div class="vaildtor_detail_content">
				<div class="vaildtor_detail_title_container">
					<span>{{ $t('ExplorerLang.validatorDetail.title') }}</span>
				</div>
				<validator-information :validationInformation="validationInformation"
				                       :validatorStatus="validatorStatus"></validator-information>
				<validator-commission-information
						:validationCommissionInfo="validationInformation"></validator-commission-information>
				<div class="delegations_wrap">
					<div class="delegations_container">
						<!-- Delegations -->
						<div class="one_table_container clearfloat">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.delegationsTitle') }}</p>
							<div class="delegations_table_container">
<!--								<el-table :data="delegations.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')" id="element_del">
									<el-table-column class-name="address" prop="address" :label="$t('ExplorerLang.table.address')"
									                 :width="ColumnMinWidth.iaaAddress">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<span
												             @click="addressRoute(row.address)"
															 class="address_link"
												             :style="{ color: '$theme_c !important' }">{{
													formatAddress(row.address) }}
												</span>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" :min-width="ColumnMinWidth.delegationsAmount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.amount')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
									<el-table-column prop="shares" :label="$t('ExplorerLang.table.shares')" align="left"
									                 :min-width="ColumnMinWidth.shares"></el-table-column>
									&lt;!&ndash; 待处理 &ndash;&gt;
									&lt;!&ndash; <el-table-column prop="block" :label="$t('ExplorerLang.table.block')" width="110">
									  <template v-slot:default="{ row }">
										<router-link style="font-family: Arial;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
									  </template>
									</el-table-column> &ndash;&gt;
								</el-table>-->
								<list-component
									:isSmallTable="true"
									:token-symbol="mainTokenSymbol"
									:is-loading="isDelegationLoading"
									:list-data="delegations.items"
									:column-list="validatorDelegationColumn"
									:pagination="{pageSize:Number(pageSize),dataCount:delegations.total,pageNum:Number(1)}"
									@pageChange="(e) => pageChange(e,'getDelegations')"
								></list-component>
							</div>
<!--							<m-pagination v-if="delegations.total > pageSize" :page-size="pageSize"
							              :total="delegations.total"
							              :page-change="pageChange('getDelegations')"></m-pagination>-->
						</div>
						<!-- Unbonding Delegations -->
						<div class="second_table_container clearfloat">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}</p>
							<div class="delegations_table_container" ref="UnbondingDelList">
								<list-component :isSmallTable="true"
												:token-symbol="mainTokenSymbol"
												:is-loading="isUnbondingLoading"
												:list-data="unbondingDelegations.items"
												:column-list="unBondingColumn"
												:pagination=" {pageSize:Number(pageSize),dataCount:unbondingDelegations.total,pageNum:Number(1)} "
												@pageChange="(e) => pageChange(e,'getUnbondingDelegations')"
								></list-component>
<!--								<el-table :data="unbondingDelegations.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')" id="element_undel">
									<el-table-column class-name="address" prop="address" :label="$t('ExplorerLang.table.address')"
									                 :width="ColumnMinWidth.iaaAddress">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<span
												             @click="addressRoute(row.address)"
															 class="address_link"
												             :style="{ color: '$theme_c !important' }">{{
													formatAddress(row.address) }}
												</span>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" :min-width="ColumnMinWidth.amount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.amount')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
									<el-table-column prop="block" :label="$t('ExplorerLang.table.block')" align="left"
									                 :min-width="ColumnMinWidth.blockListHeight">
										<template v-slot:default="{ row }">
											<router-link style="font-family: Arial;"
											             :to="'/block/' + row.block"
											             :style="{ color: '$theme_c !important' }">{{ row.block }}
											</router-link>
										</template>
									</el-table-column>
									<el-table-column prop="end_time" :label="$t('ExplorerLang.table.endTime')"
									                 :width="ColumnMinWidth.time"></el-table-column>
								</el-table>-->
							</div>
<!--							<m-pagination v-if="unbondingDelegations.total > pageSize" :page-size="pageSize"
							              :total="unbondingDelegations.total"
							              :page-change="pageChange('getUnbondingDelegations')"></m-pagination>-->
						</div>
					</div>
				</div>

				<div class="delegations_wrap">
					<div class="delegations_container clearfloat">
						<!-- Deposited Proposals -->
						<div class="one_table_container clearfloat" v-show="depositedProposals.items && depositedProposals.items.length > 0">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.depositedProposalsTitle') }}</p>
							<div class="delegations_table_container">
								<list-component
									:is-small-table="true"
									:token-symbol="mainTokenSymbol"
									:is-loading="isDepositedLoading"
									:list-data="depositedProposals.items"
									:column-list="depositedColumn"
									:pagination="{pageSize:Number(pageSize),dataCount:depositedProposals.total,pageNum:Number(1)}"
									@pageChange="(e) => pageChange(e,'getDepositedProposals')"
								></list-component>
<!--								<el-table :data="depositedProposals.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')">
									
									<el-table-column prop="id" :label="$t('ExplorerLang.table.proposalId')"
									                 :min-width="ColumnMinWidth.proposalId">
										 <template v-slot:default="{ row }">
											<router-link v-if="row.link" :to="`/ProposalsDetail/${row.id}`">{{ row.id }}</router-link>
											<span v-else>{{ row.id }}</span>
										</template>
									</el-table-column>
									<el-table-column class-name="address" prop="proposer" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.proposer')">
										<template v-slot:default="{ row }">
											<el-tooltip :content="row.proposer" placement="top" :disabled="Boolean(row.moniker)">
												<router-link v-if="row.link" :to="`/address/${row.proposer}`">{{ formatMoniker(row.moniker, monikerNum.otherTable) || formatAddress(row.proposer) }}</router-link>
												<span v-else>{{ formatMoniker(row.moniker, monikerNum.otherTable) || formatAddress(row.proposer) }}</span>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="deposit" align="right" :label="$t('ExplorerLang.table.deposit')"
									                :min-width="ColumnMinWidth.amount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.deposit')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
									<el-table-column prop="submited" align="center" :label="$t('ExplorerLang.table.submited')"
									                  :min-width="ColumnMinWidth.submited"></el-table-column>
									<el-table-column class-name="hash_status" prop="hash" :width="ColumnMinWidth.txHashShort" :label="$t('ExplorerLang.table.txHash')">
										<template v-slot:default="{ row }">
											<el-tooltip :content="row.hash" placement="top" :disabled="!Boolean(row.hash)">
												<router-link :to="`/tx?txHash=${row.hash}`">{{ formatTxHash(row.hash) }}</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
								</el-table>-->
							</div>
<!--							<m-pagination v-if="depositedProposals.total > pageSize" :page-size="pageSize"
							              :total="depositedProposals.total"
							              :page-change="pageChange('getDepositedProposals')"></m-pagination>-->
						</div>
						<!-- Voted Proposals -->
						<div class="second_table_container clearfloat" v-show="votedProposals.items && votedProposals.items.length > 0" :style="!(depositedProposals.items && depositedProposals.items.length > 0) ? 'margin-left:0rem': ''">
							<p class="validator_information_content_title">{{
								$t('ExplorerLang.validatorDetail.votedProposalsTitle') }}</p>
							<div class="delegations_table_container">
								<list-component
									:is-small-table="true"
									:is-loading="isVotedLoading"
									:list-data="votedProposals.items"
									:column-list="votedColumn"
									:pagination="{pageSize:Number(pageSize),dataCount:votedProposals.total,pageNum:Number(1)}"
									@pageChange="(e) => pageChange(e,'getVotedProposals')"
								></list-component>
								
								
<!--								<el-table :data="votedProposals.items" style="width: 100%"
								          :empty-text="$t('ExplorerLang.table.emptyDescription')">
									<el-table-column prop="id" :label="$t('ExplorerLang.table.proposalId')"
									                 :min-width="ColumnMinWidth.proposalId">
										 <template v-slot:default="{ row }">
											<router-link v-if="row.link" :to="`/ProposalsDetail/${row.id}`">{{ row.id }}</router-link>
										 	<span v-else>{{ row.id }}</span>
										 </template>
									</el-table-column>
									<el-table-column prop="title" :min-width="ColumnMinWidth.proposalTitle" :label="$t('ExplorerLang.table.title')"></el-table-column>
									<el-table-column prop="status" :label="$t('ExplorerLang.table.proposalStatus')"
									                :min-width="ColumnMinWidth.proposalStatus"></el-table-column>
									<el-table-column prop="voted" :label="$t('ExplorerLang.table.voted')"
									                  :min-width="ColumnMinWidth.voteOption"></el-table-column>
									<el-table-column class-name="hash_status" prop="hash" :width="ColumnMinWidth.txHashShort" :label="$t('ExplorerLang.table.txHash')">
										<template v-slot:default="{ row }">
											<el-tooltip :content="row.hash" placement="top" :disabled="!row.hash">
											<router-link :to="`/tx?txHash=${row.hash}`">{{ formatTxHash(row.hash) }}</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
								</el-table>-->
							</div>
<!--							<m-pagination v-if="votedProposals.total > pageSize" :page-size="pageSize"
							              :total="votedProposals.total"
							              :page-change="pageChange('getVotedProposals')"></m-pagination>-->
						</div>
					</div>
				</div>

				<!-- Delegation Txs -->
				<div class="delegations_txs_wrap clearfloat" v-show="delegationTxs.items && delegationTxs.items.length > 0">
					<div class="delegations_txs_container">
						<p class="validator_information_content_title">{{
							$t('ExplorerLang.validatorDetail.delegationsTxsTitle') }}</p>
<!--						<DelegationTxsList class="delegations_txs_table_container" :isShowFee="isShowFee" :dataList="delegationTxs.items" />-->
						<list-component
							:token-symbol="mainTokenSymbol"
							:is-loading="isDelegationTxLoading"
							:list-data="delegationTxs.items"
							:column-list="delegationTxColumn"
							:pagination="{pageSize:Number(pageSize),dataCount:delegationTxs.total,pageNum:Number(1)}"
							@pageChange="(e) => pageChange(e,'getDelegationTxs')"
						></list-component>
<!--						<m-pagination v-if="delegationTxs.total > pageSize" :page-size="pageSize"
						              :total="delegationTxs.total"
						              :page-change="pageChange('getDelegationTxs')"></m-pagination>-->
					</div>
				</div>
				<!-- Validation Txs -->
				<div class="validation_txs_wrap clearfloat" v-show="validationTxs.items && validationTxs.items.length > 0">
					<div class="validation_txs_container">
						<p class="validator_information_content_title">{{
							$t('ExplorerLang.validatorDetail.validationTxsTitle') }}</p>
<!--						<ValidationTxsList class="validation_txs_table_container" :isShowFee="isShowFee" :dataList="validationTxs.items" />-->
						<list-component
							:token-symbol="mainTokenSymbol"
							:is-loading="isValidationTxLoading"
							:list-data="validationTxs.items"
							:column-list="validationTxColumn"
							:pagination="{pageSize:Number(pageSize),dataCount:validationTxs.total,pageNum:Number(1)} "
							@pageChange="(e) => pageChange(e,'getValidationTxs')"
						></list-component>
<!--						<m-pagination v-if="validationTxs.total > pageSize" :page-size="pageSize"
						              :total="validationTxs.total"
						              :page-change="pageChange('getValidationTxs')"></m-pagination>-->
					</div>
				</div>
				<!-- Gov Txs -->
				<div class="gov_txs_wrap clearfloat" v-show="govTxs.items && govTxs.items.length > 0">
					<div class="gov_txs_container">
						<p class="gov_information_content_title">{{
							$t('ExplorerLang.validatorDetail.govTxsTitle') }}</p>
<!--						<GovTxsList class="gov_txs_table_containers" :isShowFee="isShowFee" :dataList="govTxs.items" />-->
						<list-component
							:is-loading="isGovLoading"
							:list-data="govTxs.items"
							:column-list="govTxColumn"
							:pagination="{pageSize:Number(pageSize),dataCount:govTxs.total,pageNum:Number(1)} "
							@pageChange="(e) => pageChange(e,'getGovTxs')"
						></list-component>
<!--						<m-pagination v-if="govTxs.total > pageSize" :page-size="pageSize"
						              :total="govTxs.total"
						              :page-change="pageChange('getGovTxs')"></m-pagination>-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ValidatorInformation from './ValidatorInformation';
	import ValidatorCommissionInformation from './ValidatorCommissionInformation';
	import MPagination from '../common/MPagination';
	import Tools from '../../util/Tools.js';
	import Constants,{ TxStatus,ColumnMinWidth,decimals,monikerNum } from '../../constant/index.js';
	import {
		getValidatorsInfoApi,
		getValidatorsDelegationsApi,
		getUnbondingDelegationsApi,
		getDelegationTxsApi,
		getValidationTxsApi,
		getDepositedProposalsApi,
		getVotedProposalsApi,
		getGovTxsApi
	} from "@/service/api";
	import {TxHelper} from '../../helper/TxHelper.js';
	import { getMainToken, converCoin,addressRoute,formatMoniker,getTxType } from '@/helper/IritaHelper';
	import { getAmountByTx } from '@/helper/txListAmoutHelper';
	import DelegationTxsList from '@/components/common/DelegationTxsList';
	import ValidationTxsList from '@/components/common/ValidationTxsList';
	import GovTxsList from '@/components/common/GovTxsList';
	import prodConfig from '../../productionConfig';
	import ListComponent from "../common/ListComponent";
	import validatorDelegationColumnList from "./tableColumnConfig/validatorDelegationColumnList";
	import validatorUnbondingDelegationColumnList from "./tableColumnConfig/validatorUnbondingDelegationColumnList";
	import validatorDelegationTxsColumn from "./tableColumnConfig/validatorDelegationTxsColumn";
	import validatorValidationColumn from "./tableColumnConfig/validatorValidationColumn";
	import validatorVotedColumn from "./tableColumnConfig/validatorVotedColumn";
	import validatorGovColumn from "./tableColumnConfig/validatorGovColumn";
	import validatorDetailDepositedProposal from "./tableColumnConfig/validatorDetailDepositedProposal";
	export default {
		name: '',
		components: {
			ListComponent,
			ValidatorInformation, ValidatorCommissionInformation, MPagination,DelegationTxsList,ValidationTxsList,GovTxsList},
		props: {},
		data () {
			return {
				isVotedLoading:false,
				isUnbondingLoading:false,
				isDelegationLoading:false,
				isDelegationTxLoading:false,
				isValidationTxLoading:false,
				isGovLoading:false,
				isDepositedLoading:false,
				validatorDelegationColumn:[],
				unBondingColumn:[],
				delegationTxColumn:[],
				validationTxColumn:[],
				govTxColumn:[],
				votedColumn:[],
				depositedColumn:[],
				TX_TYPE_DISPLAY: {},
				isShowFee: prodConfig.fee.isShowFee,
				isShowDenom: prodConfig.fee.isShowDenom,
				Tools,
				monikerNum,
				formatMoniker,
				amountDecimals: decimals.amount,
				feeDecimals: decimals.fee,
				sharesDecimals: decimals.shares,
				ColumnMinWidth,
				addressRoute,
				validationInformation: {},
				validatorStatus: '',
				pageSize: 5,
				delegations: {
					total: 0,
					currentPage: 1,
					useCount: true,
					items: [],
				},
				unbondingDelegations: {
					total: 0,
					currentPage: 1,
					useCount: true,
					items: [],
				},
				delegationTxs: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				validationTxs: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				mainToken:{},
				depositedProposals: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				votedProposals: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				govTxs: {
					total: 0,
					currentPage: 1,
					items: [],
				},
				proposalTitleNum: 20,
                mainTokenSymbol:'',
			}
		},
		computed: {},
		watch: {},
		async created () {
			await this.getTxTypeData()
			this.mainToken = await getMainToken();
			this.getValidatorsInfo()
			this.getDelegations(1, this.pageSize, true)
			this.getUnbondingDelegations(1, this.pageSize, true)
			this.getDepositedProposals(1, this.pageSize, true)
			this.getVotedProposals(1, this.pageSize, true)
			this.getDelegationTxsCount()
			this.getDelegationTxs(1, this.pageSize)
			this.getValidationTxsCount()
			this.getValidationTxs(1, this.pageSize)
			this.getGovTxs(1, this.pageSize, true)
		},
		mounted () {
			this.validatorDelegationColumn = validatorDelegationColumnList
			this.unBondingColumn = validatorUnbondingDelegationColumnList
			this.delegationTxColumn = validatorDelegationTxsColumn
			this.validationTxColumn = validatorValidationColumn
			this.votedColumn = validatorVotedColumn
			this.govTxColumn = validatorGovColumn
			this.depositedColumn=validatorDetailDepositedProposal
			this.setMainToken();
		},
		methods: {
			async getTxTypeData(){
				try {
					let res = await getTxType()
					this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
				} catch (error) {
					console.log(error)
				}
			},
			pageChange (page,key) {
				if(key){
					this[key](page)
				}
				return page => {
					
					this[key](page)
				}
			},
			async setMainToken(){
				let mainToken = await getMainToken();
				if(mainToken && mainToken.symbol){
						this.mainTokenSymbol = mainToken.symbol.toUpperCase();
				}
			},
			async getValidatorsInfo () {
				let res = await getValidatorsInfoApi(this.$route.params.param)
				this.validationInformation = {...this.validationInformation,...res}
				this.validatorStatus = Tools.firstWordUpperCase(res.status)
			},
			async getDelegations(pageNum, pageSize = 5, useCount = false) {
				this.isDelegationLoading = true
				try {
					const res = await getValidatorsDelegationsApi(this.$route.params.param, pageNum, pageSize, useCount)
					if(useCount){
						this.delegations.total = res?.count;
						const delegatorObj = {
							delegatorNum : this.delegations.total
						}
						this.validationInformation = {...this.validationInformation,...delegatorObj}
					}
					this.delegations.items = []
					for (const item of res.data) {
						let amount = await converCoin(item.amount)
						// item.amount = `${Tools.toDecimal(amount.amount,this.amountDecimals)} ${amount.denom.toUpperCase()}`
						item.amount = `${Tools.toDecimal(amount.amount,this.amountDecimals)}`
						let selfShares = Tools.toDecimal(item.self_shares, this.sharesDecimals)
						let shares = `${selfShares} (${Tools.formatPerNumber( item.total_shares ? (Number(item.self_shares) / Number(item.total_shares)) * 100 : 100)}%)`
						this.delegations.items.push({
							address: item.address,
							amount: item.amount,
							shares,
							// block: item.block,
						})
					}
					this.changedHeight()
					this.isDelegationLoading = false
				}catch (error){
					console.error(error)
					this.isDelegationLoading = false
				}
				
			},
			async getUnbondingDelegations (pageNum, pageSize = 5, useCount = false) {
				this.isUnbondingLoading = true
				try {
					const res = await getUnbondingDelegationsApi(this.$route.params.param, pageNum, pageSize, useCount)
					if(useCount){
						this.unbondingDelegations.total = res?.count;
					} else {
						this.unbondingDelegations.total = 0
					}
					this.unbondingDelegations.items = []
					for (const item of res.data) {
						let amount = await converCoin({
							amount: item.amount,
							denom: this.mainToken.denom
						})
						// item.amount = `${Tools.toDecimal(amount.amount,this.amountDecimals)} ${amount.denom.toUpperCase()}`
						item.amount = `${Tools.toDecimal(amount.amount,this.amountDecimals)}`
						item.until = Tools.formatLocalTime(new Date(item.until).getTime() / 1000)
						this.unbondingDelegations.items.push({
							address: item.address,
							amount: item.amount,
							block: item.block,
							end_time: item.until,
						})
					}
					this.changedHeight()
					this.isUnbondingLoading = false
				}catch (e) {
					console.error(e)
					this.isUnbondingLoading = false
				}
				
			},
			changedHeight () {
				this.$nextTick(()=>{
					if(this.delegations.items.length >= this.unbondingDelegations.items.length) {
						this.$refs.UnbondingDelList.style.height =  document.getElementById('element_del').offsetHeight + 'px';
						this.$refs.delegationsList.style.height =  document.getElementById('element_del').offsetHeight + 'px';
					} else {
						this.$refs.delegationsList.style.height = document.getElementById('element_undel').offsetHeight + 'px';
						this.$refs.UnbondingDelList.style.height = document.getElementById('element_undel').offsetHeight + 'px';
					}
				})
			},
			async getDelegationTxs (pageNum, pageSize = 5) {
				this.isDelegationTxLoading = true
				try {
					const res = await getDelegationTxsApi(this.$route.params.param, pageNum, pageSize, false)
					this.delegationTxs.currentPage = res.pageNum
					this.delegationTxs.items = []
					for (const item of res.data) {
						let msgsNumber = item.msgs ? item.msgs.length : 0, formTO;
						let amount = '--'
						if (item.msgs && item.msgs.length === 1) {
							formTO = TxHelper.getFromAndToAddressFromMsg(item.msgs[0])
							amount = item.msgs[0].msg && item.msgs[0].msg.amount ? await converCoin(item.msgs[0].msg.amount) : '--'
							// amount = item.msgs[0] ? await getAmountByTx(item.msgs[0],item.events) : '--'
						} else {
							formTO = '--'
						}
						if(msgsNumber > 1){
							amount = ' '
						}
						let fromMonikers,toMonikers
						if(item.monikers.length) {
							item.monikers.map( it => {
								toMonikers = toMonikers|| it[formTO.to] || ''
								fromMonikers = fromMonikers || it[formTO.from] || ''
							})
						}
						const time = Tools.formatLocalTime(item.time)
						const fee =  this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) : ''
						this.delegationTxs.items.push({
							txHash: item.tx_hash,
							blockHeight: item.height,
							From: formTO.from || "--",
							fromMonikers,
							amount: amount?.amount && amount?.denom ? `${amount?.amount} ${amount?.denom.toUpperCase()}` : '--',
							To: formTO.to || '--',
							toMonikers,
							txType: (item.msgs || []).map(item => item.type),
							MsgsNum: msgsNumber,
							// Tx_Fee: fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
							Tx_Fee: fee && fee.amount ? `${Tools.toDecimal(fee.amount, this.feeDecimals)}` : '--',
							signer: item.signers[0] ? item.signers[0] : '--',
							status: item.status,
							Timestamp: time,
						})
					}
					this.isDelegationTxLoading = false
				}catch (e) {
					this.isDelegationTxLoading = false
					console.error(e)
				}
				
			},
            async getDelegationTxsCount () {
				const res = await getDelegationTxsApi(this.$route.params.param, null, null, true)
                if(res?.count){
                this.delegationTxs.total = res.count
                }	else {
                this.delegationTxs.total = 0
                }	
			},
			async getValidationTxs (pageNum, pageSize = 5) {
				const res = await getValidationTxsApi(this.$route.params.param, pageNum, pageSize, false)
				this.validationTxs.currentPage = res.pageNum
				this.validationTxs.items = []
				for (const item of res.data) {
					let msgsNumber = item.msgs ? item.msgs.length : 0
					const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) : ''
					const selfBonded = item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.value ? await converCoin(item.msgs[0].msg.value) : '--' : '--';
					const time = Tools.formatLocalTime(item.time)
					let OperatorAddr = item.msgs && item.msgs.length === 1 ? item.msgs[0] && TxHelper.getValidationTxsOperator(item.msgs[0]) : '--'
					let OperatorMonikers
					if(item.monikers.length) {
						item.monikers.map( it => {
							OperatorMonikers = OperatorMonikers || it[OperatorAddr] || ''
						})
					}
					this.validationTxs.items.push({
						txHash: item.tx_hash,
						blockHeight: item.height,
						OperatorAddr,
						OperatorMonikers: OperatorMonikers || '--',
						SelfBonded: selfBonded.amount || '--',
						txType: (item.msgs || []).map(item=> item.type),
						MsgsNum: msgsNumber,
						// 'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
						'Tx_Fee': fee && fee.amount ?  `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
						signer: item.signers[0] ? item.signers[0] : '--',
						status: item.status,
						Time: time,
					})
				}
			},
            async getValidationTxsCount () {
				const res = await getValidationTxsApi(this.$route.params.param, null, null, true)
                if(res?.count){
                this.validationTxs.total = res.count
                }	else {
                this.validationTxs.total = 0
                }	
			},
			async getDepositedProposals (pageNum, pageSize = 5, useCount = false) {
				this.isDepositedLoading = true
				try {
					const res = await getDepositedProposalsApi(this.$route.params.param, pageNum, pageSize, useCount)
					this.depositedProposals.items = []
					if(res) {
                    if(useCount){
                    this.depositedProposals.total = res.count
                    }	
                    if(res.data && res.data.length > 0) {
                        for (const deposit of res.data) {
                            let deposits = null;
                            if(deposit.amount && deposit.amount.length>0) {
                                deposits = await converCoin(deposit.amount[0])
                            }
                            this.depositedProposals.items.push({
                                id: deposit.proposal_id,
                                proposer: deposit.proposer,
                                moniker: deposit.moniker,
                                submited: String(deposit.submited),
								txHash: deposit.tx_hash,
                                // deposit: deposits ? `${Tools.toDecimal(deposits.amount,this.amountDecimals)} ${deposits.denom.toLocaleUpperCase()}` : '--',
                                deposit: deposits ? `${Tools.toDecimal(deposits.amount,this.amountDecimals)}` : '--',
                                link: deposit.proposal_link,
                            })
                        }
                    }
					}
					this.isDepositedLoading = false
				} catch(e) {
					this.isDepositedLoading = false
					console.error(e)
				}
			},
			async getVotedProposals (pageNum, pageSize = 5, useCount = false) {
				this.isVotedLoading = true
				try {
					const res = await getVotedProposalsApi(this.$route.params.param, pageNum, pageSize, useCount)
					this.votedProposals.items = []
					if(res) {
                    if(useCount){
                    this.votedProposals.total = res.count;
                    }
                    if(res.data && res.data.length > 0) {
                        this.votedProposals.items = res.data.map(vote => {
							return {
                                id: vote.proposal_id,
                                title: Tools.formatString(vote.title, this.proposalTitleNum, '...'),
								status: vote.status,
                                voted: vote.voted,
								txHash: vote.tx_hash,
                                link: vote.proposal_link,
                            }
                        })
                    }
					}
					this.isVotedLoading = false
				} catch(e) {
					this.isVotedLoading = false
					console.error(e)
				}
			},
			async getGovTxs (pageNum, pageSize = 5, useCount = false) {
				try {
                    let res = await getGovTxsApi(this.$route.params.param, pageNum, pageSize, useCount);
                    this.govTxs.items = [];
                    if(res.data && res.data.length > 0) {
                    if(useCount){
                        this.govTxs.total = res.count
                    }					
                    this.govTxs.currentPage = res.pageNum
                    for (const item of res.data) {
                        let msgsNumber = item.msgs ? item.msgs.length : 0
                        const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) : ''
                        const time = Tools.formatLocalTime(item.time)
                        let amount = null
                        let msg = item.msgs && item.msgs[0]
                        if(msg) {
                            if(msg.type == "deposit") {
                                let unit = msg.msg && msg.msg.amount && msg.msg.amount[0]
                                if(unit) {
                                    amount = await converCoin(unit)
                                }
                            } else {
                                let unit = msg.msg && msg.msg.initial_deposit && msg.msg.initial_deposit[0]
                                if(unit) {
                                    amount = await converCoin(unit)
                                }
                            }
                        }
                        this.govTxs.items.push({
							txHash: item.tx_hash,
                            blockHeight: item.height,
                            proposalType: item.ex && item.ex.type,
                            proposalId: item.ex && item.ex.id,
                            proposalTitle: item.ex && item.ex.title && Tools.formatString(item.ex.title, this.proposalTitleNum, '...'),
                            // amount: amount ? `${Tools.toDecimal(amount.amount,this.amountDecimals)} ${amount.denom.toLocaleUpperCase()}` : '--',
                            amount: amount ? `${Tools.toDecimal(amount.amount,this.amountDecimals)}` : '--',
                           	txType: (item.msgs || []).map(item=> item.type),
                            MsgsNum: msgsNumber,
                            // 'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
                            'Tx_Fee': fee && fee.amount ? `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
							signer: item.signers[0] ? item.signers[0] : '--',
                            status: item.status,
                            Time: time,
                            proposalLink: item.ex && item.ex.proposal_link
                        })
                    }
                    }
                } catch(e) {
                    console.error(e)
                }
			},
			formatAddress (address) {
				return Tools.formatValidatorAddress(address)
			},
			formatTxHash (TxHash) {
				if (TxHash) {
					return Tools.formatTxHash(TxHash)
				}
			},
			getDisplayTxType(types=[]){
				let type = types[0] || '';
                if (type && types.length > 1) {
                    type += this.$t('ExplorerLang.unit.ellipsis');
                }
                return type;
            },
		},
	}
</script>

<style lang="scss" scoped>
	a {
		color: $t_link_c !important;
	}

	.vaildtor_detail_container {
		margin-bottom: 0.2rem;
		.vaildtor_detail_content {
			max-width: 12rem;
			margin: 0 auto;
			padding: 0 0.15rem;
			text-align: left;

			.vaildtor_detail_title_container {
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
				display: flex;
				line-height: 0.3rem;
				color: $t_first_c;
				font-size: $s18;
				font-weight: bold;

				span {
					margin-right: 0.1rem;
				}
			}

			.validation_information_container {
				margin-top: 0.1rem;
			}

			.delegations_wrap {
				margin: 0 auto;
				margin-top: 0.1rem;
				.delegations_container {
					display: flex;

					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.2rem;
						// padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}

					.one_table_container {
						width: calc(50% - 0.1rem);
					}

					.second_table_container {
						margin-left: 0.2rem;
						width: calc(50% - 0.1rem);
						.validator_information_content_title {
							white-space: nowrap;
						}
					}

					.delegations_table_container {
						//overflow-x: auto;
						// border: 0.01rem solid $bd_first_c;
						//background: $bg_white_c;
					}
				}

				.common_pagination_content {
					margin-top: 0.2rem;
					float: right;
				}
			}

			.delegations_txs_wrap {
				margin: 0 auto;
				margin-top: 0.1rem;
				.delegations_txs_container {
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.2rem;
						// padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}

					.delegations_txs_table_container {
						overflow-x: auto;
						// border: 0.01rem solid $bd_first_c;
						background: $bg_white_c;

						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
					}

					.common_pagination_content {
						margin-top: 0.2rem;
						float: right;
					}
				}
			}

			.validation_txs_wrap {
				margin: 0 auto;
				margin-top: 0.1rem;

				.validation_txs_container {
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.2rem;
						// padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}

					.validation_txs_table_container {
						overflow-x: auto;
						// border: 0.01rem solid $bd_first_c;
						background: $bg_white_c;
					}

					.common_pagination_content {
						margin-top: 0.2rem;
						float: right;
						// margin-bottom: 0.5rem;
					}
				}
			}

			.gov_txs_wrap {
				margin: 0 auto;
				margin-top: 0.1rem;
				margin-bottom: 0.2rem;

				.gov_txs_container {
					.gov_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size:  $s18;
						margin-top: 0.2rem;
						// padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
					}

					.gov_txs_table_containers {
						// width: 100%;
						// overflow-x: auto;
						// border: 0.01rem solid $bd_first_c;
						// background: $bg_white_c;
					}

					.common_pagination_content {
						margin-top: 0.2rem;
						float: right;
						margin-bottom: 0.5rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 1050px){
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
					margin-left: 0.2rem;
				}
				.delegations_wrap {
					.delegations_container{
						margin: 0 0.2rem;
					}
				}
				.delegations_txs_wrap {
					.delegations_txs_container{
						margin: 0 0.2rem;
					}
				}
				.validation_txs_wrap {
					.validation_txs_container {
						margin: 0 0.2rem;
					}
				}
				.gov_txs_wrap {
					.gov_txs_container {
						margin: 0 0.2rem;
					}
				}
			}
		}
	}

	@media screen and (max-width: 910px) {
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
				}

				.validation_information_container {
				}

				.delegations_wrap {
					.delegations_container {
						display: block;
						margin-left: 0.2rem;

						.validator_information_content_title {
						}

						.one_table_container {
							width: 100%;
						}

						.second_table_container {
							width: 100%;
							margin-left: 0rem;
						}

						.delegations_table_container {
						}

						.common_pagination_content {
						}
					}
				}
			}
		}
	}

	@media screen and (max-width: 750px){
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.vaildtor_detail_title_container {
					margin-left: 0.1rem;
				}
				.delegations_wrap {
					.delegations_container{
						margin: 0 0.1rem;
					}
				}
				.delegations_txs_wrap {
					.delegations_txs_container{
						margin: 0 0.1rem;
					}
				}
				.validation_txs_wrap {
					.validation_txs_container {
						margin: 0 0.1rem;
					}
				}
				.gov_txs_wrap {
					.gov_txs_container {
						margin: 0 0.1rem;
					}
				}
			}
		}
	}
	@media screen and (max-width: 510px){
		.vaildtor_detail_container {
			.vaildtor_detail_content {
				.delegations_wrap {
					.delegations_container{
						.validator_information_content_title {
							// padding-left: 0.05rem;
						}
					}
				}
				.delegations_txs_wrap {
					.delegations_txs_container{
						.validator_information_content_title {
							// padding-left: 0.05rem;
						}
					}
				}
				.validation_txs_wrap {
					.validation_txs_container {
						.validator_information_content_title {
							// padding-left: 0.05rem;
						}
					}
				}
				.gov_txs_wrap {
					.gov_txs_container {
						.validator_information_content_title {
							// padding-left: 0.05rem;
						}
					}
				}
			}
		}
	}
</style>
