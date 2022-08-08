<template>
  <div class="nft_reset_button_container ref_content">
    <el-tooltip
      :content="$t('ExplorerLang.resetButtonTooltip')"
      :disabled="$store.state.isHideButtonTooltip"
    >
      <el-button type="primary" size="small" class="reset_btn" @click="resetFilterCondition">
        <i class="iconfont iconreload"></i>
        {{ $t('ExplorerLang.resetButton') }}
      </el-button>
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
::v-deep.nft_reset_button_container {
  margin-top: 0.2rem;
  margin-left: 0.1rem;
  @media (max-width: 460px) {
    margin-top: 0.08rem;
    margin-left: 0;
  }
  .reset_btn {
    background: #fff;
    border-color: $theme_c;
    border-radius: 0.06rem;
    color: $theme_c;
    padding: 0.1rem 0.07rem;
    height: 0.32rem;
    &:hover {
      background: $theme_c;
      color: #fff;
    }
    span {
      display: flex;
      flex-direction: row;
      align-items: center;
      .iconfont {
        font-size: 0.12rem;
        margin-right: 0.09rem;
      }
    }
  }
}
</style>
