<template>
	<div class="list_table_content_container">
		<div class="box-card">
			<div class="header_content">
				<slot name="txCount"></slot>
				<slot name="resetButton"></slot>
			</div>
			<div class="status_date_pick">
				<slot name="datePicket"></slot>
			</div>
			<slot name="msgType"></slot>
			<loading v-show="isSetLoadingStatus"></loading>
			<div v-show="!isSetLoadingStatus" class="scroll_container" style="margin-bottom: 0.1rem">
				<vue-scroll :ops="opsConfig">
					<el-table
						:class="isSmallTable ? 'small_style':''"
						:row-class-name="listTableRowClassName"
						:style="{width: `${tableWidth}`}"
						v-if="!isLoading"
						:data="tableList"
						stripe
						:empty-text="emptyText"
						ref="listTable">
						<el-table-column
							v-for="(item,index) in columns"
							:key="item.label"
							:prop="item.displayValue"
							:label="item.label"
							:sort-method="(a,b) => {return tableSort(item.sortName,a,b)}"
							:width="tableListWidth[index]"
							:sort-orders="item.isNeedSort ? ['descending', 'ascending'] :[]"
							:sortable="item.isNeedSort">
							<template slot="header" slot-scope="scope">
								<span :class="item.isRight ? 'center_style' : ''">{{ item.label }}</span>
								<el-tooltip v-show="item.isShowTokenSymbol && tokenSymbol"
											:content="tokenSymbol"
											placement="top">
									<i class="iconfont iconyiwen yiwen_icon"/>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<!--						blockChain-->
								<div class="status" v-if="item.isShowTxStatusIcon">
									<img class="status_icon"
										 :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
								</div>
								
								<el-tooltip popper-class="custom_tooltip" :manual="setManual(item.isNeedFormat,scope.row[item.displayValue],item)"
											:content="formatStr(scope.row[item.nativeValue],item.isNft ? scope.row[item.displayValue] : null)">
<!--									-->
                  <div>
									<router-link class="link_style"
												 :class="item.isAdjustStyle ? 'index_style' : ''"
												 :style="{color:isOwnerAddress(scope.row[item.nativeValue]) ? '#606266 !important' : '', cursor:isOwnerAddress(scope.row[item.nativeValue]) ? 'default !important' : ''}"
												 v-if="item.isLink && 
												  scope.row[item.displayValue] && 
													scope.row[item.displayValue] !== '--' && 
													!(judgeCosmos(scope.row[item.nativeValue]))"
												 :to="!item.isNft ? `${item.linkRoute}${scope.row[item.nativeValue]}` : `${item.linkRoute}${scope.row[item.nftRouterParamsValue]}${item.denomRouter}${scope.row[item.nativeValue]}`">
										
										<span v-if="item.isNeedFormatHash">{{formatTxHash(scope.row[item.displayValue]) }} </span>
										
										<span v-else-if="item.isFormatAddress">{{formatAddress(scope.row[item.displayValue]) }}</span>
										
										<span v-else-if="item.isFormatMoniker">{{formatTableMoniker(scope.row[item.displayValue]) }}</span>
										<span v-else-if="item.isFormatNftIdAndDenomId">{{formatNftIdAndDenomId(scope.row[item.displayValue]) }}</span>
										
										<span v-else>{{ scope.row[item.displayValue] }}</span>
										
									</router-link>
<!--									-->
									<span v-else-if="item.isShowTag">
										
										<el-tag class="tag_style">{{ formatTypeNotString(scope.row[item.displayValue]) }}</el-tag>
										
										<span class="tag_num">{{ setTagNum(scope.row[item.displayValue]) }}</span>
										
									</span>
									
<!--									-->
									<span v-else-if="item.isFormatAddress && !item.isHref">{{formatAddress(scope.row[item.displayValue]) }}</span>
