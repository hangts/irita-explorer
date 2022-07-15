<template>
	<div class="address_information_component_container">
		<div class="address_information_component_wrap">
			<div class="address_information_component_content">
				<div class="address_information_asset_content">
					<!-- 左侧 -->
					<div class="address_information_asset_total_content">
						<img :src="logoImg" alt="">
						<!-- 信息展示 -->
						<ul class="address_information_content">
							<li class="address_information_item">
								<span class="address_information_label">{{
										$t('ExplorerLang.addressInformation.content.address')
									}}:</span>
								<p>
									<span>{{ address }}<span class="profiler_content" v-if="isProfiler">Profiler</span></span>
								</p>
							</li>
							<li class="address_information_item">
								<span class="address_information_label">{{
										$t('ExplorerLang.addressInformation.content.token')
									}}:</span>
								<span class="address_information_value">{{ mainTokenSymbol || '--' }}</span>
							</li>
							<li class="address_information_item">
								<span class="address_information_label">{{
										$t('ExplorerLang.addressInformation.content.totalAmount')
									}}:</span>
								<span class="address_information_value">{{ totalAmount || 0 }}</span>
							</li>
						</ul>
					</div>
					<!-- 右侧信息 -->
					<ul class="address_information_asset_constitute_content" v-show="flShowAssetInfo(assetConstitute)">
						<li class="address_information_asset_constitute_item" v-for="(item,index) in assetConstitute" :key="index">
							<span :style="{background:item.color}"></span>
							<span>{{ item.label }}</span>
							<span :id="item.status" :style="{'text-align': 'right','width': maxWidth + 'px','white-space': 'nowrap'}">{{ item.value }}</span>
						</li>
					</ul>
					<!-- 右侧图形 -->
					<div class="address_information_asset_pie_content" v-show="flShowAssetInfo(assetConstitute)">
						<address-information-pie :echartData="assetConstitute"></address-information-pie>
					</div>
				</div>
				<div class="address_information_asset_list_container" v-if="otherTokenList.length !== 0">
					<div class="address_information_asset_header_content">
						<span class="token">{{ $t('ExplorerLang.addressInformation.content.token') }}</span>
						<span class="balance">{{ $t('ExplorerLang.addressInformation.content.balance') }}</span>
					</div>
					<ul class="address_information_asset_list_content">
						<li class="address_information_asset_list_item" v-for="(item,index) in otherTokenList" :key="index">
							<div class="address_information_token_img_content">
								<span class="address_information_token_name">{{ item.token }}</span>
							</div>
							<div class="address_information_list_item_value">{{ item.balance }}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MClip from "./common/MClip";
import Tools from "../util/Tools";
import AddressInformationPie from "./AddressInformationPie";
import moveDecimal from 'move-decimal-point';
import {validatorStatus, numFormat, product} from '@/constant';
import productionConfig from '@/productionConfig.js';
import {getMainToken} from "@/helper/IritaHelper";

