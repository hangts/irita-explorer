<template>
  <div class="mt_denom_list_container">
    <div class="mt_denom_list_content_wrap">
      <div class="mt_denom_list_header_content">
        <h3 class="mt_denom_list_header_title">{{ $t('ExplorerLang.mtDenomList.mainTitle') }}</h3>
      </div>
      <links-tab-copmonent :propos-links="tabLinks"></links-tab-copmonent>
      <div class="nef_list_table_container">
        <list-component
          :is-loading="isMtDenomListLoading"
          :list-data="mtDenomListData"
          :column-list="mtDenomListColumn"
          :pagination="{
            pageSize: Number(pageSize),
            dataCount: mtDenomCount,
            pageNum: Number(pageNum),
          }"
          @pageChange="pageChange"
        >
          <template v-slot:txCount>
            <tx-count-component
              :title="
                mtDenomCount > 1
                  ? $t('ExplorerLang.mtDenomList.subTitles')
                  : $t('ExplorerLang.mtDenomList.subTitle')
              "
              :icon="'iconNFT'"
              :tx-count="mtDenomCount"
            ></tx-count-component>
          </template>
          <template v-slot:resetButton>
            <nft-reset-button-component
              @resetFilterCondition="resetFilterCondition"
            ></nft-reset-button-component>
          </template>
          <template v-slot:refreshButton>
            <tx-refresh-button-component
              @refreshParams="refreshCondition"
            ></tx-refresh-button-component>
          </template>
          <template v-slot:countFilterByInput>
            <nft-search-component
              :input-placeholder="$t('ExplorerLang.mtDenomList.placeHolder')"
              @searchInput="handleSearchClick"
              ref="searchMtDenomByInput"
            ></nft-search-component>
          </template>
          <template v-slot:datePicket>
            <nft-search-component
              :input-placeholder="$t('ExplorerLang.mtDenomList.placeHolder')"
              @searchInput="handleSearchClick"
              ref="searchMt"
              class="mt_denom_input_container"
            ></nft-search-component>
          </template>
        </list-component>
      </div>
    </div>
  </div>
</template>

<script>
import ListComponent from '../common/ListComponent';
import TxCountComponent from '../TxCountComponent';
import NftSearchComponent from '../common/NftSearchComponent';
import NftResetButtonComponent from '../common/NftResetButtonComponent';
import TxRefreshButtonComponent from '../common/TxRefreshButtonComponent';
import mtDenomListColumn from './mtColumnConfig/mtDenomListColumn';
import { getMtDenoms, getMtDenomCount } from '../../service/api';
import Tools from '../../util/Tools';
import LinksTabCopmonent from '../common/LinksTabCopmonent';