<!--									-->
									<span v-else-if="item.isHref">
										<span v-if="judgeCosmos(scope.row[item.nativeValue])">
											{{ formatAddress(scope.row[item.displayValue]) }}
										</span>
										<a v-else-if="isShowHref(scope.row[item.displayValue])"
										   class="route_link_style"
										   :style="{color:isOwnerAddress(scope.row[item.nativeValue]) ? '#606266 !important' : ''}"
										   :href="`${item.href}/#/address/${scope.row[item.nativeValue]}`"
										   target="_blank"
										   rel="noreferrer noopener">{{ formatAddress(scope.row[item.displayValue]) }}</a>
										<span v-else>{{ formatAddress(scope.row[item.displayValue]) }}</span>
										
									</span>
<!--									-->
									<span v-else-if="item.isNftHref" class="custom_uri">
										<a v-if="testUrl(scope.row[item.displayValue])" :href="scope.row[item.displayValue]"
										   target="_blank" rel="noreferrer noopener">{{ scope.row[item.displayValue] }}</a>
										
										<a v-else-if="startStr(scope.row[item.displayValue])"
										   :href="'http://' + scope.row[item.displayValue]"
										   target="_blank">{{ scope.row[item.displayValue] }}</a>
										
										<span v-else>{{ scope.row[item.displayValue] }}</span>
										
									</span>
<!--									-->
									<span v-else-if="item.isShowDenomTip" :class="item.isRight ? 'right_style' : ''">
<!--										<span>{{ getAmount(scope.row[item.displayValue]) }}</span>-->
										<template v-if="item.isDoubleAsset">
											<template v-if="item.isLeftAsset">
												<el-tooltip 
													:manual="isShowDenomTip( scope.row && scope.row.swapDenomTheme1 && scope.row.swapDenomTheme1.tooltipContent ? scope.row.swapDenomTheme1.tooltipContent  :'')"
													:content="scope.row && scope.row.swapDenomTheme1 && scope.row.swapDenomTheme1.tooltipContent ? scope.row.swapDenomTheme1.tooltipContent  :''" 
													placement="top">
													<span class="denom_style" :style="{ color: scope.row && scope.row.swapDenomTheme1 && scope.row.swapDenomTheme1.denomColor ? scope.row.swapDenomTheme1.denomColor : '' }">
														{{getAmountUnit(scope.row[item.displayValue]) }}
													</span>
												</el-tooltip>
											</template>
								      <template v-else>
												<el-tooltip 
													:manual="isShowDenomTip( scope.row && scope.row.swapDenomTheme2 && scope.row.swapDenomTheme2.tooltipContent ? scope.row.swapDenomTheme2.tooltipContent  :'')"
													:content="scope.row && scope.row.swapDenomTheme2 && scope.row.swapDenomTheme2.tooltipContent ? scope.row.swapDenomTheme2.tooltipContent  :''" 
													placement="top">
													<span class="denom_style" :style="{ color: scope.row && scope.row.swapDenomTheme2 && scope.row.swapDenomTheme2.denomColor ? scope.row.swapDenomTheme2.denomColor : '' }">
														{{getAmountUnit(scope.row[item.displayValue]) }}
													</span>
												</el-tooltip>
											</template>
											
										</template>
										<template v-else>
											<el-tooltip 
												:manual="isShowDenomTip( scope.row && scope.row.denomTheme && scope.row.denomTheme.tooltipContent ? scope.row.denomTheme.tooltipContent  :'')"
												:content="scope.row && scope.row.denomTheme && scope.row.denomTheme.tooltipContent ? scope.row.denomTheme.tooltipContent  :''" 
												placement="top">
												<span class="denom_style" :style="{ color: scope.row && scope.row.denomTheme && scope.row.denomTheme.denomColor ? scope.row.denomTheme.denomColor : '' }">
													{{getAmountUnit(scope.row[item.displayValue]) }}
												</span>
											</el-tooltip>
										</template>
										
										<el-tooltip>

										</el-tooltip>
										
									</span>
<!--									-->
									<span :class="item.isAdjustStyle ? 'index_style' : ''" v-else-if="item.isShowIndex">{{scope.$index+1}}</span>
