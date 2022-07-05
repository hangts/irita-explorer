<template>
  <div class="nft_list_container">
    <div class="nft_list_content_wrap">
      <div class="nft_list_header_content">
        <h3 class="nft_list_header_title">{{$t('ExplorerLang.nftAsset.mainTitle')}}</h3>
<!--        <el-input v-model="input" @change="handleSearchClick" :placeholder="$t('ExplorerLang.nftAsset.placeHolder')"></el-input>
        <div class="tx_type_mobile_content">
          <div class="search_btn" @click="handleSearchClick">{{$t('ExplorerLang.nftAsset.search')}}</div>
          <div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
        </div>-->
      </div>
      <div class="nef_list_table_container">
		  <list-component
		  	:is-loading="isNftListLoading"
			:list-data="denomArray"
			:column-list="nftListColumn"
			:pagination="{pageSize:Number(pageSize),dataCount:allCount,pageNum:Number(currentPageNum)}"
			@pageChange="pageChange"
		  >
			  <template v-slot:txCount>
				  <tx-count-component :title="allCount > 1 && isShowPlurality ? $t('ExplorerLang.nftAsset.subTitles') : $t('ExplorerLang.nftAsset.subTitle')" :icon="'iconNFT'" :tx-count="allCount"></tx-count-component>
			  </template>
			  <template v-slot:resetButton>
				  <nft-reset-button-component @resetFilterCondition="resetFilterCondition"></nft-reset-button-component>
			  </template>
			  <template v-slot:datePicket>
				  <nft-search-component
					  :input-placeholder="$t('ExplorerLang.nftAsset.placeHolder')"
					  @searchInput="handleSearchClick" ref="searchNft"></nft-search-component>
			  </template>
		  </list-component>
