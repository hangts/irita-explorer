<template>
	<div class="tx_count_content">
		<div class="tx_count_content_wrap">
			<span :class="`iconfont ${icon}` "></span>
			<span class="tx_count_label"> {{ title }}</span>
			<span class="tx_count_number">
			<router-link class="link_style" v-if="isLink" :to="`${linkRoute}/${txCount}`">
				{{ txCount }}
			</router-link>
			<span v-else>{{ txCount }}</span>
		</span>
		</div>
		<div class="show_address_send_tx_content">
			<slot name="displayShowAddressSendTx"></slot>
		</div>
	</div>
</template>

<script>
export default {
  name: 'TxCountComponent',
  props: {
    txCount: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    linkRoute: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.tx_count_content {
	display: flex;
	margin: 0.2rem 0 0 0;
	align-items: center;
	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
	}
	.iconfont {
		margin-right: 0.08rem;
	}

	.tx_count_label {
		font-size: 0.18rem;
		color: rgba(23, 29, 68, 1);
		margin-right: 0.16rem;
		line-height: 0.32rem;
	}

	.tx_count_number {
		font-size: 0.18rem;
		line-height: 0.32rem;

		.link_style {
			color: $theme_c !important;
		}
	}
	.show_address_send_tx_content{
		margin-left: 0.2rem;
		@media (max-width: 768px) {
			margin-left: 0;
		}
	}
}
</style>
