<template>
	<div class="nft_token_container">
		<div class="nft_token_content_wrap">
			<div class="nft_token_title">{{ $t('ExplorerLang.nftDetail.nftInformation') }}</div>
			<div class="nft_token_information_content">
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.owner') }}：</span>
					<span>
            <router-link :to="`/address/${owner}`">{{ owner }}</router-link>
          </span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.denom') }}：</span>
					<span>{{ denomName || denomId }}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.tokenName') }}：</span>
					<span>{{ nftName }}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.tokenId') }}：</span>
					<span>{{ tokenID }}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.schema') }}：</span>
					<LargeString :isShowPre="Tools.isJSON(schema)" v-if="schema" :text="schema"
								 :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.data') }}：</span>
					<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData"
								 :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
				</div>
				<!-- <div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.creator') }}：</span>
					<span>
            <router-link :to="`/address/${creator}`">{{ creator }}</router-link>
          </span>
				</div> -->
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.uri') }}：</span>
					<!-- <span v-if="tokenUri && tokenUri !== '--'">
								  <a :href="tokenUri" target="_blank">{{tokenUri}}</a>
							  </span>
							  <span v-else>--</span> -->
					
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
						<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri"
						   target="_blank">{{ tokenUri }}</a>
						<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri"
						   target="_blank">{{ tokenUri }}</a>
						<span class="text" v-else>{{ tokenUri }}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{ tokenUri }}</span>
					<span v-else>--</span>
				</div>
			</div>
			<div class="nft_token_list_content">
				<div class="nft_token_list_title"> {{ $t('ExplorerLang.nftDetail.nftTxs') }}</div>
				<!--				<TxListComponent :txData="txListByToken"></TxListComponent>-->
				<list-component
					:token-symbol="mainTokenSymbol"
					:list-data="txListByToken"
					:is-loading="isNftDetailTxLoading"
					:column-list="nftDetailColumn"
					:pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
					@pageChange="pageChange"
				></list-component>
<!--				<div class="pagination_content">
					<m-pagination :page-size="pageSize" :total="count" :page="pageNum"
								  :page-change="pageChange"></m-pagination>
				</div>-->
			</div>
		</div>
	</div>
</template>

<script>
import TxListComponent from './common/TxListComponent'
import {getNftDetail, getTokenTxList} from '../service/api'
import Tools from '../util/Tools'
import MPagination from './common/MPagination'
import {TX_TYPE, TX_STATUS, decimals} from '../constant'
import LargeString from './common/LargeString'
import ListComponent from "./common/ListComponent"
import nftDetailTxColumn from "./tableListColumnConfig/nftDetailTxColumn";
import {getTxType, getMainToken, converCoin} from "../helper/IritaHelper";

