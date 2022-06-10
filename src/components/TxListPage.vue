<template>
    <div class="transaction_list_page_container">
		<div class="transaction_list_page_container_title">
			<div class="title_container">
				<span v-if="$route.params.txType === 'delegations'">{{ $t('ExplorerLang.transactions.delegationTxsList')}}</span>
				<span v-if="$route.params.txType === 'validations'">{{$t('ExplorerLang.transactions.validationTxsList')}}</span>
				<span v-if="$route.params.txType === 'governance'">{{$t('ExplorerLang.transactions.govTxsList')}}</span>
			</div>
			<div class="transaction_list_title_wrap">
				<div class="transaction_list_title_content">
					<div class="filter_container">
<!--						<div class="filter_tx_type_statue_content">
							<el-select popper-class="tooltip" v-model="value" filterable :change="filterTxByTxType(value)">
								<el-option v-for="(item, index) in txTypeListArray"
										:key="index"
										:label="item.label"
										:value="item.value">
								</el-option>
							</el-select>
							<el-select popper-class="tooltip" v-model="statusValue" :change="filterTxByStatus(statusValue)">
								<el-option v-for="(item, index) in status"
										:key="index"
										:label="item.label"
										:value="item.value"></el-option>
							</el-select>
						</div>
						<div class="select_date_content">
							<el-date-picker  type="date"
											popper-class="tooltip"
											v-model="startTime"
											@change="getStartTime(startTime)"
											:picker-options="PickerOptions"
											:editable="false"
											value-format="yyyy-MM-dd"
											:placeholder="$t('ExplorerLang.common.selectDate')">
							</el-date-picker>
							<span class="joint_mark">~</span>
							<el-date-picker  type="date"
											popper-class="tooltip"
											v-model="endTime"
											:picker-options="PickerOptions"
											value-format="yyyy-MM-dd"
											@change="getEndTime(endTime)"
											:editable="false"
											:placeholder="$t('ExplorerLang.common.selectDate')">
							</el-date-picker>
							<div class="tooltip_content">
								<el-tooltip popper-class="tooltip"  :content="$t('ExplorerLang.transactions.tooltip')">
									<i class="iconfont iconyiwen"></i>
								</el-tooltip>
							</div>
						</div>
						<div class="reset_search_content">
							<div class="tx_search_btn" @click="getFilterTxs">{{$t('ExplorerLang.transactions.search')}}</div>
							<div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
						</div>-->
					</div>
				</div>
			</div>
		</div>
        <div class="transaction_list_table_container">
            <div class="transaction_list_table_content">
                <div class="table_list_content">
                    <!-- Delegation Txs -->
<!--					<DelegationTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'delegations'" />-->
					<list-component :is-loading="isLoading"
									:list-data="txList"
									:column-list="txColumnList"
									:token-symbol="mainTokenSymbol"
									:pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(currentPageNum)}"
									@pageChange="pageChange">
						<template v-slot:msgType>
							<tabs-component :tab-list="txTypeListArray"
											@onSelectMagModel="setChoiceMsgTypeColumn"></tabs-component>
						</template>
						<template v-slot:resetButton>
							<tx-reset-button-component @resetParams="resetFilterCondition"></tx-reset-button-component>
						</template>

						<template v-slot:datePicket>
							<tx-status-tabs-components
								@onChangTxStatus="changeTxStatus"
								@onChangeDate="changeTime"
								ref="statusDatePicker"></tx-status-tabs-components>
						</template>
						<template v-slot:txCount>
							<tx-count-component :title="$t('ExplorerLang.transactions.txs')" :icon="'iconTrainsaction'" :tx-count="count"></tx-count-component>
						</template>
					</list-component>
                    <!-- Validation Txs -->
<!--					<ValidationTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'validations'" />-->
					<!-- Gov Txs -->
<!--					<GovTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'governance'" />-->
                </div>
