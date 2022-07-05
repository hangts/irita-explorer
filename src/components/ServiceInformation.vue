<template>
	<div class="service_information_container">
		<div class="service_information_content_wrap">
			<p class="service_information_title">
				{{ $t('ExplorerLang.serviceDetail.serviceDefinition') }}
				{{ $route.query.serviceName }}
			</p>
			<div class="service_information_definition_content">
				<h3 class="service_information_definition_title">
					{{ $t('ExplorerLang.serviceDetail.primary') }}
				</h3>
				<div class="service_information_content" :class="productionConfig.lang === 'CN' ? 'cn': ''">
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.description') }}：</span>
						<span>{{ description }}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.author') }}：</span>
						<span>
                            <router-link :to="`/address/${author}`">{{ author }}</router-link>
                        </span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.authorDescription') }}：</span>
						<span>{{ authorDescription }}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.schema') }}：</span>
						<LargeString :isShowPre="Tools.isJSON(schemas)" v-if="schemas" :text="schemas"
						             :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.tags') }}：</span>
						<span>{{ tags }}</span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.hash') }}：</span>
						<span>
                             <router-link :to="`tx?txHash=${hash}`">
                                {{ hash }}
                            </router-link>
                        </span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.height') }}：</span>
						<span>
                            <router-link :to="`/block/${height}`">{{ height }}</router-link>
                        </span>
					</p>
					<p class="service_information_text_content">
						<span>{{ $t('ExplorerLang.serviceDetail.time') }}：</span>
						<span>{{ time }}</span>
					</p>
				
				</div>
			</div>
			
			<div class="service_information_bindings_content">
				<h3 class="service_information_binding_title">
					{{ $t('ExplorerLang.serviceDetail.serviceBindings.providers') }}</h3>
				<div class="service_information_bindings_table_content">
					<el-table class="table" :data="serviceList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
						<el-table-column class-name="address" :min-width="ColumnMinWidth.address"
						                 :label="$t('ExplorerLang.table.provider')">
							<template slot-scope="scope">
                                <span>
                                    <el-tooltip placement="top" :content="scope.row.provider">
                                    <router-link :to="`/address/${scope.row.provider}`">
                                        {{ Tools.formatValidatorAddress(scope.row.provider) }}
                                    </router-link>
                                </el-tooltip>

                                </span>
							</template>
						</el-table-column>
						<el-table-column :min-width="ColumnMinWidth.respondTimes" :label="$t('ExplorerLang.table.respondTimes')">
							<template slot-scope="scope">
                                <span>
                                    <router-link
	                                    :to="`service/respond/${$route.query.serviceName}/${scope.row.provider}`">
                                        {{ `${scope.row.respondTimes} ${$t('ExplorerLang.unit.time')}` }}
                                    </router-link>
                                </span>
							</template>
						</el-table-column>
						<el-table-column :min-width="ColumnMinWidth.available"
						                 :label="$t('ExplorerLang.table.isAvailable')">
							<template slot-scope="scope">
								<div class="service_information_available_container">
									<img class="service_tx_status"
									     v-if="scope.row.available"
									     src="../assets/true.png"/>
									<img class="service_tx_status"
									     v-else
									     src="../assets/false.png"/>
									<span>
                                        {{ scope.row.isAvailable }}
                                    </span>
								</div>
							
							</template>
						</el-table-column>
						<!-- <el-table-column :min-width="ColumnMinWidth.price"
														 :label="$t('ExplorerLang.table.price')"
														 prop="price"></el-table-column>
						<el-table-column :min-width="ColumnMinWidth.deposit"
														 :label="$t('ExplorerLang.table.deposit')"
														 prop="deposit"></el-table-column> -->
						<el-table-column :min-width="ColumnMinWidth.qos" :label="$t('ExplorerLang.table.minBlock')"
						                 prop="qos"></el-table-column>
						<el-table-column :min-width="ColumnMinWidth.time"
						                 :label="$t('ExplorerLang.table.bindTime')"
						                 prop="bindTime"></el-table-column>
						<el-table-column :width="ColumnMinWidth.time"
						                 :label="$t('ExplorerLang.table.disabledTime')"
						                 prop="disabledTime"></el-table-column>
					</el-table>
				</div>
				<div class="pagination_content" v-show="providerCount > providerPageSize">
					<m-pagination :page-size="providerPageSize"
					              :total="providerCount"
					              :page="providerPageNum"
					              :page-change="providerPageChange">
					</m-pagination>
				</div>
			</div>
			
			<div class="service_information_transaction_content">
				<h3 class="service_information_transaction_title">
					{{ $t('ExplorerLang.serviceDetail.serviceTransactions') }}
				</h3>
				<!--                <div class="service_information_transaction_condition_container">
														<span class="service_information_transaction_condition_count">
																{{`${txCount} ${$t('ExplorerLang.unit.Txs')}`}}
														</span>
														<el-select popper-class="tooltip" v-model="type" filterable>
																<el-option v-for="(item, index) in txTypeOption"
																					 :key="index"
																					 :label="item.label"
																					 :value="item.value"></el-option>
														</el-select>
														<el-select popper-class="tooltip" v-model="status">
																<el-option v-for="(item, index) in statusOpt"
																					 :key="index"
																					 :label="item.label"
																					 :value="item.value"></el-option>
														</el-select>
														<div class="tx_type_mobile_content">
																<div class="search_btn" @click="handleSearchClick">
																		{{$t('ExplorerLang.transactions.search')}}
																</div>
																<div class="reset_btn" @click="resetFilterCondition">
																		<i class="iconfont iconzhongzhi"></i>
																</div>
														</div>
												</div>-->
				<!-- :is-show-token-type="true"