export default {
	name: "AddressInformationComponent",
	components: {AddressInformationPie, MClip},
	props: {
		address: {
			type: String
		},
		data: {
			type: Array
		},
		isProfiler: {
			type: Boolean,
		},
	},
	data() {
		return {
			numFormat,
			assetInformation: '',
			assetConstitute: [
				{
					label: this.$t('ExplorerLang.addressInformation.content.balance'),
					status: 'Balance',
					value: '',
					color: '$theme_c'
				},
				{
					label: this.$t('ExplorerLang.addressInformation.content.delegated'),
					status: 'Delegated',
					value: '',
					color: '#FFA300'
				},
				{
					label: this.$t('ExplorerLang.addressInformation.content.unBonding'),
					status: 'UnBonding',
					value: '',
					color: '#67E523'
				},
				{
					label: this.$t('ExplorerLang.addressInformation.content.rewards'),
					status: 'Rewards',
					value: '',
					color: '#8E66FF'
				},
			],
			totalAmount: '',
			balance: '',
			delegated: '',
			unbonding: '',
			rewards: '',
			otherTokenList: [],
			maxWidth: 100,
			mainTokenSymbol: '',
		}
	},
	watch: {
		data: {
			handler() {
				this.assetInformation = this.data;
				this.formatAssetInformation(this.assetInformation)
			},
			immediate: true
		},
		assetConstitute: {
			handler() {
				let valueWidth = '';
				this.assetConstitute.forEach(item => {
					if (item.value.length > valueWidth.length) {
						valueWidth = item.value
					}
				})
				this.maxWidth = (valueWidth.length * 8.5) || 100;
			},
			deep: true
		}
	},
	mounted() {
		this.assetInformation = this.data;
		this.formatAssetInformation(this.assetInformation)
		this.setMainToken();
	},
	methods: {
		flShowAssetInfo(data) {
			let res = data.every((item) => {
				return item.value !== ''
			});
			return res
		},
		async setMainToken() {
			let mainToken = await getMainToken();
			if (mainToken && mainToken.symbol) {
				this.mainTokenSymbol = mainToken.symbol.toUpperCase();
			}
		},
		formatAssetInformation(assetInformation) {
			assetInformation.forEach(item => {
				if (item && item.token === this.mainTokenSymbol) {
					this.totalAmount = item.totalAmount;
					this.assetConstitute.forEach(res => {
						if (res.status === 'UnBonding') {
							res.value = item.unBonding || "--";
							res.numberValue = item.unBonding ? item.unBonding.replace(/[^\d.]/g, "") : 0;
							res.percent = this.formatDecimalNumberToFixedNumber(item.totalAmount.replace(/[^\d.]/g, ""), res.numberValue)
						} else if (res.status === 'Rewards') {
							res.value = item[Tools.firstWordLowerCase(res.status)] && item[Tools.firstWordLowerCase(res.status)] !== 0 ? item[Tools.firstWordLowerCase(res.status)] : "--";
							res.numberValue = item[Tools.firstWordLowerCase(res.status)] ?
								item[Tools.firstWordLowerCase(res.status)].replace(/[^\d.]/g, "") : 0;
							res.percent = this.formatDecimalNumberToFixedNumber(item.totalAmount.replace(/[^\d.]/g, ""), res.numberValue)
							switch (productionConfig.product) {
								case product.stargate:
									res.color = '#5A9FFF'
									break;
								default:
									break;
							}
						} else {
							res.value = item[Tools.firstWordLowerCase(res.status)] && item[Tools.firstWordLowerCase(res.status)] !== 0 ? item[Tools.firstWordLowerCase(res.status)] : "--";
							res.numberValue = item[Tools.firstWordLowerCase(res.status)] ?
								item[Tools.firstWordLowerCase(res.status)].replace(/[^\d.]/g, "") : 0;
							res.percent = this.formatDecimalNumberToFixedNumber(item.totalAmount.replace(/[^\d.]/g, ""), res.numberValue)
						}
					})
				}
			});
			this.otherTokenList = assetInformation.filter((item) => {
				return item.token !== this.mainTokenSymbol
			})
		},
		formatDecimalNumberToFixedNumber(total, data) {
			let percentNumber = (Number(data) / Number(total)).toString();
			let num;
			if (percentNumber !== 'Infinity') {
				num = Tools.subStrings(moveDecimal(Tools.FormatScientificNotationToNumber(percentNumber), 2), 2);
			} else {
				//数字太小赋值为0.00
				num = this.numFormat.num
			}
			return num;
		}
	},
	computed: {
		logoImg() {
			let img = ''
			try {
				img = require('../assets/token_logo.svg')
			} catch (e) {
			}
			return img
		},
	},
}
</script>

