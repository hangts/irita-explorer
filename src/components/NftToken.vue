<template>
  <div class="nft_token_container">
    <div class="nft_token_content_wrap">
      <div class="nft_token_title">{{ $t('ExplorerLang.nftDetail.nftInformation') }}</div>
      <div class="nft_token_information_content">
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.owner') }}：</span>
          <span>
            <router-link :to="`/address/${owner}`">{{ owner }}</router-link>
          </span>
        </div>
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.denom') }}：</span>
          <span>{{ denomName || denomId }}</span>
        </div>
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.tokenName') }}：</span>
          <span>{{ nftName }}</span>
        </div>
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.tokenId') }}：</span>
          <span class="flex">
            <div>{{ tokenID }}</div>
            <el-tooltip
              v-if="isNewest"
              class="item"
              effect="dark"
              :content="$t('ExplorerLang.nftDetail.newest')"
              placement="top"
            >
              <div class="newIcon whitespace-nowrap">NEW</div>
            </el-tooltip>
          </span>
        </div>
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.schema') }}：</span>
          <LargeString
            :isShowPre="Tools.isJSON(schema)"
            v-if="schema"
            :text="schema"
            :minHeight="LargeStringMinHeight"
            :lineHeight="LargeStringLineHeight"
          />
        </div>
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.data') }}：</span>
          <LargeString
            :isShowPre="Tools.isJSON(tokenData)"
            v-if="tokenData"
            :text="tokenData"
            :minHeight="LargeStringMinHeight"
            :lineHeight="LargeStringLineHeight"
          />
        </div>
        <!-- <div class="nft_token_information_item">
					<span>{{ $t('ExplorerLang.nftDetail.creator') }}：</span>
					<span>
            <router-link :to="`/address/${creator}`">{{ creator }}</router-link>
          </span>
				</div> -->
        <div class="nft_token_information_item">
          <span>{{ $t('ExplorerLang.nftDetail.uri') }}：</span>
          <!-- <span v-if="tokenUri && tokenUri !== '--'">
								  <a :href="tokenUri" target="_blank">{{tokenUri}}</a>
							  </span>
							  <span v-else>--</span> -->

          <div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
            <a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{
              tokenUri
            }}</a>
            <a
              class="text"
              v-else-if="startStr(tokenUri)"
              :href="'http://' + tokenUri"
              target="_blank"
              >{{ tokenUri }}</a
            >
            <span class="text" v-else>{{ tokenUri }}</span>
          </div>
          <span v-else-if="tokenUri === '[do-not-modify]'">{{ tokenUri }}</span>
          <span v-else>--</span>
        </div>
      </div>
      <div class="nft_token_list_content">
        <div class="nft_token_list_title">{{ $t('ExplorerLang.nftDetail.nftTxs') }}</div>
        <!--				<TxListComponent :txData="txListByToken"></TxListComponent>-->
        <list-component
          :token-symbol="mainTokenSymbol"
          :list-data="txListByToken"
          :is-loading="isNftDetailTxLoading"
          :column-list="nftDetailColumn"
          :pagination="{ pageSize: Number(pageSize), dataCount: count, pageNum: Number(pageNum) }"
          @pageChange="pageChange"
        ></list-component>
        <!--				<div class="pagination_content">
					<m-pagination :page-size="pageSize" :total="count" :page="pageNum"
								  :page-change="pageChange"></m-pagination>
				</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import TxListComponent from './common/TxListComponent';
import { getNftDetail, getTokenTxList } from '../service/api';
import Tools from '../util/Tools';
import MPagination from './common/MPagination';
import { TX_TYPE, TX_STATUS, decimals } from '../constant';
import LargeString from './common/LargeString';
import ListComponent from './common/ListComponent';
import nftDetailTxColumn from './tableListColumnConfig/nftDetailTxColumn';
import { getTxType, getMainToken, converCoin } from '../helper/IritaHelper';

