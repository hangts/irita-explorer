<template>
  <button class="ref_content" @click="resetParams">
    <i class="iconfont iconzhongzhi"></i>
  </button>
</template>

<script>
export default {
  name: 'TxResetButtonComponent',
  methods: {
    resetParams() {
      /* this.statusTypes.forEach(item => {
				item.isActive = false
			})
			this.statusTypes[0].isActive = true
			this.value = [] */
      this.$emit('resetParams', '');
    },
  },
};
</script>

<style scoped lang="scss">
.ref_content{
	border: none;
	background: $theme_c;
	color: #fff;
	border-radius: 0.08rem;
	width: 0.32rem;
	height: 0.32rem;
	margin-top: 0.2rem;
}
</style>
