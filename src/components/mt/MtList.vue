<template>
  <div class="mt_list_container">
    <div class="mt_list_content_wrap">
      <div class="mt_list_header_content">
        <h3 class="mt_list_header_title">{{ $t('ExplorerLang.mtList.mainTitle') }}</h3>
      </div>
      <links-tab-copmonent :propos-links="tabLinks"></links-tab-copmonent>
      <div class="nef_list_table_container">
        <list-component
          :is-loading="isMtListLoading"
          :list-data="mtListData"
          :column-list="mtListColumn"
          :pagination="{
            pageSize: Number(pageSize),
            dataCount: mtCount,
            pageNum: Number(pageNum),
          }"
          @pageChange="pageChange"
        >

          <template v-slot:txCount>
            <tx-count-component
              :title="
                mtCount > 1
                  ? $t('ExplorerLang.mtList.subTitles')
                  : $t('ExplorerLang.mtList.subTitle')
              "
              :icon="'iconNFT'"
              :tx-count="mtCount"
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
              :input-placeholder="$t('ExplorerLang.mtList.placeHolder')"
              @searchInput="handleSearchClick"
              ref="searchMtByInput"
            ></nft-search-component>
          </template>
          <template v-slot:datePicket>
            <nft-search-component
              :input-placeholder="$t('ExplorerLang.mtList.placeHolder')"
              @searchInput="handleSearchClick"
              ref="searchMt"
              class="mt_input_container"
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
import mtListColumn from './mtColumnConfig/mtListColumn';
import { getMts, getMtCount } from '../../service/api';
import Tools from '../../util/Tools';
import LinksTabCopmonent from "../common/LinksTabCopmonent";

export default {
  name: 'MtList',
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
      isMtListLoading: false,
      mtListData: [],
      mtListColumn,
      pageSize: 15,
      pageNum: 1,
      mtCount: 0,
      input: '',
      tabLinks: [
        {
          label: this.$t('ExplorerLang.mtList.mtList'),
          href: '/mts',
          isActive: true
        },
        {
          label: this.$t('ExplorerLang.mtList.mtDenomList'),
          href: '/mt/denoms',
          isActive: false
        },
      ]
    };
  },
  created() {
    if (this?.$route?.query?.denomId) {
      this.input = this.$route.query.denomId;
    }
    this.getMtCount();
    this.getMts();
  },
  mounted() {},
  methods: {
    async getMtCount() {
      const mtCount = await getMtCount(this.input).catch((error) => {
        console.error(error);
      });
      this.mtCount = mtCount?.count ?? 0;
    },
    async getMts() {
      this.isMtListLoading = true;
      const mtListData = await getMts(this.input, this.pageNum, this.pageSize).catch((error) => {
        console.error(error);
      });
      this.isMtListLoading = false;
      if (mtListData?.data?.length > 0) {
        this.mtListData = mtListData?.data?.map((item) => {
          return {
            denomId: item?.denom_id || '',
            denomName: item?.denom_name || '',
            mtID: item?.mt_id || '--',
            mtNumber: item?.amount ?? '',
            publisher: item?.creator || '',
            ownerCount: item?.owner_count ?? '',
            time: item?.latest_tx_time ? Tools.formatLocalTime(item.latest_tx_time) : '--',
          };
        });
      }
    },
    pageChange(currentPageNumber) {
      this.pageNum = currentPageNumber;
      this.getMts();
    },
    resetFilterCondition() {
      this.input = '';
      this.pageNum = 1;
      this.getMts();
      this.getMtCount();
      this.$refs.searchMtByInput.resetFilterCondition();
      this.$refs.searchMt.resetFilterCondition();
    },
    refreshCondition() {
      this.getMts();
      this.getMtCount();
    },
    handleSearchClick(iptValue) {
      if (!iptValue) return;
      this.input = iptValue;
      this.pageNum = 1;
      this.getMts();
      this.getMtCount();
    },
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

.mt_input_container {
  display: none !important;
  @media (max-width: 860px) {
    display: flex !important;
    justify-content: flex-start !important;
  }
}

.mt_list_container {
  @media screen and (min-width: 910px) {
    .mt_list_content_wrap {
      max-width: 12rem;

      .mt_list_header_content {
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
    .mt_list_content_wrap {
      width: 100%;
      padding: 0 0.15rem;
      box-sizing: border-box;

      .mt_list_header_content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .mt_list_header_title {
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

  .mt_list_content_wrap {
    margin: 0 auto;
    padding: 0 0.15rem;

    .mt_list_header_content {
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

      .mt_list_header_title {
        font-size: $s22;
        color: $t_first_c;
        line-height: 0.21rem;
        text-align: left;
        //text-indent: 0.2rem;
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
