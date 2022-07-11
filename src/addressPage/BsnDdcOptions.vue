<template>
  <div>
    <div class="content_title">
      {{ $t('ExplorerLang.ddc.mainTitle') }}
    </div>
    <list-component
      :empty-text="$t('ExplorerLang.table.emptyDescription')"
      :list-data="ddcList"
      :column-list="ddcListColumn"
      :pagination="{
        pageSize: Number(ddcPageSize),
        dataCount: ddcCount,
        pageNum: Number(ddcPageNum),
      }"
      @pageChange="ddcPageChange"
    />
  </div>
</template>

<script>
import ListComponent from '@/components/common/ListComponent';
import ddcListColumnConfig from '@/components/tableListColumnConfig/ddcListColumnConfig';
import { getDdcList } from '@/service/api';
import Tools from '@/util/Tools';

export default {
  name: 'BsnDdcOptions',
  components: { ListComponent },
  data() {
    return {
      ddcList: [],
      ddcListColumn: [],
      ddcPageSize: 5,
      ddcCount: 0,
      ddcPageNum: 1,
    };
  },
  mounted() {
    this.ddcListColumn = ddcListColumnConfig;
    this.getDdcListCount();
    this.getDdcList();
  },
  methods: {
    ddcPageChange(pageNum) {
      this.ddcPageNum = pageNum;
      this.getDdcList();
    },
    async getDdcList() {
      try {
        const ddcData = await getDdcList({
          owner: this.$route.params.param,
          ddc_id: '',
          contract_address: '',
          useCount: false,
          pageNum: this.ddcPageNum,
          pageSize: this.ddcPageSize,
        });
        if (ddcData && ddcData.data) {
          this.ddcList = ddcData.data.map((item) => {
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
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getDdcListCount() {
      try {
        const res = await getDdcList({
          owner: this.$route.params.param,
          ddc_id: '',
          contract_address: '',
          useCount: true,
        });
        if (res?.count) {
          this.ddcCount = res.count;
        } else {
          this.ddcCount = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.address_transaction_content {
  // margin-top: 0.48rem;
  margin-bottom: 0.2rem;
  background: $bg_white_c;
  //padding: 0.25rem;
  border-radius: 0.05rem;
  // border: 0.01rem solid $bd_first_c;
  .content_title {
    padding-top: 0.25rem;
    padding-left: 0.25rem;
    color: #171d44;
    margin-bottom: 0.4rem;
    text-align: left;
    font-size: 0.16rem;
    font-family: PublicSans;
    font-weight: 600;
    line-height: 22px;
  }

  .list_table_content_container .box-card {
    padding-left: 0.25rem;
    padding-top: 0;
  }

  .address_transaction_content_hash {
    display: flex;
    align-items: center;
  }

  .address_transaction_condition_container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.4rem;
    align-items: center;

    .address_transaction_condition_count {
      font-size: $s14;
      margin-right: 0.42rem;
      font-weight: 600;
    }

    ::v-deep.el-cascader {
      width: 1.3rem;
      margin-right: 0.1rem;

      .el-input {
        input::-webkit-input-placeholder {
          /* 使用webkit内核的浏览器 */
          color: $t_first_c;
        }

        input:-moz-placeholder {
          /* Firefox版本4-18 */
          color: $t_first_c;
        }

        input::-moz-placeholder {
          /* Firefox版本19+ */
          color: $t_first_c;
        }

        input:-ms-input-placeholder {
          /* IE浏览器 */
          color: $t_first_c;
        }

        .el-input__inner {
          padding-left: 0.07rem;
          height: 0.32rem;
          font-size: $s14 !important;
          line-height: 0.32rem;

          &::-webkit-input-placeholder {
            font-size: $s14 !important;
          }
        }

        .el-input__inner:focus {
          border-color: $theme_c !important;
        }

        .el-input__suffix {
          .el-input__suffix-inner {
            .el-input__icon {
              line-height: 0.32rem;
            }
          }
        }
      }

      .is-focus {
        .el-input__inner {
          border-color: $theme_c !important;
        }
      }
    }

    ::v-deep .el-select {
      width: 1.3rem;
      margin-right: 0.22rem;

      .el-input {
        .el-input__inner {
          padding-left: 0.07rem;
          height: 0.32rem;
          font-size: $s14 !important;
          line-height: 0.32rem;

          &::-webkit-input-placeholder {
            font-size: $s14 !important;
          }
        }

        .el-input__inner:focus {
          border-color: $theme_c !important;
        }

        .el-input__suffix {
          .el-input__suffix-inner {
            .el-input__icon {
              line-height: 0.32rem;
            }
          }
        }
      }

      .is-focus {
        .el-input__inner {
          border-color: $theme_c !important;
        }
      }
    }

    .search_btn {
      cursor: pointer;
      background: $bg_button_c;
      color: $t_button_c;
      border-radius: 0.04rem;
      padding: 0.05rem 0.18rem;
      font-size: $s14;
      line-height: 0.2rem;
      white-space: nowrap;
    }

    .address_transaction_condition_action {
      display: flex;

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
    }
  }
}
</style>
