<template>
  <div class="nft_reset_button_container">
    <el-tooltip :content="$t('ExplorerLang.resetButtonTooltip')">
      <el-button type="primary" size="small" class="reset_btn" @click="resetFilterCondition"
        ><i class="iconfont iconzhongzhi"></i>{{ $t('ExplorerLang.resetButton') }}</el-button
      >
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'NftResetButtonComponent',
  methods: {
    resetFilterCondition() {
      this.input = '';
      this.$emit('resetFilterCondition');
    },
  },
};
</script>

<style scoped lang="scss">
.nft_reset_button_container {
  margin-top: 0.2rem;
  .reset_btn {
    background: #fff;
    border-color: $theme_c;
    border-radius: 0.06rem;
    color: $theme_c;
    padding: 0.1rem 0.08rem 0.1rem 0.07rem;
    &:hover {
      background: $theme_c;
      color: #fff;
    }
    .iconfont {
      font-size: 0.12rem;
      padding-right: 0.1rem;
    }
  }
}
</style>
