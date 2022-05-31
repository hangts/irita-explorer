<template>
	<div class="nft_token_container">
		<div class="nft_token_content_wrap">
			<div class="nft_token_title">{{ $t('ExplorerLang.ddcDetail.ddcInformation') }}</div>
			<div class="nft_token_information_content">
				<div class="nft_token_information_item" v-if="ddcType !== DDC_TYPE_LIST[2]">
					<span>{{ $t('ExplorerLang.table.owner') }}：</span>
					<span>
            <router-link :to="`/address/${owner}`">{{ owner }}</router-link>
          </span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.ddcDetail.type') }}：</span>
					<span>{{ ddcType }}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.table.ddcName') }}：</span>
					<span>{{ ddcName }}</span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.table.ddcId') }}：</span>
					<span>{{ ddcId }}</span>
				</div>
        <!-- <div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.ddcDetail.amount') }}：</span>
					<span>{{ amount }}</span>
				</div> -->
<!--				<div class="nft_token_information_item">-->
<!--					<span>{{ $t('ExplorerLang.ddcDetail.schema') }}：</span>-->
<!--					<LargeString :isShowPre="Tools.isJSON(schema)" v-if="schema" :text="schema"-->
<!--								 :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>-->
<!--				</div>-->
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.creator') }}：</span>
					<span>
            <router-link :to="`/address/${creator}`">{{ creator }}</router-link>
          </span>
				</div>
				<div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.uri') }}：</span>
					<div class="wrap" v-if="ddcUri && ddcUri !== '[do-not-modify]'">
						<a class="text" v-if="Tools.testUrl(ddcUri)" :href="ddcUri"
						   target="_blank">{{ ddcUri }}</a>
						<a class="text" v-else-if="startStr(ddcUri)" :href="'http://' + ddcUri"
						   target="_blank">{{ ddcUri }}</a>
						<span class="text" v-else>{{ ddcUri }}</span>
					</div>
					<span v-else-if=" ddcUri === '[do-not-modify]'">{{ ddcUri }}</span>
					<span v-else>--</span>
				</div>
			</div>
			<div class="nft_token_list_content">
				<div class="nft_token_list_title"> {{ $t('ExplorerLang.nftDetail.nftTxs') }}</div>
				<list-component
					:token-symbol="mainTokenSymbol"
					:list-data="txListByDdc"
					:is-loading="isDdcDetailTxLoading"
					:column-list="ddcDetailColumn"
					:pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
					@pageChange="pageChange"
				></list-component>
			</div>
		</div>
	</div>
</template>

<script>
import TxListComponent from '../common/TxListComponent'
import { getDdcTxList, getDdcDetail } from '@/service/api'
import Tools from '@/util/Tools'
import MPagination from '../common/MPagination'
import {TX_TYPE, decimals, DDC_TYPE_LIST} from '@/constant'
import LargeString from '../common/LargeString'
import ListComponent from "../common/ListComponent"
import ddcDetailTxColumn from "../tableListColumnConfig/ddcDetailTxColumn";
import {getTxType, getMainToken, converCoin} from "@/helper/IritaHelper";
import prodConfig from "@/productionConfig";

export default {
	name: 'DdcDetail',
	components: {ListComponent, MPagination, TxListComponent, LargeString},
	data() {
		return {
			ddcDetailColumn: [],
			isDdcDetailTxLoading: false,
			mainTokenSymbol: '',
			Tools,
			TX_TYPE,
			owner: '',
			pageNum: 1,
			pageSize: 10,
			count: 0,
			txListByDdc: [],
			creator: '',
			schema: '',
			amount: '',
			ddcUri: '',
			ddcType: '',
			ddcName: '',
			ddcId:'',
			LargeStringMinHeight: 95,
			LargeStringLineHeight: 19,
			feeDecimals: decimals.fee,
			DDC_TYPE_LIST,
		}
	},
	async mounted() {
		this.ddcDetailColumn = ddcDetailTxColumn
		this.setMainToken();
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
				let ddcDetail = await getDdcDetail({
						ddc_id: this.$route.query.ddcId,
						contract_address:this.$route.query.contractAddr
					}
				)
				if (ddcDetail) {
					this.owner = ddcDetail.owner || '--'
					this.ddcType = DDC_TYPE_LIST[ddcDetail.ddc_type] || '--'
					this.ddcName = ddcDetail.ddc_name || '--'
					this.ddcId = ddcDetail.ddc_id || '--'
					this.amount = ddcDetail.amount || '--'
					this.schema = ddcDetail.ddc_data || '--'
					this.creator = ddcDetail.creator || '--'
					this.ddcUri = ddcDetail.ddc_uri || '--'

					this.getDdcTxCount()
					this.getDdcTx()
				}
			} catch (e) {
				console.error(e)
			}
		},
		pageChange(pageNum) {
			this.pageNum = pageNum
			this.getDdcTx()
		},
		async getDdcTx() {
			try {
				const res = await getDdcTxList({
					ddc_id: this.$route.query.ddcId,
					contract_address: this.$route.query.contractAddr,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					useCount:false
				})
				if (res?.data.length > 0) {
					this.txListByDdc = res.data.map((item) => {
						const _contractMethod =  (this?.$i18n?.messages && this?.$i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract) && this?.$i18n?.messages && this?.$i18n?.messages[prodConfig.lang]?.ExplorerLang?.smartContract[tx?.msgs[0]?.msg?.ex?.ddc_method] || tx?.msgs[0]?.msg?.ex?.ddc_method
						return {
							status: item.status,
							txHash: item.tx_hash,
							txType: TX_TYPE.bsn_ddc,
							contractAddr: item.contract_addrs[0],
							contractMethod: _contractMethod || '--',
							signer: item.signers && item.signers.length > 0 ? item.signers[0] : '--',
							blockHeight: item.height,
							fee: item?.fee?.amount[0]?.amount ? item?.fee.amount[0] : ' ',
							Time: Tools.formatLocalTime(item.time),
						}
					})
					if (this.txListByDdc?.length) {
						this.txListByDdc.forEach(async (item) => {
							if (item?.fee) {
								let formatFee = await converCoin(item.fee)
								item.fee = formatFee?.amount ? Tools.toDecimal(formatFee.amount, this.feeDecimals) : ''
							}
						})
					}
				} else {
					this.txListByDdc = []
				}
			} catch (e) {
				console.error(e)
				this.$message.error(this.$t('ExplorerLang.message.requestFailed'))
			}
		},
		async getDdcTxCount() {
			try {
				const res = await getDdcTxList({
					ddc_id: this.$route.query.ddcId,
					contract_address: this.$route.query.contractAddr,
					useCount: true
				})
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
