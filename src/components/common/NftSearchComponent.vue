<template>
  <div class="nft_search_container">
    <el-input
      class="nft_search_content"
      v-model.trim="input"
      size="small"
      @change="handleSearchClick"
      :placeholder="inputPlaceholder"
    >
      <el-button
        class="search_btn"
        type="primary"
        size="small"
        slot="append"
        icon="el-icon-search"
        @click="handleSearchClick"
      ></el-button>
    </el-input>
    <!--    <div class="tx_type_mobile_content">
      <el-button type="primary" size="small" class="search_btn" @click="handleSearchClick">
        {{ $t('ExplorerLang.nftAsset.search') }}
      </el-button>
    </div>-->
  </div>
</template>

<script>
export default {
  name: 'NftSearchComponent',
  props: {
    inputPlaceholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
    };
  },
  methods: {
    handleSearchClick() {
      this.$emit('searchInput', this.input);
    },
    resetFilterCondition() {
      this.input = '';
      this.$emit('resetFilterCondition', this.input);
    },
  },
};
</script>

<style scoped lang="scss">
.nft_search_container {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  margin: 0.2rem 0;
  ::v-deep.nft_search_content {
    max-width: 3.5rem;
    .el-input-group__append{
      padding: 0 0.09rem;
    }
    .search_btn {
      align-items: center;
      display: flex;
      background: $theme_c !important;
      padding: 0.1rem 0.09rem 0.09rem 0.09rem;
      border-radius: 0.06rem;
      .el-icon-search {
        color: #fff;
      }
    }
  }

  ::v-deep .el-input {
    .el-input__inner:focus {
      border-color: $theme_c !important;
    }
  }
}
</style>