-->
				<div class="service_information_transaction_table_content">
					<list-component
						:token-symbol="mainTokenSymbol"
						:is-loading="isIserviceLoading"
						:list-data="transactionArray"
						:column-list="iServiceTxColumn"
						:pagination=" {pageSize:Number(txPageSize),dataCount:txCount,pageNum:Number(txPageNum)}"
						@pageChange="pageChange"
						:empty-text="$t('ExplorerLang.table.emptyDescription')"
					>
						<template v-slot:msgType>
							<tabs-component :tab-list="txTypeOption"
							                @onSelectMagModel="handleSearchClick"></tabs-component>
						</template>
						
						<template v-slot:datePicket>
							<tx-status-tabs-components
								:isShowDatePicker="false"
								@onChangTxStatus="changeTxStatus"
								@onChangeDate="changeTime"
								@resetParams="resetFilterCondition"></tx-status-tabs-components>
						</template>
						<template v-slot:txCount>
							<tx-count-component :title="$t('ExplorerLang.transactions.txs')" :icon="'iconTrainsaction'"
							                    :tx-count="txCount"></tx-count-component>
						</template>
					
					</list-component>
					<!--                    <el-table class="table" :data="transactionArray" :empty-text="$t('ExplorerLang.table.emptyDescription')">
																	<el-table-column class-name="hash_status" :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
																			<template slot-scope="scope">
																					<img class="service_tx_status"
																							 v-if="scope.row.status === TX_STATUS.success"
																							 src="../assets/success.png"/>
																					<img class="service_tx_status"
																							 v-else
																							 src="../assets/failed.png"/>
																					<el-tooltip placement="top" :content="scope.row.txHash">
																							<router-link :to="`tx?txHash=${scope.row.txHash}`">
																									{{formatTxHash(scope.row.txHash)}}
																							</router-link>
																					</el-tooltip>
					
																			</template>
																	</el-table-column>
																	<el-table-column class-name="tx_type" :width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')">
																			<template slot-scope="scope">
																					<el-tooltip :content="scope.row.type.join(',')"
																											placement="top-start"
																											:disabled="scope.row.msgCount <= 1">
																							<div class="ty_type_message">
																									<span>{{getDisplayTxType(scope.row.type)}}</span>
																									<span class="message_number" v-if="scope.row.msgCount != 1">+{{scope.row.msgCount - 1}}</span>
																							</div>
																					</el-tooltip>
																			</template>
																	</el-table-column>
					
																	<el-table-column class-name="requestId" :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
																			<template slot-scope="scope">
																					<el-tooltip placement="top" :content="scope.row.id" :disabled="!isValid(scope.row.id)">
																							<span>{{formatAddress(scope.row.id)}}</span>
																					</el-tooltip>
																			</template>
																	</el-table-column>
																	<el-table-column v-if="isShowFee" prop="fee" :label="$t('ExplorerLang.table.fee')" align="right" :min-width="ColumnMinWidth.fee">
																			<template slot="header" slot-scope="scope">
																					<span>{{ $t('ExplorerLang.table.fee')}}</span>
																					<el-tooltip :content="mainTokenSymbol"
																											placement="top">
																							<i class="iconfont iconyiwen yiwen_icon" />
																					</el-tooltip>
																			</template >
																	</el-table-column>
																	<el-table-column class-name="from" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.from')">
																			<template slot-scope="scope">
					
																					<el-tooltip placement="top" :content="scope.row.from"
																											:disabled="!isValid(scope.row.from)">
																							<router-link v-if="isValid(scope.row.from)" :to="`/address/${scope.row.from}`">
																									{{formatAddress(scope.row.from)}}
																							</router-link>
																							<span v-else>&#45;&#45;</span>
																					</el-tooltip>
																			</template>
																	</el-table-column>
					
																	<el-table-column class-name="to" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.to')">
																			<template slot-scope="scope">
																					<el-tooltip placement="top" :content="String(scope.row.to)"
																									:disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
																							<router-link v-if="typeof scope.row.to=='string' && isValid(scope.row.to)" :to="`/address/${scope.row.to}`">
																									{{formatAddress(scope.row.to)}}
																							</router-link>
																							<router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
																									{{ `${scope.row.to.length} ${$t('ExplorerLang.unit.providers')}`}}
																							</router-link>
																							<span v-else>{{'&#45;&#45;'}}</span>
																					</el-tooltip>
																			</template>
																	</el-table-column>
																	<el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
																			<template slot-scope="scope">
																					<router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
																			</template>
																	</el-table-column>
					
																	<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')"
																									 prop="timestamp"></el-table-column>
															</el-table>-->
				</div>
				<!--                <div class="pagination_content" v-show="txCount > txPageSize">
														<keep-alive>
																<m-pagination :page-size="Number(txPageSize)"
																		:total="txCount"
																		:page="Number(txPageNum)"
																		:page-change="pageChange">
																</m-pagination>
														</keep-alive>
												</div>-->
			</div>
		
		</div>
	</div>
