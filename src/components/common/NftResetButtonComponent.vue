<template>
  <div class="nft_reset_button_container">
    <el-tooltip :content="$t('ExplorerLang.resetButtonTooltip')">
      <el-button type="primary" size="small" class="reset_btn" @click="resetFilterCondition"
      >
        <!--        <i class="iconfont iconzhongzhi"></i>-->
        <div class="iconfont"></div>
        <div class="iconfont_white"></div>
        {{ $t('ExplorerLang.resetButton') }}
      </el-button
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
::v-deep.nft_reset_button_container {
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
      span{
        .iconfont{
          display: none;
        }
        .iconfont_white{
          display: block;
        }
      }
    }

    span {
      display: flex;
      flex-direction: row;
      align-items: center;

      .iconfont {
        width: 0.12rem;
        height: 0.12rem;
        background: url("../../assets/reset.png") center center/cover;
        display: block;
        margin-right: 0.08rem;
      }

      .iconfont_white {
        display: none;
        width: 0.12rem;
        height: 0.12rem;
        margin-right: 0.08rem;
        background: url("../../assets/reset-white.png") center center/cover;
      }
    }
  }
}
</style>