<!--									-->
									<div v-else-if="item.isShowMonikerImg" style="display: flex;
										align-items: center;
										position: relative">
										<span v-if="scope.row[item.isDisplayIconValue]" class="avatar"
											  style="width: 0.3rem;
											  height: 0.3rem;
											  border-radius: 0.3rem;
											  overflow: hidden;
											  display: flex;
											  align-items: center;
											  justify-content: center"
										>{{scope.row[item.isDisplayIconValue] || '--'}}</span>
										<img v-if="scope.row[item.imgUrlValue]"
											 style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;position: absolute"
											 :src="scope.row[item.imgUrlValue] ? scope.row[item.imgUrlValue] : ''"/>
										<el-tooltip popper-class="tooltip" :disabled="!scope.row.isTooltip"
													:content="scope.row.monikerValue" placement="top">
											<router-link style="margin-left: 0.2rem;" :to="'staking/' + scope.row.operatorAddress"
														 class="link_style">{{ scope.row.moniker }}
											</router-link>
										</el-tooltip>
									</div>
<!--									-->
									<div v-else-if="item.isProposalStatus">
										<proposal-status-component
											:status="scope.row[item.proposalStatus]"
											:final-votes="scope.row[item.finalVotes]"></proposal-status-component>
									</div>
<!--									-->
									<div v-else-if="item.flMoniker">
										<el-tooltip v-show="scope.row.isValidator"
													:content="scope.row.address"
													placement="top">
											<router-link :to="`/staking/${scope.row.address}`">{{ formatMoniker(scope.row.moniker, monikerNum.otherTable) || formatAddress(scope.row.address) }}</router-link>
										</el-tooltip>
										<el-tooltip v-show="!scope.row.isValidator"
													:content="scope.row.voter"
													placement="top">
											<router-link :to="`/address/${scope.row.voter}`">{{ formatAddress(scope.row.voter) }}</router-link>
										</el-tooltip>
									</div>
									<div v-else-if="item.flDepositor">
										<el-tooltip :content="scope.row.depositor" placement="top" :disabled="isValid(scope.row.moniker)">
											<router-link :to="`/address/${scope.row.depositor}`">{{ formatMoniker(scope.row.moniker, monikerNum.otherTable) || formatAddress(scope.row.depositor) }}</router-link>
										</el-tooltip>
									</div>
<!--									-->
									<span v-else-if="item.isFormatNftIdAndDenomId" >
										{{ formatNftIdAndDenomId(scope.row[item.displayValue])}}</span>
									<span v-else-if="item.isFormatPoolId">
										{{ formatPoolId(scope.row[item.displayValue])}}
									</span>
									<span v-else :class="item.isWrap ? 'wrap_style' : item.isRight ? 'right_style' : '' " >
										{{ scope.row[item.displayValue] === 0 || scope.row[item.displayValue] === '0' ? 0 : scope.row[item.displayValue] || '--' }}
									</span>

									</div>	
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
				</vue-scroll>
			</div>
			<div class="list_component_footer" v-show="!isShowFooter">
				<div class="token_type_container">
					<div class="tooltip_box" v-if="isShowTokenType" v-show="isShowIbc || isShowHashLock">
						<span class="tooltip_title">Cross-chain TokenType:</span>
						<span class="tooltip_title_box">
                    		<span class="tooltip_title_IBC" v-show="isShowIbc">IBC</span>
                    		<span class="tooltip_title_HTLT" v-show="isShowHashLock">Hash Lock</span>
                 	 </span>
					</div>
				</div>
				<div class="pagination_container">
					<m-pagination v-show="dataCount !==0"
								  :page-size="pageSize"
								  :total="dataCount"
								  :page="pageNum"
								  :page-change="pageChange"></m-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Loading from "./Loading";
import MPagination from "./MPagination";
import Tools from "../../util/Tools";
import {formatMoniker, getConfig,getTxType} from "../../helper/IritaHelper";
import prodConfig from "../../productionConfig"
import BigNumber from 'bignumber.js';
import {
	TX_TYPE,
	TX_STATUS,
	ColumnMinWidth,
	monikerNum,
	decimals,
	IRIS_ADDRESS_PREFIX,
	COSMOS_ADDRESS_PREFIX,
	NFT_AND_DENOM_SPLIT_NUM,
	PRODUCT_WENCHANG,
} from '../../constant';
import {fetchAllTokens} from "../../service/api";
import ProposalStatusComponent from "../Gov/ProposalStatusComponent";

