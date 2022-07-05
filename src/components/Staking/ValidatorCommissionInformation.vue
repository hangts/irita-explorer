<template>
	<div class="validator_commission_information_container">
		<!-- 标题 -->
		<p class="validator_commission_information_title">
			<span>{{ $t('ExplorerLang.validatorDetail.commissionInfo.title') }}</span>
		</p>
		<div class="validator_commission_information_wrap">
			<div class="validator_commission_information_content">
				<!-- 左侧散点图 -->
				<div class="validator_commission_information_scatter_content">
					<!-- 散点图标题 -->
					<p class="validator_commission_information_scatter_title">{{ $t('ExplorerLang.validatorDetail.commissionInfo.scatter.title') }}</p>
					<!-- 散点图 -->
					<validator-detail-scatter v-if="validatorStatus && jailedData" :jailedData="jailedData" :validatorStatus="validatorStatus"></validator-detail-scatter>
				</div>
				<!-- 右侧详细信息 -->
				<div class="validator_commission_bonded_container">
					<ul class="validator_commission_bonded_list">
						<li class="validator_commission_bonded_item" v-for="(item,index) in bondedAndCommissionArr" :key="index">
							<p class="validator_commission_parent_content">
								<!-- <span>{{item.label}} <i @click="showChildren(index)" v-if="item.flShowSelectIcon" :class="item.flShowChildren ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i></span> -->
								<span>{{item.label}}</span>
								<span>{{item.value}}</span>
							</p>
							<ul class="validator_commission_children_content" v-if="item.flShowChildren">
								<li class="validator_commission_children_item" v-for="(childrenItem,childrenIndex) in item.children" :key="childrenIndex">
									<span>{{childrenItem.label}}</span>
									<span>{{childrenItem.value}}</span>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Constants from "../../constant/index.js";
	import Tools from "../../util/Tools.js";
	import ValidatorDetailScatter from "./ValidatorDetailScatter";
	import { getValidatorRewardsApi } from "@/service/api"
	import { getMainToken} from '@/helper/IritaHelper';
	import { converCoin } from '../../helper/IritaHelper.js';
	export default {
		name: "ValidatorCommissionInformation",
		components: {ValidatorDetailScatter},
		props:{
			validationCommissionInfo:{
				type:Object
			}
		},
		data(){
			return {
				informationData:'',
				validatorStatus:'',
				jailedData:{},
				irisTokenFixedNumber:6,
				irisTokenMaxFixedNumber:18,
				bondedAndCommissionArr:[
					{
						label: this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.commissionRate'),
						dataName:'commission_rate',
						value:'',
						flShowSelectIcon:false,
						flShowChildren:false,
						children:[

						]
					},
					{
						label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.bondedTokens'),
						dataName:'bonded_tokens',
						value:'',
						flShowSelectIcon:true,
						flShowChildren: true,
						children:[

						]
					},
					{
						label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.delegators'),
						dataName:'delegatorNum',
						flShowSelectIcon:false,
						flShowChildren:false,
						value:'',
						children:[

						]
					},
					{
						label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.totalShares'),
						dataName:'delegator_shares',
						flShowSelectIcon:false,
						flShowChildren:false,
						value:'',
						children:[

						]
					},
					{
						label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.commissionRewards'),
						dataName:'commissionRewards',
						flShowSelectIcon:false,
						flShowChildren:false,
						value:'',
						children:[

						]
					},
					{
						label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.commissionRateRange'),
						dataName:'commissionRateRange',
						flShowSelectIcon:true,
						flShowChildren: true,
						value:'',
						children:[

						]
					},
				]
			}
		},
		watch:{
			validationCommissionInfo(){
				this.informationData = this.validationCommissionInfo;
				this.handlePropsData()
			}
		},
		mounted(){
			this.informationData = this.validationCommissionInfo;
		},
		methods:{
			showChildren(index){
				if(index === 1 || index === 5){
					this.bondedAndCommissionArr[index].flShowChildren = !this.bondedAndCommissionArr[index].flShowChildren;
				}
			},
			async handlePropsData(){
				let mainToken = await getMainToken();
				let dataInfomation = this.informationData;
				this.jailedData.bonded_tokens = dataInfomation.bonded_tokens;
				this.jailedData.commission_rate = dataInfomation.commission_rate;
				this.jailedData.operator_address = dataInfomation.operator_addr;
				this.jailedData.moniker = dataInfomation.description.moniker;
				this.validatorStatus = Tools.firstWordUpperCase(dataInfomation.status);
				this.bondedAndCommissionArr.forEach( async item => {
					if(item.dataName === 'commissionRateRange'){
						item.value = `0 ~ ${Number(dataInfomation.commission_max_rate) * 100} %`;
						item.children.push({
							label: this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.children.maxChangeRateEverytime'),
							value: `0 ~ ${Number(dataInfomation.commission_max_change_rate) * 100} %`
						})
					}else if(item.dataName === 'bonded_tokens'){
						let bonded_tokens = await converCoin({
							amount: dataInfomation.bonded_tokens,
							denom: mainToken.denom
						})
						item.value =`${Tools.toDecimal(bonded_tokens.amount,this.irisTokenFixedNumber)} ${bonded_tokens.denom.toUpperCase()}`;
						let self_bond = dataInfomation.self_bond && dataInfomation.self_bond.amount && await converCoin(dataInfomation.self_bond)
						let bonded_stake = self_bond ? bonded_tokens.amount - self_bond.amount : bonded_tokens.amount
						let selfBonded = {
							label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.children.selfBonded'),
							value: `${ self_bond ? Tools.toDecimal(self_bond.amount,this.irisTokenFixedNumber) : '0.00'} ${self_bond ? self_bond.denom.toUpperCase() : mainToken.symbol.toUpperCase()}
								(${self_bond ? (Tools.formatPerNumber((self_bond.amount / Number(bonded_tokens.amount)) * 100)) : '0.00'} %)`
						};
						let delegatorBonded = {
							label:this.$t('ExplorerLang.validatorDetail.commissionInfo.bondedAndCommissionArr.children.delegatorBonded'),
							value:`${Tools.toDecimal(bonded_stake,this.irisTokenFixedNumber)} ${mainToken.symbol.toUpperCase()}
								 (${Tools.formatPerNumber((Number(bonded_stake) / Number(bonded_tokens.amount)) * 100)} %)`
						};
						item.children.unshift(selfBonded,delegatorBonded)
					}else if(item.dataName === 'delegator_shares'){
						// let delegator_shares = await converCoin({
						// 	amount: dataInfomation.delegator_shares,
						// 	denom: mainToken.denom
						// })
						// item.value = `${Tools.toDecimal(delegator_shares.amount,this.irisTokenFixedNumber)} ${delegator_shares.denom.toUpperCase()}`
						item.value = `${Tools.toDecimal(dataInfomation.delegator_shares,this.irisTokenFixedNumber)}`
					}else if(item.dataName === 'commission_rate'){
						item.value = `${Tools.formatPerNumber(Number(dataInfomation.commission_rate) * 100)} %`
					}else {
						item.value = dataInfomation[item.dataName]
					}
				});
				this.getValidatorRewards();
			},
			async getValidatorRewards() {
				let mainToken = await getMainToken();
				try {
					let data = await getValidatorRewardsApi(this.$route.params.param)
					if(data) {
						let commission = data.val_commission.commission && data.val_commission.commission[0]
						if(commission) {
							let amount = await converCoin(commission)
							this.bondedAndCommissionArr.map(item => {
								if(item.dataName === 'commissionRewards'){
									return item.value = `${Tools.toDecimal(Number(amount.amount),this.irisTokenFixedNumber)} ${mainToken.symbol.toUpperCase()}` || '--'
								}
							})
						} else {
							this.bondedAndCommissionArr.map(item => {
								if(item.dataName === 'commissionRewards'){
									return item.value = '--'
								}
							})
						}
					}
				} catch (e) {
					console.error(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.validator_commission_information_container{
		width: 100%;
		.validator_commission_information_title{
			max-width: 12.8rem;
			margin: 0 auto;
			span{
				display: inline-block;
				margin: 0.35rem 0 0.12rem 0;
				color: $t_first_c;
				font-size: $s18;
				line-height: 0.21rem;
				// padding-left: 0.2rem;
			}
		}
		.validator_commission_information_wrap{
			max-width: 12.8rem;
			margin: 0 auto;
			background: $bg_white_c;
			// border: 0.01rem solid $bd_first_c;
			.validator_commission_information_content{
				display: grid;
				grid-template-columns: repeat(1,50% 50%);
				box-sizing: border-box;
				padding: 0.3rem 0.2rem;
				.validator_commission_information_scatter_content{
					width: 100%;
					.validator_commission_information_scatter_title{
						font-size:  $s14;
						line-height: 0.16rem;
						color: $t_first_c;
					}
				}
				.validator_commission_bonded_container{
					.validator_commission_bonded_list{
						box-sizing: border-box;
						padding-left: 0.7rem;
						border-left: 0.01rem dashed $bd_first_c;
						font-size:  $s14;
						.validator_commission_bonded_item{
							display: flex;
							flex-direction: column;
							margin-top: 0.2rem;
							width: 100%;
							.validator_commission_parent_content{
								display: flex;
								span:nth-of-type(1){
									width: 1.9rem;
									color: $t_second_c;
								}
								span:nth-of-type(2){
									color: $t_first_c
								}
								i {
									cursor: pointer;
									color: $t_link_c;
								}
							}
							.validator_commission_children_content{
								display: flex;
								flex-direction: column;
								margin-top: 0.1rem;
								border: 0.01rem dashed $bd_first_c;
								box-sizing: border-box;
								padding: 0.1rem;
								.validator_commission_children_item{
									margin-top: 0.05rem;
									span:nth-of-type(1){
										display: inline-block;
										width: 1.79rem;
										color: $t_second_c;
										font-size:  $s12;
									}
									span:nth-of-type(2){
										display: inline-block;
										color: $t_first_c;
										font-size:  $s12;
									}
								}
								.validator_commission_children_item:first-child{
									margin-top: 0;
								}
							}
						}
						.validator_commission_bonded_item:first-child{
							margin-top: 0;
						}
					}
				}
			}
		}
	}
	@media screen and (max-width: 1050px){
		.validator_commission_information_container{
			.validator_commission_information_title{
				span{
					padding-left: 0.2rem;
				}
			}
			.validator_commission_information_wrap{
				margin: 0 0.2rem;

				.validator_commission_information_content{
					width: 100%;
					grid-template-columns: repeat(1,auto);
					grid-template-rows: repeat(2,auto);
					.validator_commission_bonded_container{
						margin-top: 0.3rem;
						.validator_commission_bonded_list{
							border-left: 0;
							padding-left: 0;
							padding-top: 0.3rem;
							border-top: 0.01rem solid $bd_first_c;
							.validator_commission_bonded_item{
								.validator_commission_children_content{
									margin-right: 0.2rem;
								}
							}
						}
					}
				}
			}
		}
	}
	@media screen and (max-width: 750px){
		.validator_commission_information_container{
			.validator_commission_information_title{
				span{
					padding-left: 0.15rem!important;
				}
			}
			.validator_commission_information_wrap{
				margin: 0 0.1rem;
				overflow-x: auto;
				.validator_commission_information_content{
					width: 100%;
					.validator_commission_information_scatter_content{
						overflow-x: auto;
					}
				}
			}
		}
	}
	@media screen and (max-width: 510px){
		.validator_commission_information_title {
			span {
				padding-left: 0.15rem !important;
			}
		}
	}
</style>
