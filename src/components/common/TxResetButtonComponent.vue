<template>
  <el-tooltip :content="$t('ExplorerLang.resetButtonTooltip')" :disabled="$store.state.isHideButtonTooltip">
    <button class="ref_content" @click="resetParams">
      <i class="iconfont iconreload"></i>
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
  padding: 0.07rem;
  font-size: 0.12rem;
  border: 0.01rem solid $theme_c;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 0.32rem;
  margin-left: 0.1rem;
  @media (max-width: 460px) {
    margin-top: 0.08rem;
    margin-left: 0;
  }
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