export default {
	name: "ListComponent",
	components: {ProposalStatusComponent, MPagination, Loading},
	data() {
		return {
			monikerNum,
			TX_TYPE_DISPLAY:{},
			formatMoniker,
			isSetLoadingStatus: false,
			isShowFee: prodConfig.fee.isShowFee || false,
			isShowProposer: prodConfig.blockList.proposer || false,
			productName: prodConfig.product || '',
			tableList: [],
			columns: [],
			TX_STATUS,
			isShowTooltip: false,
			tagNum: '',
			pageNum: 1,
			pageSize: 10,
			dataCount: 0,
			sessionStorage: sessionStorage.getItem('config') || null,
			isShowIbc: false,
			isShowHashLock: false,
			tableListWidth: [],
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
					checkShifKey: true
				}
			}
		}
	},
	props: {
		tokenSymbol: {
			type: String,
			default: ''
		},
		isShowFooter:{
			type:Boolean,
			default:false
		},
		isLoading: {
			type: Boolean,
			default: false
		},
		pagination: {
			type: Object,
			default: {}
		},
		columnList: {
			type: Array,
			default: []
		},
		listData: {
			type: Array,
			default: []
		},
		emptyText: {
			type: String,
			default: ''
		},
		isShowTokenType: {
			type: Boolean,
			default: false
		},
		tableWidth: {
			type: String,
			default: 'auto'
		},
		isSmallTable:{
			type:Boolean,
			default: false
		}
	},
	watch: {
		columnList: {
			handler(newValue, oldValue) {
				this.columns = []
				this.columns = newValue
				if (!this.isShowFee) {
					this.deleteColumnFee()
				}else if(this.productName === PRODUCT_WENCHANG){
					this.changeFeeColumnLabel()
				}
				if (!this.isShowProposer) {
					this.deleteProposer()
				}
				this.getTableWidth()
			},
			deep: true
		},
		listData: {
			handler(newValue, oldValue) {
				this.getTxTypeData()
				this.tableList = newValue
			},
			deep: true
		},
		isLoading: {
			handler(newValue, oldValue) {
				if(newValue){
					this.isSetLoadingStatus = newValue
				}else {
					this.getTableWidth()
				}
			},
			deep: true
		},
		pagination: {
				handler(newValue, oldValue) {
					if (JSON.stringify(newValue) !== '{}') {
						this.pageNum = newValue.pageNum
						this.pageSize = newValue.pageSize
						this.dataCount = newValue.dataCount
					}
				this.getTableWidth()
			},
			deep: true
		}
	},
	methods: {
		isOwnerAddress(address){
			if(this.$route.params?.param && address === this.$route.params.param){
				return true
			}
			if(this.$route.params.height && address == this.$route.params.height){
				return true
			}
			return  false
		},
		percentSort(a, b, c) {
			a = Number(a.substring(0, a.length - c))
			b = Number(b.substring(0, b.length - c))
			return a - b
		},
		bigNumberSort(a, b, c) {
			// a = a.substring(0, a.length - c).replace(/,/g, '')
			// b = b.substring(0, b.length - c).replace(/,/g, '')
			a = new BigNumber(a || 0).toNumber()
			b = new BigNumber(b || 0).toNumber()
			return a - b
		},
		tableSort(name,a, b) {
			/*由于组件的问题，排序逻辑写在了子组件里，目前这块逻辑只针对验证人列表*/
			switch (name){
				case 'commissionSort':
					return this.percentSort(a.commission, b.commission, 2)
				case 'bondedTokenSort':
					return this.bigNumberSort(a.bondedToken, b.bondedToken, 5)
				case 'votingPowerSort':
					return this.percentSort(a.votingPower, b.votingPower, 1)
				case 'uptimeSort':
					return this.percentSort(a.uptime, b.uptime, 1)
				case 'selfBondSort':
					return this.bigNumberSort(a.selfBond, b.selfBond, 5)
				case 'unbondingHeight':
					return this.bigNumberSort(a.unbondingHeight, b.unbondingHeight, 0)
				case 'moniker':
					return this.strSort(a, b)
			}
		},
		strSort(a,b){
			if(a?.monikerValue && b.monikerValue){
				if(a.monikerValue > b.monikerValue){
					return 1
				}else {
					return -1
				}
			}
		},
		listTableRowClassName({row,rowIndex}){
			if (rowIndex%2==0) {
				return 'statistics-blue-row';
			} else {
				return 'statistics-white-row';
			}
		},
		setManual(isNeed, data, item) {
			if (isNeed || Array.isArray(data)) {
				// 如果不满足超长省略 ...，则不需要鼠标划上再完整显示
				if(typeof data  === 'string' && data?.length <= NFT_AND_DENOM_SPLIT_NUM.num){
					return true
				}
				// 目的同上，针对处理uri
				if(item.isNftHref){
					return data.length <= NFT_AND_DENOM_SPLIT_NUM.uriNum
				}
				if (data?.length <= 1) {
					return true
				}
				if (!data || data === '--') {
					return true
				}
				return false
			}
			return true
		},
		isValid(value) {
			return !value || !value.length || value == '--' ? false : true
		},
		testUrl(url){
			return Tools.testUrl(url)
		},
		startStr(url) {
			return url.startsWith('www.')
		},
		isShowDenomTip(denom) {
			if (denom) {
				return false
			}
			return true
		},
		pageChange(pageNum) {
			this.$emit('pageChange', pageNum)
		},
		getAmount(amount) {
			if (amount === ' ' || amount === '-') {
				return " ";
			}
			if (amount === '--' || !amount) {
				return '--'
			}
			return amount
			let denomRule = /[0-9.]+/
			// return amount.match(denomRule)[0] ;
		},
		getAmountUnit(amount) {
			if (amount === ' ' || amount === '-') {
				return "";
			}
			if (amount === '--' || !amount  ) {
				return ''
			}
			let denomRule = /[A-Za-z\/]+/
			return amount
			// return  amount.match(denomRule)?.length >= 1 ? amount.match(denomRule)[0] : '';
		},
		isShowHref(address) {
			let storageAddressPrefix = JSON.parse(this.sessionStorage) || null
			let addressPrefix = null
			if (storageAddressPrefix) {
				addressPrefix = storageAddressPrefix.addressPrefix
			} else {
				getConfig().then(res => {
					addressPrefix = res.addressPrefix
				});
			}
			if (addressPrefix.iva) {
				let length = addressPrefix.iva.length
				if (address) {
					let isIris = addressPrefix.iaa === IRIS_ADDRESS_PREFIX,
						isCosmos = addressPrefix.iaa === COSMOS_ADDRESS_PREFIX;
					if (address.substring(0, length) === addressPrefix.iva) {
						return 'false'
					} else if (isIris && address.startsWith(COSMOS_ADDRESS_PREFIX)) {
						return 'true'
					} else if (isCosmos && address.startsWith(IRIS_ADDRESS_PREFIX)) {
						return 'false'
					} else if (address.startsWith(IRIS_ADDRESS_PREFIX) || address.startsWith(COSMOS_ADDRESS_PREFIX)) {
						return 'false'
					}
				} else {
					return 'false'
				}
			}
		},
		formatTableMoniker(moniker) {
			if (moniker) {
				return formatMoniker(moniker, monikerNum.validatorList)
			}
			return '--'
		},
		formatTxHash(TxHash) {
			if (TxHash) {
				return Tools.formatTxHash(TxHash)
			}
			return '--'
		},
		formatAddress(address) {
			if (address) {
				return Tools.formatValidatorAddress(address)
			}
			return '--'
		},
		formatNftIdAndDenomId(NftIdOrDenomId){

			if(NftIdOrDenomId){
				return Tools.formatString(NftIdOrDenomId,NFT_AND_DENOM_SPLIT_NUM.num,'...')
			}
			return '--'
		},
		formatPoolId(poolId){
			if(poolId){
				return Tools.formatString(poolId, 4,'...')
			}else{
				return '--'
			}
		},
		formatStr(str, displayStr) {
			if(displayStr){
				return  displayStr+''
			}
			if (str && Array.isArray(str)) {
				let {txType} = Tools.urlParser();
				if(!txType){
					txType = sessionStorage.getItem('currentChoiceMsgType') ? sessionStorage.getItem('currentChoiceMsgType'):undefined;
				}
				let msgTxTypeIndex = 0, tmp = str[0]
				str.forEach((item, index) => {
					if (txType && item === txType) {
						msgTxTypeIndex = index
					}
				})
				if (msgTxTypeIndex !== 0) {
					str[0] = txType
					str[msgTxTypeIndex] = tmp
				}
				
				let data = str.reduce(function (prev, next) {
					prev[next] = (prev[next] + 1) || 1;
					return prev;
				}, {});
				let formatStr = ''
				for (let dataKey in data) {
					dataKey = dataKey.toLowerCase()
					formatStr += `${this.TX_TYPE_DISPLAY[dataKey] || dataKey} *${data[dataKey] || dataKey},`
				}
				return formatStr.substring(0, formatStr.length - 1)
			} else {
				return this.TX_TYPE_DISPLAY[str?.toString()] || this.TX_TYPE_DISPLAY[str] || str?.toString() || str
			}
		},
		setTagNum(value) {
			if (Array.isArray(value)) {
				if (value.length > 1) {
					return `+${value.length - 1}`
				}
				return ''
			}
			return ''
		},
		formatTypeNotString(value) {
			if (Array.isArray(value)) {
				if (value.length > 1) {
					this.tagNum = value.length - 1
					this.isShowTooltip = true
					const currentChoiceTxType = sessionStorage.getItem('currentChoiceMsgType') || ''
					let displayMsgType = ''
					value.forEach(item => {
						if (item === currentChoiceTxType) {
							displayMsgType = item
						} else {
							displayMsgType = value[0]
						}
					})
					
					return this.TX_TYPE_DISPLAY[displayMsgType] || displayMsgType
				} else {
					this.isShowTooltip = false
					return this.TX_TYPE_DISPLAY[value[0]] || value[0]
				}
			} else {
				this.isShowTooltip = false
				return this.TX_TYPE_DISPLAY[value] || value
			}
		},
		async getTxTypeData() {
			try {
				let res = await getTxType()
				this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
			} catch (error) {
				console.log(error)
			}
		},
		/**
		 * 修改fee列的展示名字为 能量值  
		 * src\components\tableListColumnConfig\txCommonLatestTable.js  
		 *  修改 label:i18n.t('ExplorerLang.table.fee') => label:i18n.t('ExplorerLang.table.energy')
		 */
		changeFeeColumnLabel(){
			const index = this.columns.findIndex(item => {
				return item?.label === this.$t('ExplorerLang.table.fee')
			})
			if(index !== -1){
				this.columns[index]['label'] = this.$t('ExplorerLang.table.energy')
				// this.columns[index]['isShowTokenSymbol'] = false
			}
		},
		deleteColumnFee() {
			this.columns = this.columns.filter(item => {
				return item?.label !== this.$t('ExplorerLang.transactionInformation.fee')
			})
		},
		deleteProposer() {
			this.columns = this.columns.filter(item => {
				return item?.label !== this.$t('ExplorerLang.table.proposer')
			})
		},
		async getAllTokens() {
			let allTokens = sessionStorage.getItem('allToken') ? JSON.parse(sessionStorage.getItem('allToken')) : await fetchAllTokens()
			if (allTokens?.supply?.length) {
				let ibcTokens = [], htltTokens = []
				ibcTokens = allTokens.supply.filter(item => {
					if (item?.denom && item.denom.startsWith('ibc')) {
						return item
					}
				})
				htltTokens = allTokens.supply.filter(item => {
					if (item?.denom && item.denom.startsWith('htlt')) {
						return item
					}
				})
				if (ibcTokens?.length) {
					this.isShowIbc = true
				}
				if (htltTokens?.length) {
					this.isShowHashLock = true
				}
			}
		},
		refWidth(){
			this.getTableWidth()
		},
		getTableWidth () {
			this.tableListWidth = []
			let listTableTimer = null
			this.$nextTick(() => {
				listTableTimer = setInterval(() => {
					if(this.$refs['listTable']?.$el){
						let tableWidth = this.$refs['listTable'].$el.scrollWidth
						clearInterval(listTableTimer)
						//这里拿到的是 table 内容实际的占用空间 实际占用的空间小于 table 列表的宽度，需要为每一列设置一个补偿量，列表内容充满 table
						this.tableListWidth = this.$adjustColumnWidth(this.$refs['listTable'].$el);
						if(this.tableListWidth?.length){
							//计算出实际内容占用的空间
							let practicalWidth = this.tableListWidth.reduce((totalWidth,currentWidth) => {
								return totalWidth + currentWidth
							})
							// 由于某些情况如验证人列表的索引，所在那一列不需要进行补偿（如果补偿会造成那一列宽度过宽），所以需要进行二次补偿
							let secondPracticalWidthCount = this.tableListWidth.filter(item => {
								return item <= 40
							})
							// 为每一列设置补偿量
							if(practicalWidth < tableWidth && this?.columns?.length){
								let compensationWidth = (tableWidth - practicalWidth) / this.columns.length
								if(compensationWidth < 20){
									compensationWidth = 20
								}
								let secondPracticalWidth = 0
								if(secondPracticalWidthCount?.length){
									secondPracticalWidth = (compensationWidth * secondPracticalWidthCount.length) / (this.columns.length - secondPracticalWidthCount.length )
								}
								this.tableListWidth = this.tableListWidth.map( (item, index) => {
									if(item <= 40){
										item = 40
										return item
									}else {
										const label = this.columns[index]['label']
										if(label === this.$t('ExplorerLang.table.energy') || label === this.$t('ExplorerLang.table.fee')){
											// 对fee/能量值 这一列要给足宽度160
											return ColumnMinWidth.fee;
										}else if(!label.trim()){
											// 同时减少下 denom 列的宽度
											return ColumnMinWidth.listDenom
										}else{
											return parseInt((item + compensationWidth + secondPracticalWidth))
										}
									}
								})
							}
						}
						if(this.isSmallTable){
							this.$refs['listTable'].$el.style.width = `550px`
						}
						this.isSetLoadingStatus = false
					}
				},50);
			});
		},
		judgeCosmos(address){
			if(!address){
				return address
			}
			return (address + '').startsWith(COSMOS_ADDRESS_PREFIX)
		}
	},
	mounted() {
		this.getTxTypeData()
		if (JSON.stringify(this.pagination) !== '{}') {
			this.pageNum = this.pagination.pageNum
			this.pageSize = this.pagination.pageSize
			this.dataCount = this.pagination.dataCount
		}
		window.addEventListener("resize", this.refWidth,true);
		this.columns = []
		this.columns = this.columnList
		this.getTableWidth()
		if (!this.isShowFee) {
			this.deleteColumnFee()
		}else if(this.productName === PRODUCT_WENCHANG){
			this.changeFeeColumnLabel()
		}

		if (!this.isShowProposer) {
			this.deleteProposer()
		}
		this.tableList = this.listData
		this.getAllTokens()
	}
}
</script>

