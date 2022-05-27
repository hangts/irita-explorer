<template>
	<div class="tabs_container">
		<vue-scroll :ops="opsConfig">
			<div class="tabs_content">
				<el-button
					size="small"
					v-for="(item,index) in tabList"
					:key="item.label"
					@click.stop="clickButton(item,index)"
					:class="Number($store.state.currentTxModelIndex) === index ? 'active_style' :'default_style'">{{setDisplayMagType(item.label)}}
				</el-button>
			</div>
		</vue-scroll>
		
		<div class="child_tabs_content" v-show="$store.state.isShowMsgChildrenType">
			<div class="tag_content">
				<div class="tag_v_scroll_content" ref="tag_content_wrap">
					<vue-scroll :ops="tagOpsConfig">
						<el-card>
							<el-tag v-for="(value,index) in childrenTabs"
									:key="value.value"
									@click.stop="selectMsgType(value,index,childrenTabs)"
									:class="value.active ? 'active_tag_style' : 'default_tag_style'">
								{{ setDisplayMsgType(value.value) }}
							</el-tag>
						</el-card>
					</vue-scroll>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Tools from "../../util/Tools";
import {getTxType} from "../../helper/IritaHelper";
import prodConfig from "../../productionConfig"
export default {
	name: "TabsComponent",
	data() {
		return {
			currentClickIndex: 0,
			// isShowChildren: false,
			childrenTabs: [],
			positionTop: 0,
			currentMsgTypeClickIndex: '',
			currentMsgType:  null,
			TX_TYPE_DISPLAY:{},
			moduleTxTypeDisplay:[],
			moduleMap:new Map(),
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
			},
			tagOpsConfig:{
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
		tabList: {
			type: Array,
			default: [],
		},
		reset: {
			type: Function
		}
	},
	watch: {
		tabList: {
			handler(newValue, oldValue) {
       
                this.runTypeListData(newValue);
			},
			deep: true
		},
		currentChoiceMsgType: {
			header(newValue, oldValue) {
			},
			deep: true
		}
	},
	mounted() {
   
		this.getTxTypeData()
		let typeListData = null,moduleData = null;
		if(sessionStorage.getItem('typeList')){
			typeListData = JSON.parse(sessionStorage.getItem('typeList')) || null
		}
		if(sessionStorage.getItem('txType')){
			moduleData = JSON.parse(sessionStorage.getItem('txType')).txTypeData || null
		}
		this.moduleMap = new Map()
		if(moduleData?.length){
			moduleData.forEach( item => {
				this.moduleMap.set(item.module_en,item)
			})
		}
        this.runTypeListData(typeListData);
		this.setTagContentHeight()
		window.addEventListener("resize", this.windowResizeFunc,true);
	},
	methods: {
		setDisplayMagType(value){
			if(this.moduleMap.has(value)){
				if(prodConfig.lang === 'CN'){
					return this.moduleMap.get(value).module_cn
				}else if(prodConfig.lang === 'EN'){
					return this.moduleMap.get(value).module_en
				}
			}else {
				return value
			}
		},
		windowResizeFunc(){
			this.setTagContentHeight()
		},
		setTagContentHeight(){
			let clientHeight = document.body.clientHeight;
			if(this.$refs.tag_content_wrap){
				this.$refs.tag_content_wrap.style.height = `${Number(clientHeight)  * 0.26}px`
			}
		},
		setDisplayMsgType(msgType){
			if(msgType){
				return this.TX_TYPE_DISPLAY[msgType] || msgType
			}
			return ''
		},
		async getTxTypeData() {
			try {
				let res = await getTxType()
				this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
			} catch (error) {
				console.log(error)
			}
		},
		clickButton(value, index) {
			// this.isShowChildren = false
			this.$store.commit('isShowMsgChildrenType',false)
			if (value?.children) {
				this.childrenTabs = value.children
				// this.isShowChildren = true
				this.$store.commit('isShowMsgChildrenType',true)
				const currentSearchType = sessionStorage.getItem('currentChoiceMsgType') || ''
				const {txType} = Tools.urlParser();
				value.children.forEach((item, index) => {
					item.active = 0
					if(value.children[0].label ==='secondaryAll'){
						value.children[0].active = 0
					}
					if(txType && txType.indexOf(',') !== -1){
						const currentTxType = txType.split(',')
						const currentMsgTypes = currentTxType.sort((a,b) =>{
							return a.localeCompare(b)
						})
						const currentNotHasAllMsgType  = value.children.filter( item => {
							return item.label !== 'secondaryAll'
						})
						const currentNotHasAllMsgTypeValue = currentNotHasAllMsgType.map( item => item.value)
						const currentNotHasAllMsgTypeSortValue = currentNotHasAllMsgTypeValue.sort((a,b) => {
							return a.localeCompare(b)
						})
						
						if(JSON.stringify(currentMsgTypes) === JSON.stringify(currentNotHasAllMsgTypeSortValue)){
							value.children[0].active = 1
						}
					}
					if (item.value === txType || item.value === currentSearchType) {
						item.active = 1
					}
				})
			}
			this.currentClickIndex = index
			this.$store.commit('currentTxModelIndex',index)
			sessionStorage.setItem('currentTxModelIndex',index)
			if(!index){
				sessionStorage.setItem('lastChoiceMsgModelIndex',this.currentClickIndex)
			}
			if (!value.value) {
				sessionStorage.setItem('currentChoiceMsgType', '')
				this.$emit('onSelectMagType', {
					label:'all',
					value:''
				})
			}
			value.index = index
			this.$emit('onSelectMagModel', value)
		},
		selectMsgType(msgType, index,childrenTabs) {
			this.childrenTabs.forEach((item) => {
        
				if (item.active) {
					item.active = 0
				}
				if (msgType.value === item.value) {
					item.active = 1
				}
			})
			// this.isShowChildren = false
			sessionStorage.setItem('lastChoiceMsgModelIndex',this.currentClickIndex)
			this.$store.commit('isShowMsgChildrenType',false)
			sessionStorage.setItem('currentChoiceMsgType', msgType.value)
			if(msgType.label === 'secondaryAll'){
				this.$emit('onSelectMagType', childrenTabs)
			}else {
				this.$emit('onSelectMagType', msgType)
			}

		},
        runTypeListData(typeListData) {
          
		    const {txType} = Tools.urlParser();
            if(typeListData?.length){
                typeListData.forEach( (item,index) =>{
                    if(item.children && txType){
                        if(txType && txType.indexOf(',') !== -1){
                            const currentTxType = txType.split(',')
                            const currentMsgTypes = currentTxType.sort((a,b) =>{
                                return a.localeCompare(b)
                            })
                            const currentNotHasAllMsgType  = item.children.filter( item => {
                                return item.label !== 'secondaryAll'
                            })
                            const currentNotHasAllMsgTypeValue = currentNotHasAllMsgType.map( item => item.value)
                            const currentNotHasAllMsgTypeSortValue = currentNotHasAllMsgTypeValue.sort((a,b) => {
                                return a.localeCompare(b)
                            })
                            
                            if(JSON.stringify(currentMsgTypes) === JSON.stringify(currentNotHasAllMsgTypeSortValue)){
                                sessionStorage.setItem('lastChoiceMsgModelIndex',index)
                                this.$store.commit('currentTxModelIndex',index)
                            }
                        }else {
                            item.children.forEach( item =>{
                                if(item.value === txType){
                                    sessionStorage.setItem('lastChoiceMsgModelIndex',index)
                                    this.$store.commit('currentTxModelIndex',index)
                                }
                            })
                        }
                    }
                })
            }
        }
	}
}
</script>

<style scoped lang="scss">
.tabs_container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	position: relative;
	::v-deep .__vuescroll {
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
	.tabs_content {
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		margin-bottom:0.1rem;
		::v-deep.el-button {
			border: none;
			box-shadow: 0.01rem 0.02rem 0.04rem 0.01rem #EFEFEF;
			margin-bottom: 0.1rem;
			color: rgba(23, 29, 68, 1);
			border-radius: 0.08rem;
			outline: none !important;
			font-size: $s14;
			padding-left: 0.08rem;
			padding-right: 0.08rem;
			&:hover {
				background: rgba(90, 93, 99, 0.1);
			}
			
		}
		
		.default_style {
			color: rgba(23, 29, 68, 1);
		}
		
		.active_style {
			background: $theme_c !important;
			color: #fff;
		}
	}
	
	.child_tabs_content {
		width: 100%;
		z-index: 10;
		display: flex;
		justify-content: flex-start;
		position: relative;
		
		.tag_content {
			z-index: 9;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			animation: fadeInDown 0.2s linear;
			::v-deep .el-card {
				padding: 0.18rem 0.18rem 0 0.18rem;
				.el-card__body {
					padding: 0;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
				}
				
				.el-tag {
					background: #fff;
					border-color: rgba(231, 234, 243, 1);
					color: #909399 !important;
					margin-right: 0.12rem;
					margin-bottom: 0.14rem;
					font-size: 0.12rem;
					cursor: pointer;
				}
				
				.active_tag_style {
					color: $theme_c !important;
					background: $tag_c !important;;
				}
			}
		}
		
		
	}
	
}

@keyframes fadeInDown {
	0% {
		transform: translateY(-0.4rem);
	}
	100% {
		transform: translateY(0);
	}
}
</style>