<style scoped lang="scss">
.address_information_component_container {
	// padding-top: 0.14rem;
	.address_information_component_wrap {
		max-width: 12.8rem;
		margin: 0 auto;
		
		.address_information_component_content {
			// border: 0.01rem solid $bd_first_c;
			.address_information_component_title {
				color: $t_first_c;
				font-size: $s18;
				line-height: 0.21rem;
				margin-bottom: 0.1rem;
				
				.address {
					margin-right: 0.1rem;
				}
			}
			
			.address_information_asset_content {
				max-width: 12rem;
				box-sizing: border-box;
				background: $bg_white_c;
				padding: 0.3rem 0rem;
				display: grid;
				grid-template-columns: repeat(3, 50% 30% 20%);
				
				.address_information_asset_total_content {
					display: grid;
					grid-template-columns: repeat(1, 1rem auto);
					border-right: 0.01rem dashed $bd_second_c;
					
					img {
						width: 0.55rem;
						height: 0.55rem;
						justify-self: center;
						align-self: center;
					}
					
					.address_information_content {
						text-align: left;
						
						.address_information_item {
							display: grid;
							grid-template-columns: repeat(1, 0.95rem auto);
							// margin-top: 0.14rem;
							margin-top: 0.25rem;
							
							.address_information_label {
								// width: 1.1rem;
								color: $t_second_c;
								font-size: $s14;
								line-height: 0.16rem;
							}
							
							p {
								display: flex;
								color: $t_first_c;
								font-size: $s14;
								line-height: 0.16rem;
								padding-right: 0.01rem;
								
								.profiler_content {
									padding: 0 0.12rem;
									border-radius: 0.08rem;
									margin-left: 0.08rem;
									background: $theme_c;
									color: $t_white_c;
									font-size: $s14;
									font-weight: lighter;
									word-break: normal;
								}
							}
							
							.address_information_value {
								flex: 1;
								display: flex;
								color: $t_first_c;
								font-size: $s14;
								line-height: 0.16rem;
							}
						}
						
						.address_information_item:first-child {
							margin-top: 0;
							
							p {
								font-weight: bold;
							}
						}
					}
					
					.address_information_title {
						font-size: $s14;
						line-height: 0.16rem;
						color: $t_second_c;
						margin-bottom: 0.1rem;
					}
					
					.address_information_total_amount_content {
						font-size: $s16;
						line-height: 0.18rem;
						font-weight: bold;
						color: $t_first_c;
					}
				}
				
				.address_information_asset_constitute_content {
					// display: grid;
					// grid-template-columns: repeat(1,auto);
					// grid-template-rows: repeat(4,auto);
					text-align: left;
					margin-left: 0.78rem;
					
					&:nth-of-type(1) {
						span:nth-of-type(1) {
							background: $theme_c
						}
					}
					
					.address_information_asset_constitute_item {
						display: flex;
						align-items: center;
						margin-top: 0.12rem;
						
						span:nth-of-type(1) {
							display: inline-block;
							width: 0.1rem;
							height: 0.1rem;
							margin-right: 0.09rem;
						}
						
						span:nth-of-type(2) {
							font-size: $s14;
							line-height: 0.16rem;
							width: 0.7rem;
						}
						
						span:nth-of-type(3) {
							font-size: $s14;
							line-height: 0.16rem;
						}
					}
					
					.address_information_asset_constitute_item:first-child {
						margin-top: 0;
					}
				}
				
				.address_information_asset_pir_content {
				
				}
			}
			
			.address_information_asset_list_container {
				text-align: left;
				box-sizing: border-box;
				padding: 0 0.2rem;
				background: $bg_white_c;
				
				.address_information_asset_header_content {
					box-sizing: border-box;
					// border-bottom: 0.01rem solid $bd_second_c;
					padding-top: 0.19rem;
					margin-bottom: 0.1rem;
					display: grid;
					grid-template-rows: repeat(1, 100%);
					grid-template-columns: repeat(2, 50%);
					
					span {
						color: $t_second_c;
					}
					
					span:nth-of-type(2) {
						padding-left: 0.2rem;
					}
				}
				
				.address_information_asset_list_content {
					display: flex;
					flex-direction: column;
					border-top: 0.01rem solid $bd_second_c;
					
					.address_information_asset_list_item {
						display: grid;
						border-bottom: 0.01rem solid $bd_second_c;
						grid-template-rows: repeat(1, 100%);
						grid-template-columns: repeat(2, 50%);
						box-sizing: border-box;
						padding: 0.08rem 0 0.08rem 0;
						margin-bottom: 0.05rem;
						
						.address_information_token_img_content {
							// padding-left: 0.2rem;
							word-break: break-all;
							
							.address_information_token_name {
								font-size: $s14;
								line-height: 0.16rem;
								color: $t_first_c;
							}
						}
						
						.address_information_list_item_value {
							padding-left: 0.2rem;
							font-size: $s14;
							line-height: 0.16rem;
							color: $t_first_c;
							word-break: break-word;
						}
					}
					
					.address_information_asset_list_item:last-child {
						margin-bottom: 0.18rem;
					}
				}
			}
		}
	}
}

@media screen and (max-width: 1198px) {
	.address_information_component_container {
		padding-top: 0.1rem;
		
		.address_information_component_wrap {
			// margin: 0.2rem 0.1rem 0 0.1rem;
			.address_information_component_content {
				.address_information_asset_content {
					width: 100%;
					padding: 0.1rem;
					grid-template-columns: repeat(1, auto);
					
					.address_information_asset_total_content {
						border: none;
						
						img {
							justify-self: start;
						}
						
						width: 100%;
						grid-template-columns: repeat(1, auto);
						
						.address_information_content {
							margin-top: 0.15rem;
							
							.address_information_item {
								grid-template-columns: repeat(1, 1.1rem auto);
								
								p {
									word-wrap: break-word;
									word-break: break-all;
								}
							}
						}
					}
					
					.address_information_asset_constitute_content {
						margin: 0.3rem 0 0 0;
						border-top: 0.01rem solid $bd_first_c;
						width: 100%;
						
						.address_information_asset_constitute_item:first-child {
							margin-top: 0.3rem;
						}
					}
				}
				
				.address_information_asset_list_container {
					padding: 0 0.1rem;
				}
			}
		}
	}
}

@media screen and (max-width: 910px) {
	.address_information_component_container {
		padding-top: 0;
		
		.address_information_component_wrap {
			.address_information_component_content {
				.address_information_asset_content {
					.address_information_asset_total_content {
						.address_information_content {
							.address_information_item {
							}
						}
					}
					
					.address_information_asset_constitute_content {
						.address_information_asset_constitute_item:first-child {
						}
					}
				}
				
				.address_information_asset_list_container {
				}
			}
		}
	}
}
</style>
