<template>
  <el-tooltip :content="$t('ExplorerLang.resetButtonTooltip')">
    <button class="ref_content" @click="resetParams">
      <i class="iconfont iconzhongzhi"></i>
      <span class="reset_button_label">{{ $t('ExplorerLang.resetButton') }}</span>
    </button>
  </el-tooltip>
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
.ref_content {
  background: #fff;
  color: $theme_c;
  border-radius: 0.06rem;
  margin-top: 0.2rem;
  padding: 0.1rem;
  font-size: 0.12rem;
  border: 0.01rem solid $theme_c;

  &:hover {
    background: $theme_c;
    color: #fff;
  }

  .iconfont {
    font-size: 0.12rem;
  }

  .reset_button_label {
    margin-left: 0.09rem;
  }
}
</style>