export default {
  name: 'MtDenomList',
  components: {
    LinksTabCopmonent,
    TxRefreshButtonComponent,
    NftResetButtonComponent,
    NftSearchComponent,
    TxCountComponent,
    ListComponent,
  },
  data() {
    return {
      isMtDenomListLoading: false,
      mtDenomListData: [],
      mtDenomListColumn,
      pageSize: 15,
      pageNum: 1,
      mtDenomCount: 0,
      input: '',
      tabLinks: [
        {
          label: this.$t('ExplorerLang.mtList.mtList'),
          href: '/mts',
          isActive: false,
        },
        {
          label: this.$t('ExplorerLang.mtList.mtDenomList'),
          href: '/mt/denoms',
          isActive: true,
        },
      ],
    };
  },
  created() {
    this.getMtDenomListDataCount();
    this.getMtDenomsListData();
  },
  mounted() {},
  methods: {
    async getMtDenomListDataCount() {
      const mtDenomCount = await getMtDenomCount(this.input).catch((error) => {
        console.error(error);
      });
      this.mtDenomCount = mtDenomCount?.count ?? 0;
    },
    async getMtDenomsListData() {
      this.isMtDenomListLoading = true;
      const mtDenomListData = await getMtDenoms(this.input, this.pageNum, this.pageSize).catch(
        (error) => {
          console.error(error);
        }
      );
      this.isMtDenomListLoading = false;
      if (mtDenomListData?.data?.length > 0) {
        this.mtDenomListData = mtDenomListData.data.map((item) => {
          return {
            denomId: item?.denom_id || '',
            denomName: item?.denom_name || '',
            txHash: item?.issue_tx_hash || '',
            mtNumber: item?.amount ?? '',
            creator: item?.creator || '',
            owner: item?.owner || '',
            time: item?.latest_tx_time ? Tools.formatLocalTime(item.latest_tx_time) : '--',
          };
        });
      }
    },
    pageChange(currentPageNumber) {
      this.pageNum = currentPageNumber;
      this.getMtDenomsListData();
    },
    resetFilterCondition() {
      this.input = '';
      this.pageNum = 1;
      this.$refs.searchMtDenomByInput.resetFilterCondition();
      this.getMtDenomsListData();
      this.getMtDenomListDataCount();
    },
    refreshCondition() {
      this.getMtDenomsListData();
      this.getMtDenomListDataCount();
    },
    handleSearchClick(iptValue) {
      if (!iptValue) return;
      this.input = iptValue;
      this.pageNum = 1;
      this.getMtDenomsListData();
      this.getMtDenomListDataCount();
    },
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

.mt_denom_input_container {
  display: none;
}

.mt_denom_list_container {
  @media screen and (min-width: 910px) {
    .mt_denom_list_content_wrap {
      max-width: 12rem;

      .mt_denom_list_header_content {
        display: flex;
        align-items: center;

        .el-select {
          ::v-deep .el-input {
            width: 1.8rem;

            .el-input__inner {
              padding-left: 0.07rem;
              height: 0.32rem;
              line-height: 0.32rem;
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
        }

        ::v-deep .el-input {
          max-width: 3.5rem;
          margin-left: 0.1rem;

          .el-input__inner {
            padding-left: 0.07rem;
            height: 0.32rem;
            font-size: $s14 !important;
            line-height: 0.32rem;
          }

          .el-input__inner:focus {
            border-color: $theme_c !important;
          }
        }

        .tx_type_mobile_content {
          align-items: center;
        }
      }
    }
  }
  @media screen and (max-width: 910px) {
    .mt_denom_list_content_wrap {
      width: 100%;
      padding: 0 0.15rem;
      box-sizing: border-box;

      .mt_denom_list_header_content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .mt_denom_list_header_title {
          margin-bottom: 0.1rem;
        }

        .el-select {
          margin-bottom: 0.1rem;

          ::v-deep .el-input {
            //width: 1.8rem;
            .el-input__inner {
              padding-left: 0.07rem;
              height: 0.32rem;
              line-height: 0.32rem;
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
        }

        ::v-deep .el-input {
          margin-bottom: 0.1rem;

          .el-input__inner {
            padding-left: 0.07rem;
            height: 0.32rem;
            font-size: $s14 !important;
            line-height: 0.32rem;
          }

          .el-input__inner:focus {
            border-color: $theme_c !important;
          }
        }

        .tx_type_mobile_content {
          justify-content: flex-end;
          margin-bottom: 0.1rem;
        }
      }
    }
  }

  .mt_denom_list_content_wrap {
    margin: 0 auto;
    padding: 0 0.15rem;

    .mt_denom_list_header_content {
      width: 100%;
      margin: 0.4rem 0 0.1rem 0;

      .el-select {
        ::v-deep .el-input {
          .el-input__inner {
            font-size: $s14 !important;

            &::-webkit-input-placeholder {
              font-size: $s14 !important;
            }
          }

          .el-input__inner:focus {
            border-color: $theme_c !important;
          }
        }
      }

      ::v-deep .el-input {
        .el-input__inner {
          font-size: $s14 !important;

          &::-webkit-input-placeholder {
            font-size: $s14 !important;
          }
        }
      }

      .mt_denom_list_header_title {
        font-size: $s22;
        color: $t_first_c;
        line-height: 0.21rem;
        text-align: left;
        //text-indent: 0.2rem;
      }

      .mt_denom_content {
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

      .tx_type_mobile_content {
        display: flex;

        ::v-deep.el-select {
          width: 1.3rem;
          margin-right: 0.1rem;

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

        ::v-deep.el-date-editor {
          width: 1.3rem;

          .el-icon-circle-close {
            display: none !important;
          }

          .el-input__inner {
            height: 0.32rem;
            padding-left: 0.07rem;
            padding-right: 0;
            line-height: 0.32rem;

            &::-webkit-input-placeholder {
              font-size: $s14 !important;
            }

            &:focus {
              border-color: $theme_c;
            }
          }

          .el-input__prefix {
            right: 5px;
            left: 1rem;

            .el-input__icon {
              line-height: 0.32rem;
            }
          }
        }

        .joint_mark {
          margin: 0 0.08rem;
        }

        .reset_btn {
          background: $theme_c;
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
          background: $theme_c;
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
        // padding: 0rem 0.05rem;
        padding: 0rem 0rem 0rem 0.15rem;
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