<!--                <div class="pagination_nav_footer_content">
                    <keep-alive>
                        <m-pagination :total="count" :page="currentPageNum" :page-size="pageSize" :page-change="pageChange"></m-pagination>
                    </keep-alive>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
	import Tools from "../util/Tools";
	import MPagination from "./common/MPagination";
	import {pageTitleConfig, TxStatus, decimals, TX_TYPE} from "../constant";
	import {TxHelper} from '@/helper/TxHelper.js';
	import {getTypeStakingApi, getTypeDeclarationApi, getDelegationTxsApi, getValidationTxsApi,getGovTxsApi,getTypeGovApi} from "@/service/api";
	import {converCoin,getMainToken,getTxType} from "../helper/IritaHelper";
	import {getAmountByTx} from "../helper/txListAmoutHelper";
	import DelegationTxsList from '@/components/common/DelegationTxsList'
	import ValidationTxsList from '@/components/common/ValidationTxsList'
	import GovTxsList from '@/components/common/GovTxsList'
	import prodConfig from '../productionConfig';
	import parseTimeMixin from '../mixins/parseTime'
	import ListComponent from "./common/ListComponent";
	import TabsComponent from "./common/TabsComponent";
	import txCommonTable from "./tableListColumnConfig/txCommonTable";
	import txCommonLatestTable from "./tableListColumnConfig/txCommonLatestTable";
	import {needAddColumn} from "./tableListColumnConfig/allTxTableColumnConfig";
	import TxStatusTabsComponents from "./common/TxStatusTabsComponents";
	import TxCountComponent from "./TxCountComponent";
	import stakingValidationAndDelegationAmount from './tableListColumnConfig/stakingValidationAndDelegationAmount'
	import SignerColunmn from "./tableListColumnConfig/SignerColunmn";
	import validatorMonikerColumn from "./tableListColumnConfig/validatorMonikerColumn";
	import TxResetButtonComponent from "./common/TxResetButtonComponent";
	export default {
		name: "TransactionListPage",
		components: {
			TxResetButtonComponent,
			TxCountComponent,
			TxStatusTabsComponents,
			TabsComponent, ListComponent, MPagination,DelegationTxsList,ValidationTxsList,GovTxsList},
		mixins:[parseTimeMixin],
		data () {
			return {
				isLoading:false,
				txColumnList: [],
				mainTokenSymbol:'',
				TX_TYPE_DISPLAY: {},
				isShowFee: prodConfig.fee.isShowFee,
				isShowDenom: prodConfig.fee.isShowDenom,
				proposalTitleNum: 20,
				feeDecimals: decimals.fee,
                pageTitle:'',
				totalPageNum: sessionStorage.getItem("txpagenum") ? JSON.parse(sessionStorage.getItem("txpagenum")) : 1,
				currentPageNum: this.forCurrentPageNum(),
				pickerStartTime: sessionStorage.getItem('firstBlockTime') ? sessionStorage.getItem('firstBlockTime') : '',
				selectMsgTypeIndex: sessionStorage.getItem('selectMsgTypeIndex') ? JSON.parse(sessionStorage.getItem('selectMsgTypeIndex')) : 0,
				PickerOptions: {
					disabledDate: (time) => {
						return time.getTime() < new Date(this.pickerStartTime).getTime() || time.getTime() > Date.now()
					}
				},
				txList: [],
				txTypeListArray: [
					{
						value: 'allTxType',
						label: this.$t('ExplorerLang.common.allTxType'),
						slot: 'allTXType'
					}
				],
				listTitleName: "",
				count: sessionStorage.getItem("txTotal") ? Number(sessionStorage.getItem("txTotal")) : 0,
				pageSize: 10,
				value: this.getParamsByUrlHash().txType ? this.getParamsByUrlHash().txType : 'allTxType',
				txStatus: '',
				statusValue: this.getParamsByUrlHash().txStatus ? this.getParamsByUrlHash().txStatus : 'allStatus',
				status: [],
				startTime: this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
				endTime: this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',
				filterStartTime: '',
				filterEndTime: '',
				urlParamsShowStartTime: this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
				urlParamsShowEndTime: this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',
				type: '',
			}
		},
		async mounted () {
			const {txType} = Tools.urlParser();
			await this.getType();
			this.txColumnList = txCommonTable.concat(txCommonLatestTable)
			if(this.type === 'stake'){
				this.txColumnList = txCommonTable.concat(stakingValidationAndDelegationAmount,SignerColunmn,txCommonLatestTable)
			}
			if(this.type === 'declaration'){
				this.txColumnList = txCommonTable.concat(validatorMonikerColumn,SignerColunmn,txCommonLatestTable)
			}
			if(txType && needAddColumn[txType]){
				this.txColumnList = txCommonTable.concat(needAddColumn[txType],txCommonLatestTable)
			}
			this.TxType = txType
			await this.getTxTypeData()
			await this.setMainToken();
			let statusArray = [
				{
					value: 'allStatus',
					label: this.$t('ExplorerLang.common.allTxStatus')
				},
				{
					value: 'success',
					label: this.$t('ExplorerLang.common.success')
				},
				{
					value: 'fail',
					label: this.$t('ExplorerLang.common.failed')
				}
			]
			statusArray.forEach(item => {
				this.status.push(item)
			})
			
			this.getTxListByFilterCondition(null, null, true)
			this.getTxListByFilterCondition(this.currentPageNum, this.pageSize)
			// this.$store.commit('currentTxModelIndex',this.selectMsgTypeIndex)
    
			
		},
		methods: {
			setChoiceMsgTypeColumn(param){
				this.txColumnList = txCommonTable.concat(txCommonLatestTable)
				if(this.type === 'stake'){
					this.txColumnList = txCommonTable.concat(stakingValidationAndDelegationAmount,SignerColunmn,txCommonLatestTable)
				}
				if(this.type === 'declaration'){
					this.txColumnList = txCommonTable.concat(validatorMonikerColumn,SignerColunmn,txCommonLatestTable)
				}
				if(param?.value && needAddColumn[param.value]){
					this.txColumnList = txCommonTable.concat(needAddColumn[param.value],txCommonLatestTable)
				}
				this.TxType = param?.value === 'allTxType' ?  '' : param.value
				if(param?.index){
					sessionStorage.setItem('lastChoiceMsgModelIndex',param.index)
				}
				this.getFilterTxs()
			},
			async setMainToken() {
				let mainToken = await getMainToken();
				if (mainToken && mainToken.symbol) {
					this.mainTokenSymbol = mainToken.symbol.toUpperCase();
				}
			},
			changeTxStatus(txStatus) {
				this.txStatus = Number(txStatus)
				this.getFilterTxs()
			},
			changeTime(selectTime) {
				this.urlParamsShowStartTime = ''
				this.urlParamsShowEndTime = ''
				if (selectTime?.length === 2) {
					this.urlParamsShowStartTime = selectTime[0]
					this.urlParamsShowEndTime = selectTime[1]
				}
				this.getFilterTxs()
			},
			async getTxTypeData(){
				try {
					let res = await getTxType()
					this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
				} catch (error) {
					console.log(error)
				}
			},
			getParamsByUrlHash () {
				let txType,
					txStatus,
					urlParamShowStartTime,
					urlParamShowEndTime,
					filterStartTime,
					filterEndTime;
				let path = window.location.hash;
				if (path.includes("?")) {
					let urlHash = path.split('?')[1];
					let params = urlHash.split("&");
					params.forEach(item => {
						if (item.includes('txType')) {
							txType = item.split("=")[1]
						} else if (item.includes('status')) {
							txStatus = item.split("=")[1]
						} else if (item.includes('startTime')) {
							urlParamShowStartTime = item.split("=")[1]
							filterStartTime = this.formatStartTime(item.split("=")[1])
						} else if (item.includes('endTime')) {
							urlParamShowEndTime = item.split("=")[1]
							filterEndTime = this.formatEndTime(item.split("=")[1])
						}
					})
				}
				return {txType, txStatus, filterStartTime, filterEndTime, urlParamShowStartTime, urlParamShowEndTime}
			},
			forCurrentPageNum () {
				let currentPageNum = 1;
				let urlPageSize = this.$route.query.page && Number(this.$route.query.page);
				currentPageNum = urlPageSize ? urlPageSize : 1;
				return currentPageNum;
			},
			pageChange (pageNum) {
				this.currentPageNum = pageNum;
				if (this.currentPageNumCache === this.currentPageNum) {
					return;
				}
				this.currentPageNumCache = this.currentPageNum;
				let path = this.$route.path, urlParams = this.getParamsByUrlHash();
				this.statusValue = urlParams.txStatus ? urlParams.txStatus : 'allStatus';
				this.value = urlParams.txType ? urlParams.txType : 'allTxType';
				this.startTime = urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : '';
				this.endTime = urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : '';
				history.pushState(null, null, `/#${path}?txType=${urlParams.txType ? urlParams.txType : ''}&status=${urlParams.txStatus ? urlParams.txStatus : ''}&startTime=${urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : ''}&endTime=${urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : ''}&page=${pageNum}`);
				this.getTxListByFilterCondition(this.currentPageNum, this.pageSize);
			},
			getFilterTxs () {
				this.currentPageNum = 1;
				sessionStorage.setItem('txpagenum', 1);
				history.pushState(null, null, `/#${this.$route.path}?txType=${this.TxType || ''}&status=${this.txStatus}&startTime=${this.urlParamsShowStartTime}&endTime=${this.urlParamsShowEndTime}&page=1`);
                this.getTxListByFilterCondition(null, null, true)
                this.getTxListByFilterCondition(this.currentPageNum, this.pageSize)
			},
			resetUrl () {
				this.value = 'allTxType';
				this.statusValue = 'allStatus';
				this.startTime = '';
				this.endTime = '';
				this.currentPageNum = 1;
				this.urlParamsShowStartTime = '';
				this.urlParamsShowEndTime = '';
				history.pushState(null, null, `/#${this.$route.path}?txType=&status=&startTime=&endTime=&page=1`);
			},
			/*filterTxByTxType (e) {
				if (e === 'allTxType' || e === undefined) {
					this.TxType = '';
				} else {
					this.TxType = e
				}
			},*/
			filterTxByStatus (e) {
				if (e === 'allStatus') {
					this.txStatus = '';
				} else {
					this.txStatus = e
				}
			},
			getStartTime (time) {
				this.filterStartTime = this.formatStartTime(time)
			},
			getEndTime (time) {
				this.filterEndTime = this.formatEndTime(time)
			},
			formatStartTime (time) {
				this.urlParamsShowStartTime = time
				let offest = 8 * 60 * 60
				return Number(new Date(time).getTime() / 1000) - Number(offest)
			},
			formatEndTime (time) {
				this.urlParamsShowEndTime = time
				let offest = 8 * 60 * 60
				let oneDaySeconds = 24 * 60 * 60
				return Number(new Date(time).getTime() / 1000) + Number(oneDaySeconds) - Number(offest)
			},
			resetFilterCondition () {
				this.TxType = ''
				this.getType();
				this.resetUrl()
                this.getTxListByFilterCondition(null, null, true)
                this.getTxListByFilterCondition(this.currentPageNum, this.pageSize)
				this.$store.commit('currentTxModelIndex', 0)
				sessionStorage.setItem('lastChoiceMsgModelIndex',0)
				sessionStorage.setItem('txTimeRange',[])
				this.$refs.statusDatePicker.resetParams()//新增
				this.txColumnList = txCommonTable.concat(txCommonLatestTable)
				if(this.type === 'stake'){
					this.txColumnList = txCommonTable.concat(stakingValidationAndDelegationAmount,SignerColunmn,txCommonLatestTable)
				}
				if(this.type === 'declaration'){
					this.txColumnList = txCommonTable.concat(validatorMonikerColumn,SignerColunmn,txCommonLatestTable)
				}
			},
			getType () {
				switch (this.$route.params.txType) {
					case 'delegations' :
						this.type = 'stake';
						this.pageTitle = pageTitleConfig.StakingDelegationTxs;
						break;
					case 'validations':
						this.type = 'declaration';
						this.pageTitle = pageTitleConfig.StakingValidationTxs;
						break;
					case 'transfers':
						this.type = 'trans';
						this.pageTitle = pageTitleConfig.Transfer;
						break;
					case 'governance':
						this.type = 'gov';
						this.pageTitle = pageTitleConfig.GovGovTxs;
				}
				// this.$store.commit('currentTxModelIndex',0)
				this.getAllTxType();
			},
			async getAllTxType () {
				let res = [];
				this.selectMsgTypeIndex = 0
				sessionStorage.removeItem('selectMsgTypeIndex')
				this.$store.commit('currentTxModelIndex',0)
				if (this.type === 'stake') {
					const {data} = await getTypeStakingApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				} else if (this.type === 'declaration') {
					const {data} = await getTypeDeclarationApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				} else if (this.type === 'gov') {
					const data = await getTypeGovApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				}
				try {
					if (res) {
						let typeArray;
						typeArray = res.map(item => {
							return {
								value: item,
								label: this.TX_TYPE_DISPLAY[item] || item
							}
						});
						this.txTypeListArray = [
							{
								value: 'allTxType',
								label: this.$t('ExplorerLang.common.allTxType'),
								slot: 'allTXType'
							}
						];
						this.txTypeListArray = this.txTypeListArray.concat(typeArray)
						if(this.txTypeListArray?.length > 0 && this.TxType){
							this.txTypeListArray.forEach( (item,index) => {
								if(item?.value === this.TxType){
									this.selectMsgTypeIndex  = index
								}
							})
							sessionStorage.setItem('selectMsgTypeIndex',this.selectMsgTypeIndex)
							sessionStorage.setItem('currentTxModelIndex',this.selectMsgTypeIndex)
							sessionStorage.setItem('lastChoiceMsgModelIndex',this.selectMsgTypeIndex)
							this.$store.commit('currentTxModelIndex',this.selectMsgTypeIndex)
						}
					}
				} catch (e) {
					console.error(e)
				}
			},
			getAmount(amount) {
				if (!amount) {
					return "";
				}
				let denomRule = /[0-9.]+/
				const amountRule = /^[0-9]+.?[0-9]*$/
				if(amountRule.test(amount)){
					return  amount
				}
				let result = amount.match(denomRule)
				return result ? amount.match(denomRule)[0] : ' ';
			},
			getAmountUnit(amount) {
				if (!amount) {
					return "";
				}
				const amountRule = /^[0-9]+.?[0-9]*$/
				if(amountRule.test(amount)){
					return  ' '
				}
				let denomRule = /[A-Za-z\/]+/
				let result = amount.match(denomRule)
				return result ? amount.match(denomRule)[0] : ' ';
			},
			async getTxListByFilterCondition (currentPageNum, pageSize, useCount = false) {
				this.isLoading = true;
				let mainToken = await getMainToken()
				let urlParams = this.getParamsByUrlHash(), param = {};
				param.type = this.type;
				param.txType = urlParams.txType ? urlParams.txType : '';
				if (Number(urlParams.txStatus)) {
					param.status = urlParams.txStatus
					/*if (urlParams.txStatus === 'success') {
						param.status = 1
					} else if (urlParams.txStatus === 'fail') {
						param.status = 2
					}*/
				} else {
					param.status = ''
				}
				param.beginTime = urlParams.filterStartTime ? urlParams.filterStartTime : '';
				param.endTime = urlParams.filterEndTime ? urlParams.filterEndTime : '';
                if(currentPageNum && pageSize){
                    param = { ...param, pageNumber: currentPageNum, pageSize }
                }
				if (this.type === 'stake') {
					let res = await getDelegationTxsApi('', param.pageNumber, param.pageSize, useCount, param.txType, param.status, param.beginTime, param.endTime)
					try {
                        if(useCount){
                            if(res?.count){
                                this.count = res.count;
                            } else {
                                this.count = 0;
                            }
                        } else {
                            this.txList = [];
                            if (res?.data) {
                                this.totalPageNum = Math.ceil((res.data / this.pageSize) === 0 ? 1 : (res.data / this.pageSize));
                                for (const item of res.data) {
                                    if(item) {
                                    	let msg = {};
										if(item?.msgs?.length){
											for (const msgElement of item.msgs) {
												if(msgElement.type === this.TxType){
													msg = msgElement || {}
												}
											}
										}
										let msgsNumber = item.msgs ? item.msgs.length : 0, amountArr= [], fromAddr = '--',toAddr = '--',fromAddrArr = [],toAddrArr = [];
										let amount = '--'
										if(msgsNumber > 1){
											for (const msgElement of item.msgs) {
												if(msgElement && JSON.stringify(msgElement) !== '{}'){
													const fromToAddr = TxHelper.getFromAndToAddressFromMsg(msgElement)
													if(msgElement.type === this.TxType){
														amountArr.push(await getAmountByTx(msgElement, true))
														if(fromToAddr?.from){
															fromAddrArr.push(fromToAddr.from)
														}
														if(fromToAddr?.to){
															toAddrArr.push(fromToAddr.to)
														}
													}
												}
											}
											fromAddrArr = Array.from(new Set(fromAddrArr))
											toAddrArr = Array.from(new Set(toAddrArr))
											fromAddr = fromAddrArr?.length > 1 ? ' ' : fromAddrArr?.length === 1 ? fromAddrArr[0] : '--'
											toAddr = toAddrArr?.length > 1 ? ' ' : toAddrArr?.length === 1 ? toAddrArr[0] : '--'
											amount = amountArr?.length > 1 ? ' ' : amountArr?.length === 1 ? amountArr[0] : ' '
										}else if(msgsNumber === 1) {
											if (item.msgs[0] && JSON.stringify(item.msgs[0]) !== '{}') {
												const fromToAddr = TxHelper.getFromAndToAddressFromMsg(item.msgs[0])
												if(fromToAddr?.from){
													fromAddr =fromToAddr.from
												}
												if(fromToAddr?.to){
													toAddr =fromToAddr.to
												}
												amount = item.msgs[0] ? await getAmountByTx(item.msgs[0], true) : '--'
											}
										}
                                        let fromMonikers = ' ',toMonikers = ' '
										
                                        if(item.monikers.length) {
											let monikersMap = new Map()
											item.monikers.forEach( item => {
												monikersMap.set(Object.keys(item)[0],Object.values(item)[0])
											})
											if(monikersMap.has(fromAddr)){
												fromMonikers = monikersMap.get(fromAddr)
											}
											if(monikersMap.has(toAddr)){
												toMonikers = monikersMap.get(toAddr)
											}
                                            /*item.monikers.map( it => {
                                                toMonikers = toMonikers|| it[toAddr] || ''
                                                fromMonikers = fromMonikers || it[fromAddr] || ''
                                            })*/
                                        }
                                        let isShowMore = false;
                                        // const type = item.msgs && item.msgs[0] && item.msgs[0].type;
                                        // if(type && type === TX_TYPE.withdraw_delegator_reward) {
                                        // 	isShowMore = true
                                        // }
                                        // const time = Tools.getDisplayDate(item.time)
										
                                        const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) :'--'
										this.txList.push({
											txHash: item.tx_hash,
											blockHeight: item.height,
											from: fromAddr ,
                                            fromMonikers,
                                            amount: this.getAmount(amount),
                                            denom: this.getAmountUnit(amount),
                                            to: toAddr,
                                            toMonikers,
											txType: (item.msgs || []).map(item=>item.type),
                                            MsgsNum: msgsNumber,
                                            // Tx_Fee: fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
                                            Tx_Fee: fee && fee.amount ?  `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
											signer: item.signers[0] ? item.signers[0] : '--',
											status: item.status,
                                            Timestamp: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                                            isShowMore,
                                            Time:Tools.formatLocalTime(item.time)
                                        })
                                    }
                                }
                            }
							this.isLoading = false;
                        }
					} catch (e) {
						this.isLoading = false;
						console.error(e)
					}
				} else if (this.type === 'declaration') {
					let res = await getValidationTxsApi('', param.pageNumber, param.pageSize, useCount, param.txType, param.status, param.beginTime, param.endTime)
					try {
                        if(useCount){
                            if(res?.count){
                                this.count = res.count;
                            } else {
                                this.count = 0
                            }
                        } else {
                           
                            if(res?.data){
								this.txList = []
                                this.totalPageNum = Math.ceil((res.data / this.pageSize) === 0 ? 1 : (res.data / this.pageSize));
                                for (const item of res.data) {
                                    if(item) {
                                        let msgsNumber = item.msgs ? item.msgs.length : 0
										let msg = {}
										if(item?.msgs?.length){
											for (const msgElement of item.msgs) {
												if(msgElement.type === this.TxType){
													msg = msgElement || {}
												}
											}
										}
										let validatorOperatorArr = [] , operatorAddr = '--',operatorMonikers = '' ;
										if(item?.msgs?.length > 1 ){
											for (const msg1 of item.msgs) {
												if(msg1 &&JSON.stringify(msg1) !== '{}'){
													const validatorOperator =  TxHelper.getValidationTxsOperator(msg1)
													validatorOperatorArr.push(validatorOperator)
												}
											}
										}else if(item?.msgs?.length === 1) {
											operatorAddr = TxHelper.getValidationTxsOperator(item.msgs[0])
										}
										validatorOperatorArr = Array.from(new Set(validatorOperatorArr))
										operatorAddr = validatorOperatorArr?.length > 1 ? ' ' : validatorOperatorArr?.length === 1 ? validatorOperatorArr[0] : operatorAddr || '--'
										operatorMonikers = validatorOperatorArr?.length > 1 ? ' ' : '--'
										let monikerMap = new Map()
	
										if(item.monikers.length) {
											item.monikers.forEach( it => {
												monikerMap.set(Object.keys(it)[0],Object.values(it)[0])
											})
										}
	                                    if (monikerMap.has(operatorAddr)) {
		                                    operatorMonikers = monikerMap.get(operatorAddr)
	                                    }
	                                    // console.log(item.fee.amount[0],'item.fee.amount[0]');
	                                    const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) : '--';
	                                    const selfBonded = item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.value ? await converCoin(item.msgs[0].msg.value) : '--' : '--';
	                                    // const time = Tools.getDisplayDate(item.time)
	                                    const time = Tools.formatAge(Tools.getTimestamp(), item.time * 1000, this.$t('ExplorerLang.table.suffix'))

	                                    let amount = msg ? await getAmountByTx(msg, true) : '--'
	                                    const result = amount.split('%');

	                                    this.txList.push({
		                                    txHash: item.tx_hash,
		                                    blockHeight: item.height,
		                                    validatorAddress: operatorAddr,
		                                    validatorMoniker: operatorMonikers,
		                                    amount: result?.length ? result[0] : '--',
		                                    txType: (item.msgs || []).map(item => item.type),
		                                    MsgsNum: msgsNumber,
		                                    // 'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
		                                    'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount, this.feeDecimals)}` : `${Tools.toDecimal(fee.amount, this.feeDecimals)}` : '--',
		                                    signer: item.signers[0] ? item.signers[0] : '--',
		                                    status: item.status,
		                                    Timestamp: Tools.formatAge(Tools.getTimestamp(), item.time * 1000, this.$t('ExplorerLang.table.suffix')),
		                                    Time: Tools.formatLocalTime(item.time)
	                                    })
                                    }
                                }
                            }
							this.isLoading = false;
                        }
					} catch (e) {
						this.isLoading = false;
						console.error(e)
					}
				} else if (this.type === 'gov') {
					try {
						let res = await getGovTxsApi('', param.pageNumber, param.pageSize, useCount, param.txType, param.status, param.beginTime, param.endTime)
                        if(useCount){
                            if(res?.count){
                                this.count = res.count;
                            } else {
                                this.count = 0
                            }
                        } else {
                            this.txList = [];
                            if(res?.data) {
                                for (const item of res.data) {
									let msgsNumber = item.msgs ? item.msgs.length : 0;
									let msg = {};
									
									if(item?.msgs?.length){
										for (const msgElement of item.msgs) {
											if(msgElement.type === this.TxType){
												msg = msgElement || {}
											}
										}
									}
									const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) :'--'
                                    // const time = Tools.getDisplayDate(item.time)
                                    // const time = Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix'))
                                    let amount = null
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
                                    let depositor = '--',option = '--',voter = '--';
									if(msg?.type === TX_TYPE.deposit && msg?.msg?.depositor && msg?.msg?.proposal_id ){
										depositor = msg.msg.depositor
									}
									if(msg?.type === TX_TYPE.vote && msg?.msg?.option && msg?.msg?.proposal_id && msg?.msg?.voter){
										option = msg.msg.option
										voter = msg.msg.voter
									}
									let addrObj = TxHelper.getFromAndToAddressFromMsg(msg);
									let from = addrObj.from || '--';
									this.txList.push({
										txHash: item.tx_hash,
										depositor,
										from,
										option,
										voter,
										blockHeight: item.height,
                                        proposalType: item.ex && item.ex.type,
                                        proposalId: item.ex && item.ex.id,
										title: item.ex && item.ex.title && Tools.formatString(item.ex.title, this.proposalTitleNum, '...'),
                                        // amount: amount ? `${Tools.toDecimal(amount.amount,this.feeDecimals)} ${amount.denom.toLocaleUpperCase()}` : '--',
                                        amount: amount ? `${Tools.toDecimal(amount.amount,this.feeDecimals)}` : '--',
										txType: (item.msgs || []).map(item=>this.TX_TYPE_DISPLAY[item.type] || item.type),
                                        MsgsNum: msgsNumber,
                                        // 'Tx_Fee': fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
                                        'Tx_Fee': fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
										signer: item.signers[0] ? item.signers[0] : '--',
										status: item.status,
                                        Timestamp: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                                        proposalLink: item.ex && item.ex.proposal_link,
										Time: Tools.formatLocalTime(item.time)
                                    })
                                }
                            }
							this.isLoading = false;
                        }
						
					} catch(e) {
						this.isLoading = false;
						console.error(e)
					}
				}
				/**
				 * @description: from parseTimeMixin
				 */
				this.parseTime('txList', 'Time', 'Timestamp')
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
		beforeDestroy(){
			this.$store.commit('currentTxModelIndex',0)
			sessionStorage.removeItem('lastChoiceMsgModelIndex')
			sessionStorage.removeItem('currentChoiceMsgType')
		},
	}
