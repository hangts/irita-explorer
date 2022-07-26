<template>
  <el-tooltip :content="$t('ExplorerLang.refreshButtonTooltip')">
    <button class="ref_content" @click="refreshParams">
<!--      <i class="iconfont iconzhongzhi"></i>-->
      <div class="iconfont"></div>
      <div class="iconfont_white"></div>
      <span class="refresh_button_label">{{$t('ExplorerLang.refreshButton')}}</span>
    </button>
  </el-tooltip>
</template>

<script>
export default {
  name: "TxRefreshButtonComponent",
  methods:{
    refreshParams(){
      this.$emit('refreshParams', '');
    }
  }
}
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
  &:hover{
    background: $theme_c;
    color: #fff;
    .iconfont{
      display: none;
    }
    .iconfont_white{
      display: block;
    }
  }
  .iconfont{
    width: 0.12rem;
    height: 0.12rem;
    background: url("../../assets/refresh.png") center center/cover;
    display: block;
  }
  .iconfont_white{
    display: none;
    width: 0.12rem;
    height: 0.12rem;
    background: url("../../assets/refresh-white.png") center center/cover;
  }
  .refresh_button_label{
    margin-left: 0.09rem;
  }
}
</style>