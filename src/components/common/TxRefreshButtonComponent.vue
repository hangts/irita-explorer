<template>
  <el-tooltip
    :content="$t('ExplorerLang.refreshButtonTooltip')"
    :disabled="$store.state.isHideButtonTooltip"
  >
    <button class="ref_content" @click="refreshParams">
      <i class="iconfont iconrefresh"></i>
      <span class="refresh_button_label">{{ $t('ExplorerLang.refreshButton') }}</span>
    </button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TxRefreshButtonComponent',
  methods: {
    refreshParams() {
      this.$emit('refreshParams', '');
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
  &:hover {
    background: $theme_c;
    color: #fff;
  }
  .iconfont {
    font-size: 0.12rem;
  }
  .refresh_button_label {
    margin-left: 0.09rem;
  }
}
</style>