</script>

<style scoped lang="scss">
	.transaction_list_page_container {
		.transaction_list_page_container_title {
			max-width: 12rem;
			margin: 0.4rem auto 0.1rem auto;
			display: flex;
			.title_container {
				text-align: left;
				line-height: 0.26rem;
				font-weight: 600;
				color: $t_first_c;
				font-size: 0.22rem;
				margin-right: 0.2rem;
				span:nth-child(1) {
					margin-right: 0.1rem;
				}
			}
		}
		
		.transaction_list_title_wrap {
			background-color: $bg_cancel_c;
			.transaction_list_title_content {
				// height: 0.64rem;
				display: flex;
				align-items: center;
				// max-width: 12.8rem;
				max-width: 12rem;
				margin: 0 auto;
				
				.filter_container {
					display: flex;
					
					.filter_tx_type_statue_content {
						display: flex;
						align-items: center;
						
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
										font-size: $s10 !important;
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
					}
					
					.select_date_content {
						display: flex;
						align-items: center;
						
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
						
						.tooltip_content {
							padding: 0 0 0 0.1rem;
						}
					}
					
					.reset_search_content {
						display: flex;
						align-items: center;
						
						.reset_btn {
							background: $theme_c;
							color: $t_white_c;
							border-radius: 0.04rem;
							margin-left: 0.1rem;
							cursor: pointer;
							height: 0.3rem;
							
							i {
								padding: 0.08rem;
								font-size: $s14;
								line-height: 1;
								display: inline-block;
							}
						}
						
						.tx_search_btn {
							height: 0.2rem;
							cursor: pointer;
							background: $theme_c;
							margin-left: 0.1rem;
							color: $t_white_c;
							border-radius: 0.04rem;
							padding: 0.05rem 0.18rem;
							font-size: $s14;
							line-height: 0.2rem;
							white-space: nowrap;
						}
					}
				}
				
			}
		}
		.transaction_list_table_container {
			// max-width: 12.8rem;
			max-width: 12rem;
			// padding: 1.24rem 0 0.2rem 0;
			padding: 0rem 0 0.2rem 0;
			margin: 0 auto;
			
			.transaction_list_table_content {
				text-align: left;
				
				.table_list_content {
					width: 100%;
					overflow-x: auto;
					padding-top: 0rem;
				}
				
				.pagination_nav_footer_content {
					display: flex;
					justify-content: flex-end;
					height: 0.7rem;
					align-items: center;
				}
				
			}
		}
	}
	
	@media screen and (max-width: 1248px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				margin-left:0.24rem;
			}
			.title_container {
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					// margin: 0 0.24rem;
					.filter_container {
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {
				margin: 0 0.24rem;
				.transaction_list_table_content {
					.table_list_content {
					}
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

	@media screen and (max-width: 1053px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				display: block;
			}
			.title_container {
				margin-bottom: 0.1rem;
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					// margin: 0 0.24rem;
					.filter_container {
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {
				.transaction_list_table_content {
					.table_list_content {
					}
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

	@media screen and (max-width: 910px) {
		.transaction_list_page_container {
			.title_container {
				span {
				}
			}
			.transaction_list_title_wrap {
				position: static;
				padding-top: 0.15rem;
				
				.transaction_list_title_content {
					display: flex;
					flex-direction: column;
					height: auto;
					align-items: flex-start;
					
					.transaction_list_title {
						height: 0.7rem;
						line-height: 0.7rem;
					}
					
					.filter_container {
						flex-direction: column;
						width: 100%;
						
						.filter_tx_type_statue_content {
							width: 3.45rem;
							display: flex;
							margin-bottom: 0.1rem;
							
							.el-select {
								margin-right: 0;
								margin-right: 0.26rem;
							}
						}
						
						.select_date_content {
							width: 3.45rem;
							display: flex;
							margin-bottom: 0.1rem;
						}
						
						.reset_search_content {
							display: flex;
							justify-content: flex-end;
							margin-bottom: 0.1rem;
							
							.reset_btn {
								margin-left: 0;
							}
							
							.tx_search_btn {
								margin-left: 0;
								margin-right: 0.1rem;
								text-align: center;
							}
						}
					}
				}
			}
			.transaction_list_table_container {
				padding-top: 0;
				// padding-left: 0.1rem;
				// padding-right: 0.1rem;
				
				.transaction_list_table_content {
					.table_list_content {
						padding-top: 0;
					}
				}
			}
		}
	}

	@media screen and (max-width: 768px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				margin: 0px;
			}
			.title_container {
				margin: 0.3rem 0.12rem 0rem 0.12rem;
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					margin: 0 0.12rem;
					.filter_container {
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {
				margin: 0 0.12rem;
				.transaction_list_table_content {
					.table_list_content {
					}
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

</style>