<style scoped lang="scss">

.list_table_content_container {
	.box-card {
		box-sizing: border-box;
		padding: 0.08rem 0.2rem 0 0.2rem;
		border-radius: 0.08rem;
		border: none;
		box-shadow: 0 0.03rem 0.06rem 0 #EDEDED;
		margin-bottom: 0.2rem;
		background: #fff;
		.avatar {
			background: $bg_avatar;
		}
		
		.header_content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			@media (max-width: 1150px) {
			
			}
		}
		::v-deep.small_style{
			overflow: hidden !important;
			.el-table__header{
				width: 5.5rem !important;
			}
			.el-table__body{
				width: 5.5rem !important;
				tbody{
					width: 5.5rem !important;
				}
			}
		}
		.el-table__header-wrapper{
		
		}
		.denom_style{
			//width: auto;
			//overflow: hidden;
			//white-space: nowrap;
			//text-overflow: ellipsis;
			position: relative;
			top:0;
			left: -0.1rem;
		}
		.list_component_footer {
			display: flex;
			justify-content: space-between;
			padding: 0.2rem 0;
			@media (max-width: 768px) {
				flex-direction: column-reverse;
			}
			.token_type_container {
				display: flex;
				align-items: center;
				@media (max-width: 768px) {
					margin-top: 0.2rem;
				}
				.tooltip_box {
					display: flex;
					align-items: center;
					background-color: white;
					padding: 0.05rem 0.2rem;
					font-size: $s12;
					color: #8d8b8b;
					border: 0.01rem solid rgba(231, 234, 243, 1);
					border-radius: 0.08rem;
					@media (max-width: 375px) {
						flex-direction: column;
						justify-content: flex-start;
						align-items: flex-start;
					}
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
						@media (max-width: 375px) {
							margin-top: 0.04rem;
							margin-left: 0.14rem;
						}
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
	
		.el-card__body {
			width: 100%;
			height: 100%;
			padding: 0;
			border-radius: 0.8rem;
		}
		
		.link_style {
			color: $t_link_c !important;
		}
		
		.tag_style {
			font-size: 0.14rem !important;
			background: $tag_c !important;
			border: none;
			color: $theme_c !important;
		}
		
		.yiwen_icon {
			cursor: pointer;
		}
		.wrap_style{
			white-space: normal !important;
			width: 3.16rem !important;
		}
		.route_link_style {
			color: $theme_c !important;
			//white-space: normal !important;
		}
		.href_route_link_style{
			color: $theme_c !important;
			white-space: normal !important;
			
		}
		.custom_uri{
			width: 1.45rem;
			display: inline-block;
			text-overflow:ellipsis;
			overflow: hidden;
		}
		.tag_num {
			color: $theme_c !important;
			margin-left: 0.06rem;
			font-size: 0.12rem;
		}
		::v-deep.el-table{
			/*tbody{
				tr{
					td{
						padding: 0.07rem 0 !important;
					}
					
				}
			}*/
			.caret-wrapper{
				box-sizing: border-box;
				top:0.02rem;
				display: inline-block !important;
				.sort-caret{
					.descending{
						background: blue !important;
					}
				}
				
			}
		}
		.index_style{
			width: 0.4rem !important;
		}
		::v-deep.el-table .descending .sort-caret.descending {
			border-top-color: $theme_c;
		}
		::v-deep.el-table .ascending .sort-caret.ascending {
			border-bottom-color: $theme_c;
		}
		.el-table td, .el-table th.is-leaf {
			border-bottom: 0.01rem solid rgba(248, 248, 248, 1);
		}
		
		::v-deep.scroll_container {
			.__vuescroll {
				.__panel {
					scrollbar-width: none;
					-ms-overflow-style: none;
					scrollbar-color: transparent transparent !important;
					scrollbar-track-color: transparent !important;
					-ms-scrollbar-track-color: transparent !important;
					
					&::-webkit-scrollbar {
						width: 0 !important
					}
				}
			}
		}
		
		
		::v-deep.cell {
			display: flex;
			align-items: center;
			white-space: nowrap;
			width: 100%;
			
			.center_style{
				position: absolute;
				left: 80%;
				overflow: visible !important;
			}
			.right_style{
				width: 120%;
				text-align: right;
				display: inline-block;
				.denom_style{
					position: relative;
					top:0;
					left: 0;
				}
			}
			.status {
				display: flex;
				align-items: center;
				justify-content: center;
				
				.status_icon {
					width: 0.13rem;
					height: 0.13rem;
					margin-right: 0.05rem;
				}
			}
		}
		
	}
}

.table_content_container .box-card.scroll_container .__vuescroll .__panel {
	scrollbar-color: transparent transparent !important;
}
a{
	white-space: nowrap;
	color: $theme_c !important;
}
</style>