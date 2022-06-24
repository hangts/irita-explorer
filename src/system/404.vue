<template>
	<div class="not_found_container">
		<div class="not_found_content">
			<img class="not_found_img" src="../assets/404.png" alt="">
			<p class="not_found_title">{{ $t('ExplorerLang.system.pageNotFound') }}</p>
			<router-link class="go_back_button" to="/">{{ $t('ExplorerLang.system.goBack') }}</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "404"
}
</script>

<style scoped lang="scss">
.not_found_container {
	background: url("../assets/no_found_bg.png") no-repeat center center;
	background-size: cover;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.not_found_content {
		max-width: 6.1rem;
		
		.not_found_img {
			width: 100%;
		}
		
		.not_found_title {
			margin-top: 0.96rem;
			font-size: 0.24rem;
			font-weight: normal;
			color: #171D44;
			line-height: 0.24rem;
			display: flex;
			flex-direction: row;
			justify-content: center;
			margin-bottom: 0.29rem;
			@media (max-width: 768px) {
				font-size: 0.24rem;
				line-height: 0.24rem;
				margin-top: 0.68rem;
			}
			@media (max-width: 560px) {
				font-size: 0.16rem;
				line-height: 0.28rem;
			}
		}
		
		.go_back_button {
			background: #171D44;
			box-shadow: 0.01rem 0.02rem 0.04rem 0 #EFEFEF;
			border-radius: 0.06rem;
			padding: 0.05rem 0.12rem;
			color: #fff;
		}
	}
}
</style>