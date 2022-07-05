<template>
	<div class="footer_container" 
	  	 :style="`color:${(prodConfig.footer || {}).color || 'rgba(255,255,255,0.5)'}`">
		<div class="footer_content_bg_top"
			 v-if="logoImg.length"
		     :style="`background:${(prodConfig.footer || {}).bgColor_top || '#363A3D'}`">
			<div class="footer_content_bg_top_container">
				<div class="footer_content_top">
					<img class="footer_content_top_icon" :src="logoImg" alt="">
				</div>
				<!-- 新增 -->
				<div v-if="prodConfig.footer.linkShow" class="footer_right_content">
					<div class="footer_link_wrap">
						<a href="https://www.irisnet.org/testnets"
						target="_blank">
							<span class="footer_link_contact">Use Testnet</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="footer_content_bg_bottom"
			 :style="`background:${(prodConfig.footer || {}).bgColor_bottom || '#000000'}`">
			<div class="footer_content_bottom" ref="iphone_style">
				<p>{{(prodConfig.footer || {}).copyright || 'copyright © 2021 边界智能'}}</p>
				<p v-if="(prodConfig.footer || {}).chainIdShow">{{chainId}}</p>
				<p v-if="(prodConfig.footer || {}).versionShow">{{version}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	import prodConfig from "../../productionConfig"
	import { getNodeInfo } from "../../service/api"
	import {moduleSupport} from "../../helper/ModulesHelper"
	import {product} from '../../constant'
	export default {
		name: "Footer",
		data(){
			return {
				prodConfig,
				moduleSupport,
				chainId:'',
				version:''
			};
		},
		computed:{
			logoImg(){
				let img = '';
				// try {img = require('../../assets/footer_logo.png');}catch(e){}
				return img;
			}
		},
		mounted(){
			this.nodeInfo();
			
			const isIphoneX = () => {
				return !!(window.navigator.userAgent.match(/iphone/i) && window.screen.height >= 812 && window.screen.width >= 375)
			}
			if(isIphoneX()) {
				this.$refs.iphone_style.style.marginBottom = '0.2rem'
			}
			
		},
		methods:{
			async nodeInfo(){
				let nodeInfo = await getNodeInfo();
				if (nodeInfo) {
					this.chainId = `Chain ID ${nodeInfo.node_info.network || '--'}`;
					if(prodConfig.product == product.cosmosHub) {
						this.version = `Node Version ${nodeInfo.application_version.name} ${nodeInfo.application_version.version || '--'}`;
					} else if (prodConfig.product == product.nyancat || prodConfig.product == product.irishub) {
						this.version = `Node Version irishub ${nodeInfo.application_version.version || '--'}`;
					} else if(prodConfig.product == product.cschainOtc) {
						this.version = `Node Version cschain ${nodeInfo.application_version.version || '--'}`;
					} else {
						this.version = `Node Version ${nodeInfo.application_version.version || '--'}`;
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.footer_container{
		.footer_content_bg_top{
			padding:0 0.15rem;
			display: flex;
			justify-content: center;
			.footer_content_bg_top_container {
				flex: 1;
				max-width:12rem;
				display: flex;
				justify-content: space-between;
				align-items:center;
				.footer_content_top{
					font-size:$s14;
					font-weight:400;
					.footer_content_top_icon{
						height:0.6rem;
						margin:0.48rem 0;
					}
				}
				.footer_right_content {
					padding: 0.24rem;
					display: flex;
					align-items: center;
					a {
						color: $t_button_c;
					}
				}
			}
		}
		.footer_content_bg_bottom{
			padding:0 0.15rem;
			display: flex;
			justify-content: center;
			min-height: 0.48rem;
			.footer_content_bottom{
				display: flex;
				flex:1;
				justify-content: space-between;
				align-items:center;
				// font-size:$s12;
				font-size:$s14;
				max-width:12rem;
				font-family: PublicSans;
				p {
					margin:0.05rem 0.15rem;
				}
				p:first-child{
					margin-left:0;
				}
				p:last-child{
					margin-right:0;
				}
				@media (max-width: 500px) {
					flex-direction:column;
					p {
						margin:0.03rem !important;
						text-align: center;
					}
				}
			}
		}
	}
</style>