<!--        <el-table class="table table_overflow_x" :data="denomArray" :empty-text="$t('ExplorerLang.table.emptyDescription')" :default-sort="{ prop: 'Time', order: 'descending' }">
          <el-table-column :min-width="ColumnMinWidth.tokenId" :label="$t('ExplorerLang.table.tokenId')">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.nft_id" placement="top" effect="dark" :disabled="Tools.disabled(scope.row.nft_id)">
                <router-link v-if="formatAddress(scope.row.nft_id) !== '&#45;&#45;'" :to="`/nft/token?denom=${scope.row.denom_id}&&tokenId=${scope.row.nft_id}`">{{formatAddress(scope.row.nft_id)}}</router-link>
                <span v-else>{{formatAddress(scope.row.nft_id)}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :min-width="ColumnMinWidth.tokenId" :label="$t('ExplorerLang.table.tokenName')">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.nft_name" placement="top" effect="dark" :disabled="Tools.disabled(scope.row.nft_name)">
                <router-link v-if="formatAddress(scope.row.nft_name) !== '&#45;&#45;'" :to="`/nft/token?denom=${scope.row.denom_id}&&tokenId=${scope.row.nft_id}`">{{formatAddress(scope.row.nft_name)}}</router-link>
                <span v-else>{{formatAddress(scope.row.nft_name)}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :min-width="ColumnMinWidth.nftListDenom" :label="$t('ExplorerLang.table.denom')">
            <template slot-scope="scope">
              {{scope.row.denom_name || scope.row.denom_id}}
            </template>
          </el-table-column>
          <el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.owner')">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.owner" placement="top" effect="dark" :disabled="Tools.disabled(scope.row.owner)">
                <span v-if="!scope.row.owner">{{formatAddress(scope.row.owner)}}</span>
                <router-link v-else :to="`/address/${scope.row.owner}`">{{formatAddress(scope.row.owner)}}</router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          &lt;!&ndash; <el-table-column :min-width="ColumnMinWidth.nftListDate" :label="$t('ExplorerLang.table.data')" prop="tokenData">
						<template slot-scope="scope">
							<LargeString :key="scope.row.tokenData" v-if="scope.row.tokenData" :text="scope.row.tokenData"  mode="cell" textWidth="300px" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
							<span v-else>&#45;&#45;</span>
						</template>
					</el-table-column> &ndash;&gt;
          <el-table-column :min-width="ColumnMinWidth.URI" :label="$t('ExplorerLang.table.uri')" prop="tokenUri">
            <template slot-scope="scope">
              <div v-if="scope.row.tokenUri">
                <a v-if="Tools.testUrl(scope.row.tokenUri)" :href="scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
                <a v-else-if="startStr(scope.row.tokenUri)" :href="'http://' + scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
                <span v-else>{{scope.row.tokenUri}}</span>
              </div>
              <span v-else>&#45;&#45;</span>
            </template>
          </el-table-column>
          <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="last_block_time">
            <template slot-scope="scope">
              <span>{{scope.row.last_block_time}}</span>
            </template>
          </el-table-column>
        </el-table>-->
      </div>
<!--      <div class="pagination_content">
        <keep-alive>
          <m-pagination :page-size="pageSize" :total="allCount" :page="currentPageNum" :page-change="pageChange">
          </m-pagination>
        </keep-alive>
      </div>-->
    </div>
  </div>
</template>

<script>
import { getNfts } from '../service/api'
import Tools from '../util/Tools'
import MPagination from './common/MPagination'
import { ColumnMinWidth } from '../constant'
import LargeString from './common/LargeString'
import productionConfig from '@/productionConfig.js'
import parseTimeMixin from '../mixins/parseTime'
import ListComponent from "./common/ListComponent";
import nftListColumn from "./tableListColumnConfig/nftListColumn";
import TxCountComponent from "./TxCountComponent";
import NftSearchComponent from "./common/NftSearchComponent";
import NftResetButtonComponent from "./common/NftResetButtonComponent";
export default {
  name: 'NftList',
  components: {NftResetButtonComponent, NftSearchComponent, TxCountComponent, ListComponent, MPagination, LargeString },
  mixins: [parseTimeMixin],
  data() {
    let denom = ''
    if (this.$store.state.tempDenomId) {
      denom = this.$store.state.tempDenomId
    }
    return {
		isNftListLoading:false,
		nftListColumn: [],
      ColumnMinWidth,
      denomArray: [],
      denom,
      currentPageNum: 1,
      pageSize: 10,
      tokenId: '',
      owner: '',
      input: '',
      allCount: 0,
      LargeStringMinHeight: 69,
      LargeStringLineHeight: 23,
      Tools,
    }
  },
  mounted() {
  	if(this?.$route?.query?.denomId){
	  this.denom = this.$route.query.denomId
  	}
  	this.nftListColumn = nftListColumn
    this.getNftsByFilterCount()
    this.getNftsByFilter()
    if (this.$store.state.tempDenomId) {
      this.$store.commit('SET_TEMP_DENOM_ID', '')
    }
  },
  computed: {
    isShowPlurality() {
      return productionConfig.lang === 'EN'
    },
  },
  methods: {
    startStr(url) {
      return url.startsWith('www.')
    },
    tableRowKey(row) {
      return `${row.denom_id}-${row.nft_id}`
    },
    resetFilterCondition() {
      this.input = ''
      this.denom = ''
      this.currentPageNum = 1
      this.tokenId = ''
      this.owner = ''
		this.$refs.searchNft.resetFilterCondition()
      this.getNftsByFilterCount()
      this.getNftsByFilter()
	    this.$router.push('/nftAsset')
    },
    pageChange(pageNum) {
      this.currentPageNum = pageNum
      // if(sessionStorage.getItem('selectDenom')){
      // 	this.denom = sessionStorage.getItem('selectDenom')
      // }
      this.getNftsByFilter()
    },
    handleSearchClick(input) {
		this.input = input
      this.currentPageNum = 1
      this.getNftsByFilterCount()
      this.getNftsByFilter()
    },
    async getNftsByFilter() {
      if (Tools.isBech32(this.input)) {
        this.owner = this.input
      }
      if (!this.owner) {
        this.tokenId = this.input
      }
		this.isNftListLoading = true
      try {
        let nftData = await getNfts(
          this.currentPageNum,
          this.pageSize,
          false,
          this.denom,
          this.tokenId,
          this.owner
        )
        if (nftData?.data.length > 0) {
          nftData.data.forEach((item) => {
            item.Time = item.last_block_time ? item.last_block_time : ''
            /*item.last_block_time = item.last_block_time
              ? Tools.formatAge(
                  Tools.getTimestamp(),
                  item.last_block_time * 1000,
                  this.$t('ExplorerLang.table.suffix')
                )
              : '--'
          })*/
			  item.last_block_time = item.last_block_time
				  ? Tools.formatLocalTime(item.last_block_time )
				  : '--'
			  item.tokenUri = item.tokenUri ? item.tokenUri : '--'
		  })
          this.denomArray = nftData.data
          /**
           * @description: from parseTimeMixin
           */
          // this.parseTime('denomArray', 'Time', 'last_block_time')
        } else {
          this.denomArray = []
        }
		  this.isNftListLoading = false
      } catch (e) {
		  this.isNftListLoading = false
        console.error(e)
      }
    },
    async getNftsByFilterCount() {
      if (Tools.isBech32(this.input)) {
        this.owner = this.input
      }
      if (!this.owner) {
        this.tokenId = this.input
      }
      try {
        let res = await getNfts(
          null,
          null,
          true,
          this.denom,
          this.tokenId,
          this.owner
        )
        if (res?.count) {
          this.allCount = res.count
        } else {
          this.allCount = 0
        }
      } catch (e) {
        console.error(e)
      }
    },
    formatAddress(address) {
      if (!address) {
        return '--'
      }
      return Tools.formatValidatorAddress(address)
    },
  },
}
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.nft_list_container {
  @media screen and (min-width: 910px) {
    .nft_list_content_wrap {
      max-width: 12rem;
      .nft_list_header_content {
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
    .nft_list_content_wrap {
      width: 100%;
      padding: 0 0.15rem;
      box-sizing: border-box;
      .nft_list_header_content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .nft_list_header_title {
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
  .nft_list_content_wrap {
    margin: 0 auto;
    padding: 0 0.15rem;
    .nft_list_header_content {
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
      .nft_list_header_title {
        font-size: $s22;
        color: $t_first_c;
        line-height: 0.21rem;
        text-align: left;
        //text-indent: 0.2rem;
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
    /*.nft_denom_content{
				width: 100%;
				.nft_denom_list_item{
					width: 100%;
					text-align: left;
					background: $bg_white_c;
					text-indent: 0.2rem;
					margin-top: 0.1rem;
					padding: 0.2rem 0;
					.nft_denom_title{
						display: flex;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;
						padding-right: 0.2rem;
						.select_content{
							padding-top: 0.1rem;
							transform: rotate(-90deg);
							i{
								padding-right: 0.08rem;
							}
						}
						.show_bottom_select{
							transform: rotate(0deg);
						}
					}
				}
				.nft_denom_list_content{
					box-sizing: border-box;
					padding: 0.2rem;
					margin-top: 0.4rem;
					::v-deep .el-table th {
						background: $bg_cancel_c !important;
					}
					::v-deep .el-table tr {
						background: $bg_cancel_c !important;
					}
				}
				.hidden_footer_padding{
					padding-bottom: 0;
				}
			}*/
  }
}
</style>