export default {
  name: 'NftToken',
  components: { ListComponent, MPagination, TxListComponent, LargeString },
  data() {
    return {
      nftDetailColumn: [],
      isNftDetailTxLoading: false,
      mainTokenSymbol: '',
      Tools,
      TX_TYPE,
      TX_STATUS,
      owner: '',
      Denom: '',
      TokenID: '',
      Uri: '',
      pageNum: 1,
      count: 0,
      pageSize: 10,
      txListByToken: [],
      creator: '',
      schema: '',
      name: '',
      tokenID: '',
      primaryKey: '',
      tokenData: '',
      tokenUri: '',
      denomName: '',
      nftName: '',
      denomId: '',
      LargeStringMinHeight: 95,
      LargeStringLineHeight: 19,
      feeDecimals: decimals.fee,
      TX_TYPE_DISPLAY: {},
      times: {
        lastBlockTime: null,
        newestTxTime: null,
      },
    };
  },
  async mounted() {
    this.nftDetailColumn = nftDetailTxColumn;
    this.setMainToken();
    await this.getTxTypeData();
    await this.getTokenInformation();
  },
  computed: {
    // 最新交易时间和 NFT 最近更新时间进行匹配，就是最新详情
    // 即详情里的lastBlockTime 和 列表的第一条数据时间判断
    isNewest() {
      if (!this.times.lastBlockTime || !this.times.newestTxTime) {
        return false;
      }
      return this.times.lastBlockTime === this.times.newestTxTime;
    },
  },
  methods: {
    async setMainToken() {
      const mainToken = await getMainToken();
      if (mainToken && mainToken.symbol) {
        this.mainTokenSymbol = mainToken.symbol.toUpperCase();
      }
    },
    async getTokenInformation() {
      try {
        const nftDetail = await getNftDetail(this.$route.query.denom, this.$route.query.tokenId);

        if (nftDetail) {
          this.creator = (nftDetail.denomDetail || {}).creator;
          this.schema = (nftDetail.denomDetail || {}).json_schema || '--';
          this.name = nftDetail.denom;
          this.tokenID = nftDetail.nft_id || '--';
          this.denomName = nftDetail.denom_name;
          this.denomId = nftDetail.denom_id;
          this.nftName = nftDetail.nft_name || '--';
          // this.primaryKey = nftDetail.primary_key;
          this.owner = nftDetail.owner;
          this.tokenData = nftDetail.tokenData || '--';
          this.tokenUri = nftDetail.tokenUri || '--';
          this.times.lastBlockTime = nftDetail?.last_block_time;
          this.getTokenTxCount();
          this.getTokenTx();
        }
      } catch (e) {
        console.error(e);
      }
    },
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getTokenTx();
    },
    async getTxTypeData() {
      try {
        const res = await getTxType();
        this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY;
      } catch (error) {
        console.log(error);
      }
    },
    async getTokenTx() {
      try {
        const res = await getTokenTxList(
          this.tokenID,
          this.$route.query.denom,
          this.pageNum,
          this.pageSize,
          false
        );
        if (res?.data.length > 0) {
          this.txListByToken = res.data.map((item) => {
            let mintNftArr = [];
            let burnNftArr = [];
            let editNftArr = [];
            let issueDenomArr = [];
            let transferNftArr = [];
            let allNftTxMsgArr = [];
            if (item?.msgs?.length) {
              allNftTxMsgArr = [];
              mintNftArr = item.msgs.filter((item) => {
                if (item.type === TX_TYPE.mint_nft) {
                  return item;
                }
              });
              burnNftArr = item.msgs.filter((item) => {
                if (item.type === TX_TYPE.burn_nft) {
                  return item;
                }
              });
              editNftArr = item.msgs.filter((item) => {
                if (item.type === TX_TYPE.edit_nft) {
                  return item;
                }
              });
              issueDenomArr = item.msgs.filter((item) => {
                if (item.type === TX_TYPE.issue_denom) {
                  return item;
                }
              });
              transferNftArr = item.msgs.filter((item) => {
                if (item.type === TX_TYPE.transfer_nft) {
                  return item;
                }
              });
              allNftTxMsgArr = mintNftArr.concat(
                burnNftArr,
                editNftArr,
                issueDenomArr,
                transferNftArr
              );
            }
            let sender = ' ';
            let denomId = ' ';
            let filterSenderArr = [];
            let filterDenomId = [];
            if (allNftTxMsgArr?.length === 1) {
              if (allNftTxMsgArr && allNftTxMsgArr[0]?.msg?.sender) {
                filterSenderArr = [allNftTxMsgArr[0].msg.sender];
              }
              if (allNftTxMsgArr && allNftTxMsgArr[0]?.msg?.denom) {
                filterDenomId = [allNftTxMsgArr[0].msg.denom];
              }
            } else if (allNftTxMsgArr?.length > 1) {
              const senderArr = allNftTxMsgArr.map((item) => {
                if (item?.msg?.sender) {
                  return item.msg.sender;
                }
              });
              const denomIdArr = allNftTxMsgArr.map((item) => {
                if (item?.msg?.denom) {
                  return item.msg.denom;
                }
              });
              filterSenderArr = Array.from(new Set(senderArr));
              filterDenomId = Array.from(new Set(denomIdArr));
            }
            if (filterSenderArr?.length === 1) {
              sender = filterSenderArr[0];
            }
            if (filterDenomId?.length === 1) {
              denomId = filterDenomId[0];
            }
            return {
              txHash: item.tx_hash,
              txType: (item.msgs || []).map((item) => item.type),
              blockHeight: item.height,
              fee: item?.fee?.amount[0]?.amount ? item?.fee.amount[0] : ' ',
              Time: Tools.formatLocalTime(item.time),
              status: item.status,
              sender,
              denomId,
            };
          });
          if (this.txListByToken?.length) {
            this.txListByToken.forEach(async (item) => {
              if (item?.fee) {
                const formatFee = await converCoin(item.fee);
                item.fee = formatFee?.amount
                  ? Tools.toDecimal(formatFee.amount, this.feeDecimals)
                  : '';
              }
            });
          }
          // 取第一条数据，为了比较是否是最新数据
          if (this.pageNum === 1) {
            this.times.newestTxTime = res.data[0].time;
          }
        } else {
          this.txListByToken = [];
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getTokenTxCount() {
      try {
        const res = await getTokenTxList(this.tokenID, this.$route.query.denom, null, null, true);
        if (res?.count) {
          this.count = res.count;
        } else {
          this.count = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address);
    },
    startStr(url) {
      return url.startsWith('www.');
    },
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

.newIcon {
  box-sizing: border-box;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  height: 20px;
  padding: 3px 8px;
  margin-left: 8px;
  color: #67c77e;
  font-weight: 600;
  background: rgba(103, 199, 126, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(103, 199, 126, 0.5);
}

.nft_token_container {
  padding: 0 0.15rem;

  .nft_token_content_wrap {
    max-width: 12rem;
    margin: 0 auto;

    .nft_token_title {
      font-size: $s18;
      color: $t_first_c;
      font-weight: bold;
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      text-indent: 0.2rem;
    }

    .nft_token_information_content {
      box-sizing: border-box;
      // border: 0.01rem solid $bd_second_c;
      border-radius: 0.04rem;
      background: $bg_white_c;
      padding: 0.2rem;

      .nft_token_information_item {
        text-align: left;
        margin-bottom: 0.16rem;
        display: flex;

        span:nth-of-type(1) {
          margin-right: 0.15rem;
          min-width: 1.27rem;
          font-size: $s14;
          color: $t_second_c;
          line-height: 0.16rem;
        }

        span:nth-of-type(2) {
          font-size: $s14;
          color: $t_first_c;
          flex: 1;
          word-break: break-all;
        }

        .wrap {
          .text {
            flex: 1;
            text-align: left;
            font-size: $s14;
            color: $t_first_c;
            word-break: break-all;
            line-height: 0.2rem;
            font-weight: normal;
          }
        }
      }

      .nft_token_information_item:last-child {
        margin-bottom: 0;
      }
    }

    .nft_token_list_content {
      .nft_token_list_title {
        font-size: $s18;
        color: $t_first_c;
        line-height: 0.21rem;
        font-weight: bold;
        text-align: left;
        text-indent: 0.2rem;
        margin: 0.3rem 0 0.1rem 0;
      }

      .pagination_content {
        display: flex;
        justify-content: flex-end;
        margin: 0.3rem 0 0.1rem 0;
      }

      .tx_transaction_content_hash {
        display: flex;
        align-items: center;
      }
    }

    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }
  }
}

@media screen and (max-width: 768px) {
  .nft_token_container {
    .nft_token_content_wrap {
      .nft_token_title {
      }

      .nft_token_information_content {
        .nft_token_information_item {
          span:nth-of-type(1) {
            min-width: 1rem;
          }

          span:nth-of-type(2) {
          }
        }

        .nft_token_information_item:last-child {
        }
      }

      .nft_token_list_content {
        .nft_token_list_title {
        }

        .pagination_content {
        }
      }
    }
  }
}
</style>
