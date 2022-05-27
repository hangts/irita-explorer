<template>
  <div class="denom_list_container">
    <div class="denom_list_content_wrap">
      <div class="denom_list_header_content">
        <h3 class="denom_list_header_title">
          {{ $t("ExplorerLang.ddc.mainTitle") }}
        </h3>
      </div>
      <div class="nef_list_table_container">
        <list-component
          :empty-text="$t('ExplorerLang.table.emptyDescription')"
          :is-loading="isDdcListLoading"
          :list-data="ddcList"
          :column-list="ddcListColumn"
          :pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
          @pageChange="pageChange"
        >
          <template v-slot:txCount>
            <tx-count-component :title="$t('ExplorerLang.ddc.subTitle')" :icon="'iconxingzhuangjiehe'" :tx-count="count"></tx-count-component>
          </template>
			<template v-slot:resetButton>
				<nft-reset-button-component @resetFilterCondition="resetFilterCondition"></nft-reset-button-component>
			</template>
          <template v-slot:datePicket>
              <nft-search-component
                  :input-placeholder="$t('ExplorerLang.ddc.placeHolder')"
                  @searchInput="handleSearchClick" ref="denomSearchNode"></nft-search-component>
          </template>
        </list-component>
      </div>
    </div>
  </div>
</template>

<script>
import { getDdcList } from "@/service/api";
import Tools from "@/util/Tools";
import ListComponent from "../common/ListComponent";//新增
import ddcListColumnConfig from "../tableListColumnConfig/ddcListColumnConfig";
import TxCountComponent from "../TxCountComponent";
import NftSearchComponent from "../common/NftSearchComponent";
import NftResetButtonComponent from "../common/NftResetButtonComponent";
export default {
  name: "DDCList",
  components: {NftResetButtonComponent, NftSearchComponent,ListComponent,TxCountComponent },//新增
  data() {
    return {
      isDdcListLoading:false,//新增
      ddcListColumn:[],//新增的
      ddcList: [],
      value: "all",
      pageNum: 1,
      pageSize: 10,
      input: "",
      count: 0
    };
  },
  mounted() {
    this.ddcListColumn = ddcListColumnConfig
    this.getDdcList();
    this.getDdcListCount();
  },
  methods: {
    resetFilterCondition() {
      this.input = "";
      this.pageNum = 1;
      this.getDdcListCount();
      this.getDdcList();
      this.$refs.denomSearchNode.resetFilterCondition()
    },
    handleNftCountClick(denomId) {
      this.$router.push(`/nftAsset?denomId=${denomId}`);
      this.$store.commit("SET_TEMP_DENOM_ID", denomId);
    },
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getDdcList();
    },
    handleSearchClick(input) {
      this.input = input
      this.pageNum = 1;
      this.getDdcListCount();
      this.getDdcList();
    },
    async getDdcList() {
        this.isDdcListLoading = true
      try {
        const res = await getDdcList({
          owner:'',
          ddc_id: this.input,
          contract_address: '',
          useCount: false,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.ddcList = res.data.map(item => {
            return {
              ddcId: item.ddc_id,
              ddcName: item.ddc_name,
              contractAddr: item.contract_address,
              owner: item.owner,
              creator: item.creator,
              ddcUri: item.ddc_uri || '--',
              Time: Tools.formatLocalTime(item.lastest_tx_time),
            };
          });
          this.pageSize = res.pageSize;
          this.pageNum = res.pageNum;
        } else {
            this.ddcList = [];
        }
        this.isDdcListLoading = false//新增
      } catch (e) {
          this.isDdcListLoading = false//新增
        console.error(e);
      }
    },
    async getDdcListCount() {
      try {
        const res = await getDdcList({
          owner:'',
          ddc_id: this.input,
          contract_address: '',
          useCount: true,
        });
        if (res?.count) {
          this.count = res.count;
        } else {
          this.count = 0
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address);
    },
    formatTxHash(hash) {
      return Tools.formatTxHash(hash);
    }
  }
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.denom_list_container {
  @media screen and (min-width: 910px) {
    .denom_list_content_wrap {
      max-width: 12rem;
      .denom_list_header_content {
        display: flex;
        align-items: center;
        ::v-deep .el-input {
          max-width: 3.5rem;
          margin-left: 0.1rem;
          .el-input__inner {
            padding-left: 0.07rem;
            height: 0.32rem;
            font-size: $s14 !important;
            line-height: 0.32rem;
          }
        }
        .tx_type_mobile_content {
          align-items: center;
        }
      }
    }
  }
  @media screen and (max-width: 910px) {
    .denom_list_content_wrap {
      width: 100%;
      padding: 0 0.15rem;
      box-sizing: border-box;
      .denom_list_header_content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .denom_list_header_title {
          margin-bottom: 0.1rem;
        }
        ::v-deep .el-input {
          margin-bottom: 0.1rem;
          .el-input__inner {
            padding-left: 0.07rem;
            height: 0.32rem;
            font-size: $s14 !important;
            line-height: 0.32rem;
          }
        }
        .tx_type_mobile_content {
          justify-content: flex-end;
          margin-bottom: 0.1rem;
        }
      }
    }
  }
  .denom_list_content_wrap {
    margin: 0 auto;
    padding: 0 0.15rem;
    .denom_list_header_content {
      width: 100%;
      margin: 0.4rem 0 0.1rem 0;
      .denom_list_header_title {
        font-size: $s22;
        color: $t_first_c;
        line-height: 0.21rem;
        text-align: left;
      }
      .nft_denom_content {
        margin-top: 0.1rem;
        width: 100%;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: $s14;
        color: $t_second_c;
        text-align: left;
        background: $bg_white_c;
        text-indent: 0.2rem;
      }
      ::v-deep .el-input {
        .el-input__inner {
          font-size: $s14 !important;
          &::-webkit-input-placeholder {
            font-size: $s14 !important;
          }
        }
      }
      .tx_type_mobile_content {
        display: flex;
        .joint_mark {
          margin: 0 0.08rem;
        }
        .reset_btn {
          background: $bg_button_c;
          color: $t_button_c;
          border-radius: 0.04rem;
          margin-left: 0.1rem;
          cursor: pointer;
          i {
            padding: 0.08rem;
            font-size: $s14;
            line-height: 1;
            display: inline-block;
          }
        }
        .search_btn {
          cursor: pointer;
          background: $bg_button_c;
          margin-left: 0.1rem;
          color: $t_button_c;
          border-radius: 0.04rem;
          padding: 0.05rem 0.18rem;
          font-size: $s14;
          line-height: 0.2rem;
          white-space: nowrap;
        }
      }
    }
    .nef_list_table_container {
      //margin-top: 0.05rem;
      ::v-deep .cell {
        padding: 0rem 0rem 0rem 0.15rem;
      }
      a {
        cursor: pointer;
      }
    }
    .pagination_content {
      display: flex;
      justify-content: flex-end;
      margin: 0.1rem 0 0.2rem 0;
    }
  }
}
</style>
