<template>
	<div class="maintenance_container">
			<div class="maintenance_content">
				<img class="maintenance_image" src="../assets/maintenance_page.png" alt="">
				<p class="maintenance_title">{{$t('ExplorerLang.system.maintenance')}}</p>
			</div>
	</div>
</template>

<script>
export default {
	name: "Maintenance"
}
</script>

<style scoped lang="scss">
.maintenance_container{
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.maintenance_content{
		max-width: 6.1rem;
		
		.maintenance_image{
			width: 100%;
		}
		.maintenance_title{
			margin-top: 0.96rem;
			font-size: 0.48rem;
			font-weight: normal;
			color: #171D44;
			line-height: 0.55rem;
			display: flex;
			flex-direction: row;
			justify-content: center;
			@media (max-width: 768px) {
				font-size: 0.32rem;
				line-height: 0.48rem;
				margin-top: 0.68rem;
			}
			@media (max-width: 560px) {
				font-size: 0.16rem;
				line-height: 0.28rem;
			}
		}
	}
}
</style>