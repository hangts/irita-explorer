<template>
	<div class="home_container">
		<div class="home_content_wrap">
			<div class="home_content_header_content">
				<StatisticalBar />
			</div>
			<div class="home_block_and_transaction_content">
				<div class="home_block_content">
					<div class="home_block_top_content">
						<div class="home_block_top_title">
							<i class="iconfont iconBlocks"></i>
							<span>{{$t('ExplorerLang.home.blocks')}}</span>
						</div>
						<div class="home_block_view_all">
							<router-link :to="`/blocks`">{{$t('ExplorerLang.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_block_bottom_content" v-if="latestBlockArray && latestBlockArray.length">
						<div v-for="(item,index) in latestBlockArray" :key="index" :class="item.flShowTranslationalAnimation ? 'animation ' : '' ">
							<li class="home_block_list_item_content"
							    :class="item.showAnimation === 'show' ? 'fadeIn_animation' : '' ">
								<p class="home_block_time_content">
									<router-link  class="home_block" :to="`block/${item.height}`">{{item.height}}</router-link>
									<span class="home_age_time"> {{item.blockAgeTime}}</span>
								</p>
								<p class="home_tx_time_content">
									<span class="home_tx">{{$t('ExplorerLang.home.txn')}}: <span>{{item.txNumber}}</span></span>
									<span class="home_time">{{item.time}}</span>
								</p>
							</li>
						</div>

					</ul>
					<ul class="home_block_bottom_content" v-else>
						<li style="padding-top: 15px">{{$t('ExplorerLang.message.requestFailed')}}</li>
					</ul>
				</div>
				<div class="home_transaction_content">
					<div class="home_transaction_top_content">
						<div class="home_transaction_top_title">
							<i class="iconfont iconTransactions"></i>
							<span>{{$t('ExplorerLang.home.listTransactions')}}</span>
						</div>
						<div class="home_transaction_view_all">
							<router-link :to="`/txs`">{{$t('ExplorerLang.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_transaction_bottom_content" v-if="latestTransaction && latestTransaction.length">
						<li class="home_transaction_list_item_content" v-for="(item,index) in latestTransaction" :key="index">
							<p class="home_transaction_time_content">
								<span class="home_transaction" >
									{{$t('ExplorerLang.home.tx')}}
									<el-tooltip effect="dark" :content="item.hash" placement="top">
										<router-link :to="`/tx?txHash=${item.hash}`">{{`${item.hash.substr(0,hashLength)}...`}}</router-link>
									</el-tooltip>
								</span>
								<span class="home_age_time">{{item.txAgeTime}}</span>
							</p>
							<p class="home_tx_type_content">
								<!-- <span class="home_tx_type">{{item.txType}}</span> -->
								<el-tooltip :content="setTipDisplay(item.txType)"
											placement="top"
											:disabled="item.txType.length <= 1">
									<span class="home_tx_type">{{getDisplayTxType(item.txType)}}</span>
								</el-tooltip>
								<span class="home_tx_time">{{item.time}}</span>
							</p>
						</li>
					</ul>
					<ul class="home_transaction_bottom_content" v-else>
						<li style="padding-top: 15px">{{$t('ExplorerLang.message.noTransaction')}}</li>
					</ul>
				</div>
			</div>
			<div class="home_proposal_container">
                <div class="home_proposal_container_content" v-for="item in votingPeriodDatas" :key="item.proposal_id">
                    <div class="home_proposal_item_bar">
                        <m-voting-card :votingBarObj="item" :showTitle="true"></m-voting-card>
                    </div>
                </div>
                <div class="home_proposal_container_content"  v-for="v in depositPeriodDatas" :key="v.proposal_id">
                    <div class="home_proposal_item_bar">
                        <m-deposit-card :depositObj="v" :showTitle="true"></m-deposit-card>
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	import Tools from "../util/Tools";
	import { getBlockList,getTxList } from "../service/api";
	import StatisticalBar from './common/StatisticalBar';
	import MDepositCard from "./common/MDepositCard";
	import MVotingCard from "./common/MVotingCard";
	import { getProposalsListApi } from '@/service/api.js';
	import {proposalStatus} from '../constant';
	import {moduleSupport} from "../helper/ModulesHelper";
	import prodConfig from "../productionConfig";
	import { getTxType } from "../helper/IritaHelper";
	export default {
		name: "Home",
		components: {StatisticalBar,MDepositCard,MVotingCard},
		data () {
			return {
				TX_TYPE_DISPLAY: {},
				syncTimer:null,
				latestBlockArray:[],
				latestTransaction:[],
				blocksTimer: null,
				transfersTimer:null,
				screenWidth: document.body.clientWidth,
				depositPeriodDatas:[],
				votingPeriodDatas: [],
				txTimer:null
			}
		},
		async mounted () {
			await this.getTxTypeData()
			this.getLastBlocks();
			this.getTransaction();
			this.gov();
			clearInterval(this.syncTimer)
			this.syncTimer = setInterval(() => {
				this.getLastBlocks();
			},8000);
			this.txTimer = setInterval(() => {
				this.getTransaction();
			},12530);//这个时间为了不跟block接口同时请求

			window.addEventListener("resize",this.monitorScreenWidth,false)
		},
		watch:{
			latestBlockArray(latestBlockArray){
				setTimeout( () => {
					latestBlockArray.forEach( item => {
						if(item.showAnimation){
							item.showAnimation = " "
						}
					})
				},1000)
			},
		},
		computed: {
			hashLength() {
				if(this.screenWidth < 400 ) {
					return 10
				}
				return 16
			}
		},
		methods:{
			async getTxTypeData(){
				try {
					let res = await getTxType()
					this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
				} catch (error) {
					console.log(error)
				}
			},
			getDisplayTxType(types=[]){
				if(types?.length){
					let type = this.TX_TYPE_DISPLAY[types[0]] || types[0] || '';
					if (type && types.length > 1) {
						type += this.$t('ExplorerLang.unit.ellipsis');
					}
					return type;
				}
			},
			setTipDisplay(txType){
				/*if(txType?.length){
					txType = txType.map(item => {
						return this.TX_TYPE_DISPLAY[item] || ''
					})
					return txType.join(',')
				}*/
				if (txType && Array.isArray(txType)) {
					/*let {txType} = Tools.urlParser();
					if(!txType){
						txType = sessionStorage.getItem('currentChoiceMsgType') ? sessionStorage.getItem('currentChoiceMsgType'):undefined;
					}*/
					let msgTxTypeIndex = 0, tmp = txType[0]
					txType.forEach((item, index) => {
						if (txType && item === txType) {
							msgTxTypeIndex = index
						}
					})
					if (msgTxTypeIndex !== 0) {
						txType[0] = txType
						txType[msgTxTypeIndex] = tmp
					}
					
					let data = txType.reduce(function (prev, next) {
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
					return this.TX_TYPE_DISPLAY[txType?.toString()] || this.TX_TYPE_DISPLAY[txType] || txType?.toString() || txType
				}
			},
			async getLastBlocks(){
				try{
					let blockData = await getBlockList(1, 10, false);
					if(blockData && blockData.data && blockData.data.length){
							let blocks = blockData.data;
							this.showBlockFadeinAnimation(blocks);
							let that = this;
							setTimeout( ()=> {
								that.latestBlockArray.map(item => {
									return item.flShowTranslationalAnimation = false
								})
							},1000);
							sessionStorage.setItem("lastBlockHeight",blocks[0].height);
							this.latestBlockArray = blocks.map(item => {
								return {
									flShowTranslationalAnimation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
									showAnimation: item.showAnimation ? item.showAnimation : "",
									height: item.height,
                                    time: Tools.formatLocalTime(item.time),
                                    Time: item.time,
									txNumber: item.txn,
									blockAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time*1000,"ago",">")
								}
							});
							clearInterval(this.blocksTimer)
							this.blocksTimer = setInterval( () => {
								that.latestBlockArray = that.latestBlockArray.map(item => {
									item.blockAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time*1000,"ago",">");
									return item
								})
							},1000)
						}
				}catch(err){
					console.error(err);
				}
			},
			async getTransaction(){
                const params = {
                    pageNum:1,
                    pageSize:10,
                };
                try {
                    const res = await getTxList(params);
                    if(res){
                        for (let txIndex = 0; txIndex < res.data.length; txIndex++){
                            let lastTxTime = Tools.getTimestamp();
                            if(sessionStorage.getItem("lastTxTime")){
                                lastTxTime = JSON.parse(sessionStorage.getItem("lastTxTime"));
                            }
                            if(res.data[txIndex].time > lastTxTime){
                                res.data[txIndex].showAnimation = "show";
                                res.data.forEach(item => {
                                    item.flShowTranslationalAnimation = true
                                })
                            }
                        }
                        setTimeout(()=> {
                            this.latestTransaction.map(item => {
                                return item.flShowTranslationalAnimation = false
                            })
                        },1000);
                        sessionStorage.setItem('lastTxTime',JSON.stringify(Tools.getTimestamp()));
                        this.latestTransaction = res.data.map(item => {
                            return {
                                flShowTranslationalAnimtation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
                                showAnimation: item.showAnimation ? item.showAnimation : '',
                                hash: item.tx_hash,
                                time: Tools.formatLocalTime(item.time),
                                // txType: item.msgs ? (item.msgs.length > 1 ? '--' : item.msgs[0].type) : '--',
                                txType: (item.msgs || []).map(item=>item.type),
                                Time: item.time,
                                txAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time*1000,"ago",">")
                            }
						});
                        clearInterval(this.transfersTimer);
                        this.transfersTimer = setInterval(()=> {
                            this.latestTransaction = this.latestTransaction.map(item => {
                                item.txAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time*1000,"ago",">");
                                return item
                            })
                        },1000)
                    }
                }catch (e) {
                    //this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                    console.error(e);
                }
			},
			showBlockFadeinAnimation (blockList) {
				let storedLastBlockHeight = sessionStorage.getItem('lastBlockHeight') ? sessionStorage.getItem('lastBlockHeight') : '';
				if(storedLastBlockHeight){
					for(let index = 0; index < blockList.length; index++){
						if(blockList[index].height > storedLastBlockHeight){
							blockList.forEach(item => {
								item.flShowTranslationalAnimation = true
							});
							blockList[index].showAnimation = "show";
						}
					}
				}
			},
			componentAgeTime(beginTime,endTime){
				return ((Number(new Date(beginTime).getTime()) - Number(new Date(endTime).getTime())) /1000/ 100).toFixed(2)
			},
			monitorScreenWidth() {
				this.screenWidth = document.body.clientWidth
			},
			async getProposalsByStatus() {
				try {
					let res = await getProposalsListApi(`${proposalStatus.votingPeriod},${proposalStatus.depositPeriod}`)
					if (res && res.data && res.data.length > 0) {
						this.depositPeriodDatas = res.data.filter(v => v.status === proposalStatus.depositPeriod)
						this.depositPeriodDatas = this.depositPeriodDatas.sort((a, b) => {
							return b.proposal_id - a.proposal_id
						})
						this.votingPeriodDatas = res.data.filter(v => v.status === proposalStatus.votingPeriod)
						this.votingPeriodDatas = this.votingPeriodDatas.sort((a, b) => {
							return b.proposal_id - a.proposal_id
						})
					}
				} catch (e) {
					console.error(e)
				}
			},
			gov() {
				if(moduleSupport('112', prodConfig.navFuncList)) {
					this.getProposalsByStatus();
				}
			}
		},
		destroyed () {
			clearInterval(this.blocksTimer);
			clearInterval(this.transfersTimer);
			clearInterval(this.syncTimer)
			clearInterval(this.txTimer)
			window.removeEventListener("resize",this.monitorScreenWidth);
		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}
	.home_container{
		.home_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			padding:0 0.15rem;
			.home_content_header_content{
				display: flex;
				flex-direction: column;
			}
			.home_block_and_transaction_content{
				display: flex;
				margin: 0.2rem 0 0.6rem 0;
				.home_block_content{
					flex: 1;
					margin-right: 0.2rem;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: $bg_white_c;
					.home_block_top_content{
						display: flex;
						justify-content: space-between;
						background: $bg_white_c;
						z-index: 2;
						.home_block_top_title{
							i{
								color: $theme_c;
								margin-right: 0.1rem;
							}
							span{
								color: $t_first_c;
								font-size: $s16;
								font-weight: bold;
							}
						}
						.home_block_view_all{
							font-size: $s14;
							a{
								color: $t_link_c;
							}
							border-bottom: 0.01rem solid $t_link_c;

						}
					}
					.home_block_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid $bd_third_c;
						font-size: $s14;
						color: $t_second_c;
						.home_block_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid $bd_third_c;
							.home_block_time_content{
								display: flex;
								justify-content: space-between;
								.home_block{
									a{
										color: $t_link_c ;
									}
								}
							}
							.home_tx_time_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
								.home_tx{
									span{
										color: $t_first_c;
									}
								}
							}
						}
						.animation{
							animation:translational_animation 1.1s infinite;
						}
						.home_transaction_bottom_content{
							margin-top: 0.24rem;
							border-top: 0.01rem solid $bd_third_c;
							font-size: $s14;
							color: $t_second_c;
						}
					}

				}
				.home_transaction_content{
					flex: 1;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: $bg_white_c;
					.home_transaction_top_content{
						display: flex;
						justify-content: space-between;
						.home_transaction_top_title{
							i{
								color: $theme_c;
								margin-right: 0.1rem;
							}
							span{
								color: $t_first_c;
								font-size: $s16;
								font-weight: bold;
							}
						}
						.home_transaction_view_all{
							font-size:$s14;
							a{
								color: $t_link_c;
							}
							border-bottom: 0.01rem solid $t_link_c;

						}
					}
					.home_transaction_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid $bd_third_c;
						font-size: $s14;
						color: $t_second_c;
						.home_transaction_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid $bd_third_c;
							.home_transaction_time_content{
								display: flex;
								justify-content: space-between;
								.home_transaction{
									font-size: $s14;
									color: $t_first_c;
									font-weight: bold;
									a{
										padding-left: 0.05rem;
										font-weight: lighter;
										color: $t_link_c ;
									}
								}
							}
							.home_tx_type_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
							}
						}
					}
				}
			}
			.home_proposal_container {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                box-sizing: border-box;
				   text-align: left;
				   margin: -0.2rem 0 0.4rem;
                .home_proposal_container_content{
					margin-bottom: 0.2rem;
                    .home_proposal_item_bar {
                        min-width: 5.9rem;
                        flex: 1;
                        width: auto;
                        margin-right: 0.4rem;
						.deposit_card_content {
							min-height: 2.1rem !important;
						}
                    }

                    .home_proposal_item_bar:nth-child(even) {
                        margin-right: 0;
                    }

                    .home_proposal_item_bar:last-child {
                        margin-right: 0;
                    }
                }
            }
		}
	}
	.fadeIn_animation{
		animation: fadeIn 1s 1 0s;
	}
	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes translational_animation{
		from{transform: translateY(-0.59rem);}
		to{transform: translateY(0)}
	}

	@media screen and (max-width: 1000px) {
		.home_container{
			.home_content_wrap{
				.home_content_header_content{
				}
				.home_block_and_transaction_content{
					flex-direction:column;
					.home_block_content{
						margin-right: 0rem;
						.home_block_top_content{
							.home_block_top_title{
								i{

								}
								span{

								}
							}
							.home_block_view_all{
								a{

								}
							}
						}
						.home_block_bottom_content{

							.home_block_list_item_content{

								.home_block_time_content{

									.home_block{
										a{

										}
									}
								}
								.home_tx_time_content{

									.home_tx{
										span{

										}
									}
								}
							}
							.animation{

							}
						}

					}
					.home_transaction_content{
						margin-top:0.2rem;
						.home_transaction_top_content{

							.home_transaction_top_title{
								i{

								}
								span{

								}
							}
							.home_transaction_view_all{
								a{

								}


							}
						}
						.home_transaction_bottom_content{

							.home_transaction_list_item_content{

								.home_transaction_time_content{

									.home_transaction{

										a{

										}
									}
								}
								.home_tx_type_content{

								}
							}
						}
					}
				}
				.home_proposal_container{
					display: flex;
					flex-direction: column;
					.home_proposal_item_bar{
						margin-right: 0;
					}
					.home_proposal_item_bar:nth-child(even){
						margin-right: 0;
					}
					.home_proposal_item_bar:last-child{
						margin-right: 0;
					}
				}
			}
		}
	}
	@media screen and (min-width: 1000px) and (max-width: 1248px){
		.home_container{
			.home_content_wrap {
				.home_proposal_container{
					display: flex;
					flex-direction: column;
					.home_proposal_item_bar{
						margin-right: 0;
					}
					.home_proposal_item_bar:nth-child(even){
						margin-right: 0;
					}
					.home_proposal_item_bar:last-child{
						margin-right: 0;
					}
				}
			}
		}

	}
	@media screen and (max-width: 910px){
		.home_container{
			.home_content_wrap{
				.home_proposal_container{
					display: flex;
					flex-direction: column;
					margin-bottom: 0.2rem;
					.home_proposal_container_content{
						width: 100%;
						overflow-x: auto;
						overflow-y: hidden;
						.home_proposal_item_bar{
							margin-right: 0;
							margin-bottom: 0.2rem;
							min-width: 3.45rem;
							.deposit_card_content{
								margin-bottom: 0;
							}
						}

					}

				}
			}
		}
	}
	@media screen and (max-width: 405px) {
		.home_container{
			.home_content_wrap{
				.home_content_header_content{
				}
				.home_block_and_transaction_content{
					margin: 0.2rem 0 0.3rem 0;
					.home_block_content{
						padding: 0.27rem 0.12rem 0.18rem 0.12rem;
						.home_block_top_content{
							.home_block_top_title{
								i{

								}
								span{

								}
							}
							.home_block_view_all{
								a{

								}
							}
						}
						.home_block_bottom_content{

							.home_block_list_item_content{

								.home_block_time_content{

									.home_block{
										a{

										}
									}
								}
								.home_tx_time_content{

									.home_tx{
										span{

										}
									}
								}
							}
							.animation{

							}
						}

					}
					.home_transaction_content{
						padding: 0.27rem 0.12rem 0.18rem 0.12rem;
						.home_transaction_top_content{

							.home_transaction_top_title{
								i{

								}
								span{

								}
							}
							.home_transaction_view_all{
								a{

								}


							}
						}
						.home_transaction_bottom_content{

							.home_transaction_list_item_content{

								.home_transaction_time_content{

									.home_transaction{

										a{

										}
									}
								}
								.home_tx_type_content{

								}
							}
						}
					}
				}
			}
		}
	}
</style>