export default {
	name: 'NftToken',
	components: {ListComponent, MPagination, TxListComponent, LargeString},
	data() {
		return {
			nftDetailColumn: [],
			isNftDetailTxLoading: false,
			mainTokenSymbol: '',
			Tools,
			TX_TYPE,
			TX_STATUS,
			owner: '',
			Denom: '',
			TokenID: '',
			Uri: '',
			pageNum: 1,
			count: 0,
			pageSize: 10,
			txListByToken: [],
			creator: '',
			schema: '',
			name: '',
			tokenID: '',
			primaryKey: '',
			tokenData: '',
			tokenUri: '',
			denomName: '',
			nftName: '',
			denomId: '',
			LargeStringMinHeight: 95,
			LargeStringLineHeight: 19,
			feeDecimals: decimals.fee,
			TX_TYPE_DISPLAY: {},
		}
	},
	async mounted() {
		this.nftDetailColumn = nftDetailTxColumn
		this.setMainToken();
		await this.getTxTypeData()
		await this.getTokenInformation()
	},
	methods: {
		async setMainToken() {
			let mainToken = await getMainToken();
			if (mainToken && mainToken.symbol) {
				this.mainTokenSymbol = mainToken.symbol.toUpperCase();
			}
		},
		async getTokenInformation() {
			try {
				let nftDetail = await getNftDetail(
					this.$route.query.denom,
					this.$route.query.tokenId
				)
				
				if (nftDetail) {
					this.creator = (nftDetail.denomDetail || {}).creator
					this.schema = (nftDetail.denomDetail || {}).json_schema || '--'
					this.name = nftDetail.denom
					this.tokenID = nftDetail.nft_id || '--'
					this.denomName = nftDetail.denom_name
					this.denomId = nftDetail.denom_id
					this.nftName = nftDetail.nft_name || '--'
					// this.primaryKey = nftDetail.primary_key;
					this.owner = nftDetail.owner
					this.tokenData = nftDetail.tokenData || '--'
					this.tokenUri = nftDetail.tokenUri || '--'
					this.getTokenTxCount()
					this.getTokenTx()
				}
			} catch (e) {
				console.error(e)
			}
		},
		pageChange(pageNum) {
			this.pageNum = pageNum
			this.getTokenTx()
		},
		async getTxTypeData() {
			try {
				let res = await getTxType()
				this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
			} catch (error) {
				console.log(error)
			}
		},
		async getTokenTx() {
			try {
				const res = await getTokenTxList(
					this.tokenID,
					this.$route.query.denom,
					this.pageNum,
					this.pageSize,
					false
				)
				if (res?.data.length > 0) {
					this.txListByToken = res.data.map((item) => {
						let mintNftArr = [], burnNftArr = [], editNftArr = [], issueDenomArr = [], transferNftArr = [],
							allNftTxMsgArr = [];
						if (item?.msgs?.length) {
							allNftTxMsgArr = [];
							mintNftArr = item.msgs.filter(item => {
								if (item.type === TX_TYPE.mint_nft) {
									return item
								}
							})
							burnNftArr = item.msgs.filter(item => {
								if (item.type === TX_TYPE.burn_nft) {
									return item
								}
							})
							editNftArr = item.msgs.filter(item => {
								if (item.type === TX_TYPE.edit_nft) {
									return item
								}
							})
							issueDenomArr = item.msgs.filter(item => {
								if (item.type === TX_TYPE.issue_denom) {
									return item
								}
							})
							transferNftArr = item.msgs.filter(item => {
								if (item.type === TX_TYPE.transfer_nft) {
									return item
								}
							})
							allNftTxMsgArr = mintNftArr.concat(burnNftArr, editNftArr, issueDenomArr, transferNftArr)
							
						}
						let sender = ' ', denomId = ' ', filterSenderArr = [], filterDenomId = []
						if (allNftTxMsgArr?.length === 1) {
							if (allNftTxMsgArr && allNftTxMsgArr[0]?.msg?.sender) {
								filterSenderArr = [allNftTxMsgArr[0].msg.sender]
							}
							if (allNftTxMsgArr && allNftTxMsgArr[0]?.msg?.denom) {
								filterDenomId = [allNftTxMsgArr[0].msg.denom]
							}
						} else if (allNftTxMsgArr?.length > 1) {
							let senderArr = allNftTxMsgArr.map(item => {
								if (item?.msg?.sender) {
									return item.msg.sender
								}
							})
							let denomIdArr = allNftTxMsgArr.map(item => {
								if (item?.msg?.denom) {
									return item.msg.denom
								}
							})
							filterSenderArr = Array.from(new Set(senderArr))
							filterDenomId = Array.from(new Set(denomIdArr))
						}
						if (filterSenderArr?.length === 1) {
							sender = filterSenderArr [0]
						}
						if (filterDenomId?.length === 1) {
							denomId = filterDenomId[0]
						}
						return {
							txHash: item.tx_hash,
							txType: (item.msgs || []).map(item =>  item.type),
							blockHeight: item.height,
							fee: item?.fee?.amount[0]?.amount ? item?.fee.amount[0] : ' ',
							Time: Tools.formatLocalTime(item.time),
							status: item.status,
							sender: sender,
							denomId: denomId
						}
					})
					if (this.txListByToken?.length) {
						this.txListByToken.forEach(async (item) => {
							if (item?.fee) {
								let formatFee = await converCoin(item.fee)
								item.fee = formatFee?.amount ? Tools.toDecimal(formatFee.amount, this.feeDecimals) : ''
							}
						})
					}
				} else {
					this.txListByToken = []
				}
			} catch (e) {
				console.error(e)
				this.$message.error(this.$t('ExplorerLang.message.requestFailed'))
			}
		},
		async getTokenTxCount() {
			try {
				const res = await getTokenTxList(
					this.tokenID,
					this.$route.query.denom,
					null,
					null,
					true
				)
				if (res?.count) {
					this.count = res.count
				} else {
					this.count = 0
				}
			} catch (e) {
				console.error(e)
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
		startStr(url) {
			return url.startsWith('www.')
		},
	},
}
</script>

<style scoped lang="scss">
a {
	color: $t_link_c !important;
}

.nft_token_container {
	padding: 0 0.15rem;
	
	.nft_token_content_wrap {
		max-width: 12rem;
		margin: 0 auto;
		
		.nft_token_title {
			font-size: $s18;
			color: $t_first_c;
			font-weight: bold;
			margin: 0.3rem 0 0.1rem 0;
			text-align: left;
			text-indent: 0.2rem;
		}
		
		.nft_token_information_content {
			box-sizing: border-box;
			// border: 0.01rem solid $bd_second_c;
			border-radius: 0.04rem;
			background: $bg_white_c;
			padding: 0.2rem;
			
			.nft_token_information_item {
				text-align: left;
				margin-bottom: 0.16rem;
				display: flex;
				
				span:nth-of-type(1) {
					margin-right: 0.15rem;
					min-width: 1.27rem;
					font-size: $s14;
					color: $t_second_c;
					line-height: 0.16rem;
				}
				
				span:nth-of-type(2) {
					font-size: $s14;
					color: $t_first_c;
					flex: 1;
					word-break: break-all;
				}
				
				.wrap {
					.text {
						flex: 1;
						text-align: left;
						font-size: $s14;
						color: $t_first_c;
						word-break: break-all;
						line-height: 0.2rem;
						font-weight: normal;
					}
				}
			}
			
			.nft_token_information_item:last-child {
				margin-bottom: 0;
			}
		}
		
		.nft_token_list_content {
			.nft_token_list_title {
				font-size: $s18;
				color: $t_first_c;
				line-height: 0.21rem;
				font-weight: bold;
				text-align: left;
				text-indent: 0.2rem;
				margin: 0.3rem 0 0.1rem 0;
			}
			
			.pagination_content {
				display: flex;
				justify-content: flex-end;
				margin: 0.3rem 0 0.1rem 0;
			}
			
			.tx_transaction_content_hash {
				display: flex;
				align-items: center;
			}
		}
		
		.status_icon {
			width: 0.13rem;
			height: 0.13rem;
			margin-right: 0.05rem;
		}
	}
}

@media screen and (max-width: 768px) {
	.nft_token_container {
		.nft_token_content_wrap {
			.nft_token_title {
			}
			
			.nft_token_information_content {
				.nft_token_information_item {
					span:nth-of-type(1) {
						min-width: 1rem;
					}
					
					span:nth-of-type(2) {
					}
				}
				
				.nft_token_information_item:last-child {
				}
			}
			
			.nft_token_list_content {
				.nft_token_list_title {
				}
				
				.pagination_content {
				}
			}
		}
	}
}
</style>