</template>

<script>
import Tools from "../util/Tools"
import MPagination from "./common/MPagination";
import {TX_STATUS, ColumnMinWidth, decimals, TX_TYPE} from '../constant';
import {
	getAllServiceTxTypes,
	getServiceDetail,
	getServiceBindingTxList,
	getServiceTxList,
	getServiceBindingByServiceName
} from "../service/api";
import {TxHelper} from "../helper/TxHelper";
import LargeString from './common/LargeString';
import {converCoin, getMainToken, getTxType} from '@/helper/IritaHelper';
import productionConfig from '@/productionConfig.js'
import ListComponent from "./common/ListComponent";
// import iserviceTxColumn from "./tableListColumnConfig/iserviceTxColumn";
import TabsComponent from "./common/TabsComponent";
import TxStatusTabsComponents from "./common/TxStatusTabsComponents";
import TxCountComponent from "./TxCountComponent";
import txCommonTable from "./tableListColumnConfig/txCommonTable";
import {needAddColumn} from "./tableListColumnConfig/allTxTableColumnConfig";
import txCommonLatestTable from "./tableListColumnConfig/txCommonLatestTable";
import SignerColunmn from "./tableListColumnConfig/SignerColunmn";

export default {
	name: "ServiceInformation",
	components: {TxCountComponent, TxStatusTabsComponents, TabsComponent, ListComponent, MPagination, LargeString},
	data() {
		return {
			iServiceTxColumn: [],
			isIserviceLoading: false,
			TX_TYPE_DISPLAY: {},
			isShowFee: productionConfig.fee.isShowFee,
			isShowDenom: productionConfig.fee.isShowDenom,
			feeDecimals: decimals.fee,
			TX_STATUS,
			productionConfig,
			ColumnMinWidth,
			from: '',
			chainId: '',
			publisher: '',
			description: '',
			idlContent: '',
			serviceList: [],
			transactionArray: [],
			txPageSize: 5,
			txPageNum: 1,
			txCount: 0,
			author: '',
			authorDescription: '',
			name: '',
			schemas: '',
			tags: '',
			hash: '',
			height: '',
			time: '',
			providerPageSize: 10,
			providerCount: 0,
			providerPageNum: 1,
			Tools,
			txType: '',
			txStatus: '',
			status: '',
			type: '',
			statusOpt: [
				{
					value: '',
					label: this.$t('ExplorerLang.common.allTxStatus')
				},
				{
					value: 1,
					label: this.$t('ExplorerLang.common.success')
				},
				{
					value: 0,
					label: this.$t('ExplorerLang.common.failed')
				}
			],
			txTypeOption: [
				{
					value: '',
					label: this.$t('ExplorerLang.common.allTxType')
				},
			],
			LargeStringMinHeight: 80,
			LargeStringLineHeight: 16,
			mainTokenSymbol: '',
		}
	},
	async mounted() {
		// this.iServiceTxColumn = iserviceTxColumn
		this.iServiceTxColumn = txCommonTable.concat(SignerColunmn, txCommonLatestTable)
		await this.getTxTypeData();
		this.setMainToken();
		this.getServiceInformation();
		this.getServiceBindingListCount();
		this.getServiceBindingList();
		this.getServiceTransactionCount();
		this.getServiceTransaction();
		this.getAllTxType();
		this.$store.commit('currentTxModelIndex', 0)
	},
	methods: {
		changeTxStatus(params) {
			if (params && params == 2) {
				this.txStatus = 0
			} else if (params && params == 1) {
				this.txStatus = 1
			} else {
				this.txStatus = ''
			}
			this.getServiceTransactionCount();
			this.getServiceTransaction();
		},
		changeTime() {
			
		},
		async getTxTypeData() {
			try {
				let res = await getTxType()
				this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
			} catch (error) {
				console.log(error)
			}
		},
		pageChange(pageNum) {
			this.txPageNum = pageNum;
			this.getServiceTransaction();
		},
		async setMainToken() {
			let mainToken = await getMainToken();
			if (mainToken && mainToken.symbol) {
				this.mainTokenSymbol = mainToken.symbol.toUpperCase();
			}
		},
		isValid(value) {
			return (!value || !value.length || value == "--") ? false : true;
		},
		async getServiceInformation() {
			const res = await getServiceDetail(this.$route.query.serviceName);
			try {
				if (res.msgs && res.msgs.length > 0 && res.msgs[0].msg) {
					const {author, author_description, description, name, schemas, tags} = res.msgs[0].msg;
					this.author = author;
					this.authorDescription = author_description ? author_description : '--';
					this.description = description || '--';
					this.name = name || '--';
					;
					this.schemas = schemas || '--';
					;
					this.tags = tags.length > 0 ? tags : '--';
					this.hash = res.tx_hash;
					this.height = res.height;
					this.time = Tools.formatLocalTime(res.time);
				}
				
			} catch (e) {
				console.error(e);
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
		},
		async getServiceBindingList() {
			try {
				const serviceList = await getServiceBindingTxList(this.$route.query.serviceName, this.providerPageNum, this.providerPageSize, false);
				if (serviceList && serviceList.data) {
					let bindings = await getServiceBindingByServiceName(this.$route.query.serviceName);
					if (bindings.result) {
						serviceList.data.forEach((s) => {
							s.bindTime = Tools.formatLocalTime(s.bindTime);
							bindings.result.forEach((b) => {
								let deposit = `${b.deposit[0].amount} ${b.deposit[0].denom}`;
								if (s.provider === b.provider) {
									s.isAvailable = b.available ? 'True' : 'False';
									s.available = b.available;
									s.price = JSON.parse(b.pricing).price;
									s.qos = `${b.qos} ${this.$t('ExplorerLang.unit.blocks')}`;
									s.deposit = deposit;
									s.disabledTime = b.available ? '--' : Tools.getFormatDate(b.disabled_time);
								}
							})
						})
					}
					this.serviceList = serviceList.data;
					this.providerPageSize = Number(serviceList.pageSize);
					this.providerPageNum = Number(serviceList.pageNum);
				}
			} catch (e) {
				console.error(e)
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
			
			
		},
		async getServiceBindingListCount() {
			try {
				const serviceList = await getServiceBindingTxList(this.$route.query.serviceName, null, null, true);
				if (serviceList?.count) {
					this.providerCount = Number(serviceList.count);
				}
			} catch (e) {
				console.error(e)
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
		},
		async providerPageChange(pageNum) {
			this.providerPageNum = pageNum;
			this.getServiceBindingList();
		},
		
		async getServiceTransaction() {
			try {
				const res = await getServiceTxList(
					this.txType,
					this.txStatus,
					this.$route.query.serviceName,
					this.txPageNum,
					this.txPageSize,
					false
				);
				if (this.txPageNum === Number(res.pageNum)) {
					let fees = [];
					let fee = [];
					if (res.data && res.data.length > 0) {
						for (const tx of res.data) {
							if (this.isShowFee) {
								fees.push(tx.fee && tx.fee.amount && tx.fee.amount.length > 0 ? converCoin(tx.fee.amount[0]) : '--')
							}
						}
					}
					if (fees && fees.length > 0 && this.isShowFee) {
						fee = await Promise.all(fees);
					}
					this.transactionArray = res.data.map((item, index) => {
						
						let sameMsg = [],
							msg = null,
							sameMsgFromAddrArr = [],
							sameMsgToAddrArr = [],
							requestIdArr = [],
							consumerArr = [],
							requestContextIdArr = [],
							serviceNameArr = [],
							authorArr = [],
							ownerArr = [],
							providerArr = [],
							consumer = '--',
							requestContextId = '--',
							serviceName = '--',
							author = '--',
							owner = '--',
							provider = '--';
						
						if (item.msgs.length > 0) {
							item.msgs.forEach(item => {
								if (item.type === this.txType) {
									sameMsg.push(item)
									msg = item
								}
							})
						}
						
						if (sameMsg?.length > 1) {
							sameMsg.forEach(item => {
								const addrObj = TxHelper.getFromAndToAddressFromMsg(item)
								if (addrObj?.from) {
									sameMsgFromAddrArr.push(addrObj.from)
								}
								if (addrObj?.to) {
									sameMsgToAddrArr.push(addrObj.to)
								}
								if (item?.type === TX_TYPE.respond_service && item?.msg?.request_id) {
									requestIdArr.push(item.msg.request_id)
								}
								if (item?.type === TX_TYPE.call_service
									|| item?.type === TX_TYPE.respond_service
									|| item?.msg?.consumer && item?.msg?.request_context_id && item?.msg?.service_name) {
									consumerArr.push(item.msg.consumer)
									requestContextIdArr.push(item.msg.request_context_id)
									serviceNameArr.push(item.msg.service_name)
								}
								if (item?.type === TX_TYPE.pause_request_context
									|| item?.type === TX_TYPE.start_request_context
									|| item?.type === TX_TYPE.update_request_context
									|| item?.type === TX_TYPE.kill_request_context
									&& item?.msg?.consumer && item?.msg?.request_context_id) {
									consumerArr.push(item.msg.consumer)
									requestContextIdArr.push(item.msg.request_context_id)
								}
								if (item?.type === TX_TYPE.define_service && item?.msg?.author && item?.msg?.name) {
									authorArr.push(item.msg.author)
									serviceNameArr.push(item.msg.service_name)
								}
								if (item?.type === TX_TYPE.bind_service
									|| item?.type === TX_TYPE.refund_service_deposit
									|| item?.type === TX_TYPE.disable_service_binding
									|| item?.type === TX_TYPE.enable_service_binding
									|| item?.type === TX_TYPE.update_service_binding
									
									&& item?.msg?.owner && item?.msg?.provider && item?.msg?.service_name) {
									ownerArr.push(item.msg.owner)
									providerArr.push(item.msg.provider)
									serviceNameArr.push(item.msg.service_name)
								}
								if (item?.type === TX_TYPE.update_request_context && item?.msg?.ex && item?.msg?.ex?.service_name) {
									serviceNameArr.push(item.msg.service_name)
								}
							})
							/*
* 同一类型多msg 去重
* */
							sameMsgFromAddrArr = Array.from(new Set(sameMsgFromAddrArr))
							sameMsgToAddrArr = Array.from(new Set(sameMsgToAddrArr))
							requestIdArr = Array.from(new Set(requestIdArr))
							consumerArr = Array.from(new Set(consumerArr))
							ownerArr = Array.from(new Set(ownerArr))
							authorArr = Array.from(new Set(authorArr))
							providerArr = Array.from(new Set(providerArr))
							requestContextIdArr = Array.from(new Set(requestContextIdArr))
							serviceNameArr = Array.from(new Set(serviceNameArr))
						} else {
							if (msg?.type === TX_TYPE.call_service
								|| msg?.type === TX_TYPE.respond_service
								|| msg?.msg?.consumer && msg?.msg?.request_context_id && msg?.msg?.service_name) {
								consumer = msg.msg.consumer
								requestContextId = msg.msg.request_context_id
								serviceName = msg.msg.service_name
							}
							if (msg?.type === TX_TYPE.pause_request_context
								|| msg?.type === TX_TYPE.start_request_context
								|| msg?.type === TX_TYPE.update_request_context
								|| msg?.type === TX_TYPE.kill_request_context
								&& msg?.msg?.consumer && msg?.msg?.request_context_id) {
								consumer = msg.msg.consumer
								requestContextId = msg.msg.request_context_id
							}
							if (msg?.type === TX_TYPE.define_service && msg?.msg?.author && msg?.msg?.name) {
								author = msg.msg.author
								serviceName = msg.msg.name
							}
							if (msg?.type === TX_TYPE.bind_service
								|| msg?.type === TX_TYPE.refund_service_deposit
								|| msg?.type === TX_TYPE.disable_service_binding
								|| msg?.type === TX_TYPE.enable_service_binding
								|| msg?.type === TX_TYPE.update_service_binding
								
								&& msg?.msg?.owner && msg?.msg?.provider && msg?.msg?.service_name) {
								owner = msg.msg.owner
								provider = msg.msg.provider
								serviceName = msg.msg.service_name
							}
							if (msg?.type === TX_TYPE.update_request_context && msg?.msg?.ex && msg?.msg?.ex?.service_name) {
								serviceName = msg.msg.ex.service_name
							}
							
							
						}
						const addrObj = TxHelper.getFromAndToAddressFromMsg(msg);
						let from = sameMsg?.length > 1 ? sameMsgFromAddrArr?.length > 1 ? ' ' : sameMsgFromAddrArr?.length === 1 ? sameMsgFromAddrArr[0] : '--' : addrObj.from || '--',
							to = sameMsg?.length > 1 ? sameMsgToAddrArr?.length > 1 ? ' ' : sameMsgToAddrArr?.length === 1 ? sameMsgToAddrArr[0] : '--' : addrObj.to || '--';
						return {
							// type : item.msgs.length > 1 ? '--' : item.msgs[0].type,
							txType: item.msgs.length > 1 ? '--' : item.msgs[0].type,
							msgCount: item.msgs.length,
							signer: item.signers?.length > 1 ? ' ' : item.signers?.length === 1 ? item.signers[0] : '--',
							from,
							status: item.status,
							txHash: item.hash,
							// id : requestContextId,
							to,
							// fee: fee[index] && fee[index].amount ?  this.isShowDenom ? `${Tools.toDecimal(fee[index].amount,this.feeDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : '--',
							Tx_Fee: fee[index] && fee[index].amount ? this.isShowDenom ? `${Tools.toDecimal(fee[index].amount, this.feeDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee[index].amount, this.feeDecimals)}` : '--',
							blockHeight: item.height,
							Time: Tools.formatLocalTime(item.time),
							consumer: consumerArr?.length > 1 ? ' ' : consumerArr?.length === 1 ? consumerArr[0] : consumer,
							serviceName: serviceNameArr?.length > 1 ? ' ' : serviceNameArr?.length === 1 ? serviceNameArr[0] : serviceName,
							author: authorArr?.length > 1 ? ' ' : authorArr?.length === 1 ? authorArr[0] : author,
							provider: providerArr?.length > 1 ? ' ' : providerArr?.length === 1 ? providerArr[0] : provider,
							requestContextId: requestContextIdArr?.length > 1 ? ' ' : requestContextIdArr?.length === 1 ? requestContextIdArr[0] : requestContextId,
							owner: ownerArr?.length > 1 ? ' ' : ownerArr?.length === 1 ? ownerArr[0] : owner,
						};
						
					});
				}
			} catch (e) {
				console.error(e)
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
		},
		async getServiceTransactionCount() {
			try {
				const res = await getServiceTxList(
					this.txType,
					this.txStatus,
					this.$route.query.serviceName,
					null,
					null,
					true
				);
				if (res?.count) {
					this.txCount = res.count;
				} else {
					this.txCount = 0
				}
			} catch (e) {
				console.error(e)
			}
		},
		async getAllTxType() {
			try {
				const res = await getAllServiceTxTypes();
				res.data.forEach((type) => {
					this.txTypeOption.push({
						value: type.typeName,
						label: this.TX_TYPE_DISPLAY[type.typeName] || type.typeName,
					});
				});
			} catch (e) {
				console.error(e);
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
			
		},
		handleSearchClick(param) {
			this.txType = ''
			if (param?.value) {
				this.txType = param.value
			}
			if (param?.index) {
				sessionStorage.setItem('lastChoiceMsgModelIndex', param.index)
			}
			// this.txStatus = this.status;
			// this.txType = this.type;
			if (this.txType && needAddColumn[this.txType]) {
				this.iServiceTxColumn = txCommonTable.concat(needAddColumn[this.txType], txCommonLatestTable)
			} else {
				this.iServiceTxColumn = txCommonTable.concat(SignerColunmn, txCommonLatestTable)
			}
			this.txPageNum = 1;
			this.getServiceTransactionCount();
			this.getServiceTransaction();
		},
		resetFilterCondition() {
			this.txStatus = this.status = '';
			this.txType = this.type = '';
			this.txPageNum = 1;
			sessionStorage.removeItem('lastChoiceMsgModelIndex')
			this.$store.commit('currentTxModelIndex', 0)
			this.getServiceTransactionCount();
			this.getServiceTransaction();
		},
		formatTxHash(TxHash) {
			if (TxHash) {
				return Tools.formatTxHash(TxHash)
			}
		},
		formatAddress(address) {
			return Tools.formatValidatorAddress(address)
		},
		getDisplayTxType(types = []) {
			let type = types[0] || '';
			if (type && types.length > 1) {
				types.forEach(item => {
					if (type.length > item.length) {
						type = item
					}
				})
			}
			return type;
		},
	}
}
</script>

<style scoped lang="scss">
a {
	color: $t_link_c !important;
}

@media screen and (max-width: 910px) {
	.service_information_content_wrap {
		width: 100%;
		box-sizing: border-box;
		
		.service_information_transaction_condition_container {
			.service_information_transaction_condition_count {
			
			}
			
			::v-deep .el-select {
			
			}
			
			.search_btn {
			
			}
		}
	}
	
}

.service_information_container {
	padding: 0 0.15rem;
	
	.service_information_content_wrap {
		max-width: 12rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		
		.service_information_title {
			text-align: left;
			margin: 0.3rem 0 0.15rem 0;
			width: 100%;
			box-sizing: border-box;
			font-size: $s18;
			font-weight: 600;
			color: $t_first_c;
		}
		
		.service_information_definition_content {
			background: $bg_white_c;
			box-sizing: border-box;
			padding: 0.25rem 0.27rem 0.2rem 0.27rem;
			margin-bottom: 0.48rem;
			border-radius: 5px;
			// border: 1px solid $bd_first_c;
			.service_information_definition_title {
				font-size: $s18;
				color: $t_first_c;
				font-weight: 600;
				margin-bottom: 0.36rem;
				text-align: left;
			}
			
			.service_information_content {
				box-sizing: border-box;
				background: $bg_white_c;
				
				.service_information_text_content {
					display: flex;
					justify-content: flex-start;
					margin-bottom: 0.26rem;
					
					span:nth-of-type(1) {
						margin-right: 0.15rem;
						font-size: $s14;
						line-height: 0.16rem;
						color: $t_second_c;
						min-width: 1.5rem;
						text-align: left;
						font-weight: 600;
					}
					
					span:last-child {
						font-size: $s14;
						line-height: 0.16rem;
						color: $t_first_c;
						flex: 1;
						text-align: left;
						word-break: break-word;
					}
				}
				
				.service_information_text_content:last-child {
					margin-bottom: 0;
				}
				
			}
		}
		
		.service_information_bindings_content {
			background: $bg_white_c;
			box-sizing: border-box;
			padding: 0.25rem 0.27rem 0.2rem 0.27rem;
			margin-bottom: 0.48rem;
			border-radius: 5px;
			// border: 1px solid $bd_first_c;
			overflow-x: auto;
			
			.service_information_binding_title {
				font-size: $s18;
				color: $t_first_c;
				font-weight: 600;
				margin-bottom: 0.36rem;
				text-align: left;
			}
			
			.service_information_bindings_table_content {
				min-width: 11.44rem;
				background: $bg_white_c;
				
				.service_information_available_container {
					display: flex;
					align-items: center;
				}
			}
		}
		
		.service_information_transaction_content {
			box-sizing: border-box;
			//padding: 0.25rem 0.27rem 0.2rem 0.27rem;
			border-radius: 5px;
			// border: 1px solid $bd_first_c;
			.service_information_transaction_title {
				background: #fff;
				font-size: $s18;
				color: $t_first_c;
				font-weight: 600;
				text-align: left;
				padding: 0.25rem 0 0.2rem 0.27rem;
			}
			
			.service_information_transaction_condition_container {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin-bottom: 0.4rem;
				align-items: center;
				
				.service_information_transaction_condition_count {
					font-size: $s14;
					margin-right: 0.42rem;
					font-weight: 600;
					
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
				
				.tx_type_mobile_content {
					display: flex;
					align-items: center;
					
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
					
					.reset_btn {
						cursor: pointer;
						background: $bg_button_c;
						margin-left: 0.1rem;
						color: $t_button_c;
						border-radius: 0.04rem;
						padding: 0.05rem 0.1rem;
						font-size: $s14;
						line-height: 0.2rem;
					}
				}
				
			}
			
			.service_information_transaction_table_content {
				background: $bg_white_c;
				
				.service_tx_status {
					position: relative;
					top: 0.02rem;
					width: 0.13rem;
					height: 0.13rem;
				}
				
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
			}
		}
		
		.pagination_content {
			display: flex;
			justify-content: flex-end;
			margin-top: 0.25rem;
			//background: $bg_white_c;
		}
	}
}

@media screen and (max-width: 768px) {
	.service_information_container {
		
		.service_information_content_wrap {
			
			.service_information_definition_content {
				padding: 0.12rem;
				
				.service_information_definition_title {
				
				}
				
				.service_information_content {
					
					.service_information_text_content {
						
						span:nth-of-type(1) {
							min-width: 1.4rem;
							margin-right: 0.16rem;
							word-break: break-word;
						}
						
						span:last-child {
						
						}
					}
					
					.service_information_text_content:last-child {
					
					}
				}
				
				.cn {
					.service_information_text_content {
						
						span:nth-of-type(1) {
							min-width: 0.8rem !important;
						}
						
						span:last-child {
						
						}
					}
					
					.service_information_text_content:last-child {
					
					}
				}
			}
			
			.service_information_bindings_content {
				.service_information_binding_title {
				
				}
				
				.service_information_bindings_table_content {
				
				}
			}
			
			.service_information_transaction_content {
				.service_information_transaction_title {
				
				}
				
				.service_information_transaction_table_content {
				
				}
				
				.service_information_transaction_condition_container {
					flex-direction: column;
					align-items: flex-start;
					
					.service_information_transaction_condition_count {
						margin-bottom: 0.1rem;
					}
					
					::v-deep .el-select {
						width: 100%;
						margin-bottom: 0.1rem;
						
					}
					
					.search_btn {
					
					}
				}
			}
			
			.pagination_content {
			
			}
		}
	}
}
</style>
