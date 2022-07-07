<template>
  <div class="denom_list_container">
    <div class="denom_list_content_wrap">
      <div class="denom_list_header_content">
        <h3 class="denom_list_header_title">
          {{ $t("ExplorerLang.denom.mainTitle") }}
        </h3>
        <!--<el-input v-model="input" @change="handleSearchClick" :placeholder="$t('ExplorerLang.denom.placeHolder')"></el-input>-->
        <!--<div class="tx_type_mobile_content">
          <div class="search_btn" @click="handleSearchClick">
            {{ $t("ExplorerLang.denom.search") }}
          </div>
          <div class="reset_btn" @click="reset">
            <i class="iconfont iconzhongzhi"></i>
          </div>
        </div>-->
      </div>
      <div class="nef_list_table_container">
        <list-component
			:empty-text="$t('ExplorerLang.table.emptyDescription')"
            :is-loading="isDenomListLoading"
            :list-data="denomList"
            :column-list="denomListColumn"
            :pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
            @pageChange="pageChange"
        >
          <template v-slot:txCount>
            <tx-count-component :title="count > 1 && isShowPlurality ? $t('ExplorerLang.denom.subTitles') : $t('ExplorerLang.denom.subTitle')" :icon="'iconDenom'" :tx-count="count"></tx-count-component>
          </template>
			<template v-slot:resetButton>
				<nft-reset-button-component @resetFilterCondition="resetFilterCondition"></nft-reset-button-component>
			</template>
          <template v-slot:datePicket>
              <nft-search-component
                  :input-placeholder="$t('ExplorerLang.denom.placeHolder')"
                  @searchInput="handleSearchClick" ref="denomSearchNode"></nft-search-component>
          </template>
        </list-component>
       <!-- <el-table class="table table_overflow_x" :data="denomList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
          <el-table-column :min-width="ColumnMinWidth.denom" :label="$t('ExplorerLang.table.denom')">
            <template slot-scope="scope">
              {{ scope.row.denomName }}
            </template>
          </el-table-column>
          <el-table-column :min-width="ColumnMinWidth.denomId" :label="$t('ExplorerLang.table.denomId')">
            <template slot-scope="scope">
              {{ scope.row.denomId }}
            </template>
          </el-table-column>
          <el-table-column class-name="hash_status" :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.createHash')">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.hash !== ''" :content="scope.row.hash" class="item" placement="top" effect="dark">
                <router-link :to="`/tx?txHash=${scope.row.hash}`">
                  {{ formatTxHash(scope.row.hash) }}
                </router-link>
              </el-tooltip>l
              <span v-if="scope.row.hash === ''">...</span>
            </template>
          </el-table-column>
          <el-table-column :min-width="ColumnMinWidth.nftCount" :label="$t('ExplorerLang.table.nftCount')">
            <template slot-scope="scope">
              <a @click="handleNftCountClick(scope.row.denomId)">
                {{ scope.row.nftCount }}
              </a>
            </template>
          </el-table-column>
          <el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.creator')">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.sender" class="item" placement="top" effect="dark">
                <router-link :to="`/address/${scope.row.sender}`">
                  {{ formatAddress(scope.row.sender) }}
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time"></el-table-column>
        </el-table>
      </div>
      <div class="pagination_content">
        <keep-alive>
          <m-pagination :page-size="pageSize" :total="count" :page="pageNum" :page-change="pageChange">
          </m-pagination>
        </keep-alive>-->



      </div>
    </div>
  </div>
</template>

<script>
import { getDenoms } from "../service/api";
import Tools from "../util/Tools";
import MPagination from "./common/MPagination";
import { ColumnMinWidth } from "../constant";
import productionConfig from "@/productionConfig.js";
import parseTimeMixin from "../mixins/parseTime";
import ListComponent from "./common/ListComponent";//新增
import denomListColumnConfig from "./tableListColumnConfig/denomListColumnConfig";
import TxCountComponent from "./TxCountComponent";
import NftSearchComponent from "./common/NftSearchComponent";
import NftResetButtonComponent from "./common/NftResetButtonComponent";
export default {
  name: "DenomList",
  components: {NftResetButtonComponent, NftSearchComponent, MPagination,ListComponent,TxCountComponent },//新增
  mixins: [parseTimeMixin],
  data() {
    return {
      isDenomListLoading:false,//新增
      denomListColumn:[],//新增的
      ColumnMinWidth,
      denomList: [],
      value: "all",
      denom: "",
      pageNum: 1,
      pageSize: 10,
      input: "",
      count: 0
    };
  },
  mounted() {
    this.denomListColumn = denomListColumnConfig
    this.getDenoms();
    this.getDenomsCount();
  },
  computed: {
    isShowPlurality() {
      return productionConfig.lang === "EN";
    }
  },
  methods: {
    resetFilterCondition() {
      this.input = "";
      this.pageNum = 1;
      this.getDenomsCount();
      this.getDenoms();
      this.$refs.denomSearchNode.resetFilterCondition()
    },
    handleNftCountClick(denomId) {
      this.$router.push(`/nftAsset?denomId=${denomId}`);
      this.$store.commit("SET_TEMP_DENOM_ID", denomId);
    },
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getDenoms();
    },
    handleSearchClick(input) {
      this.input = input
      this.pageNum = 1;
      this.getDenomsCount();
      this.getDenoms();
    },
    async getDenoms() {
        this.isDenomListLoading = true
      try {
        const res = await getDenoms(
          this.pageNum,
          this.pageSize,
          false,
          false,
          this.input
        );
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.denomList = res.data.map(denom => {
            return {
              denomId: denom.denomId,
              denomName: denom.denomName || denom.denomId,
              hash: denom.hash,
              sender: denom.sender,
              time: Tools.formatAge(
                Tools.getTimestamp(),
                denom.time * 1000,
                this.$t("ExplorerLang.table.suffix")
              ),
              Time: Tools.formatLocalTime(denom.time),
            };
          });
          /**
           * @description: from parseTimeMixin
           */
          this.parseTime("denomList", "Time", "time");
          this.pageSize = res.pageSize;
          this.pageNum = res.pageNum;
        } else {
            this.denomList = [];
        }
        this.isDenomListLoading = false//新增
      } catch (e) {
          this.isDenomListLoading = false//新增
        console.error(e);
      }
    },
    async getDenomsCount() {
      try {
        const res = await getDenoms(null, null, true, false, this.input);
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
