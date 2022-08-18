<template>
  <div class="mt_token_container">
    <div class="mt_token_content_wrap">
      <div class="mt_token_title">{{ $t('ExplorerLang.mtDetail.title') }}</div>
      <div class="mt_token_information_content">
        <div class="mt_token_information_item" v-for="(item, index) in detailData" :key="index">
          <span>{{ item.label }}：</span>
          <span v-if="!item.href">{{ item.value }}</span>
          <span class="address_number_content" v-else>
            <router-link :to="`${item.href}${item.value}`">{{ item.value }}</router-link>
            <span
              class="owner_number"
              v-show="Number(item.ownerNumber) - 1 >= 1"
              @click="scrollBottom"
              >{{ `+ ${Number(item.ownerNumber) - 1}` }}</span
            >
          </span>
        </div>
      </div>
      <div class="mt_token_list_content">
        <div class="mt_token_list_title">{{ $t('ExplorerLang.nftDetail.nftTxs') }}</div>
        <list-component
          :list-data="MtDetailTxListData"
          :is-loading="isShowMtListLoading"
          :column-list="mtDetailTxColumn"
          :pagination="{
            pageSize: Number(pageSize),
            dataCount: mtTxCount,
            pageNum: Number(pageNum),
          }"
          @pageChange="pageChange"
        ></list-component>
      </div>
      <div id="mt_owner_cotainer" class="mt_token_list_content">
        <div class="mt_token_list_title">{{ $t('ExplorerLang.mtDetail.ownerListTitle') }}</div>
        <list-component
          :list-data="mtOwnerListData"
          :is-loading="isShowOwnerListLoading"
          :column-list="mtDetailOwnerListColumn"
          :pagination="{
            pageSize: Number(mtOwnerPageSize),
            dataCount: mtOwnerCount,
            pageNum: Number(mtOwnerPageNum),
          }"
          @pageChange="mtOwnerPageChange"
        ></list-component>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/util/Tools';
import ListComponent from '../common/ListComponent';
import { getMtInfo, getMtInfoTx, getMtOwnerList } from '../../service/api';
import mtDetailTxColumn from './mtColumnConfig/mtDetailTxColumn';
import mtDetailOwnerListColumn from './mtColumnConfig/mtDetailOwnerListColumn';

export default {
  name: 'MtDetail',
  components: { ListComponent },
  data() {
    return {
      detailData: [
        {
          label: this.$t('ExplorerLang.mtDetail.owner'),
          resultKey: 'owner',
          value: '',
          href: `/address/`,
          ownerNumber: '',
          ownerNumberKey: 'owner_count',
        },
        {
          label: this.$t('ExplorerLang.mtDetail.mt'),
          resultKey: 'mt_id',
          value: '',
        },
        {
          label: this.$t('ExplorerLang.mtDetail.mtDenomName'),
          resultKey: 'denom_name',
          value: '',
        },
        {
          label: this.$t('ExplorerLang.mtDetail.mtDenomId'),
          resultKey: 'denom_id',
          value: '',
        },
        {
          label: this.$t('ExplorerLang.mtDetail.mtNumber'),
          resultKey: 'amount',
          value: '',
        },
        {
          label: this.$t('ExplorerLang.mtDetail.mtData'),
          resultKey: 'token_data',
          value: '',
        },
      ],
      MtDetailTxListData: [],
      isShowMtListLoading: false,
      mtDetailTxColumn,
      mtDetailOwnerListColumn,
      pageSize: 5,
      pageNum: 1,
      mtTxCount: 0,
      mtOwnerListData: [],
      isShowOwnerListLoading: false,
      mtOwnerPageSize: 5,
      mtOwnerCount: 0,
      mtOwnerPageNum: 1,
      denomId: '',
      tokenId: '',
    };
  },
  created() {
    this.denomId = this.$route.query.denom;
    this.nftId = this.$route.query.tokenId;
    this.getMtInfoData();
    this.getMtInfoTx();
    this.getMtInfoTxCount();
    this.getOwnerList();
    this.getOwnerListCount();
  },
  methods: {
    async getOwnerListCount() {
      const ownerListCount = await getMtOwnerList(
        this.denomId,
        this.nftId,
        null,
        null,
        null,
        true
      ).catch((error) => {
        console.error(error);
      });
      if (ownerListCount?.total_count) {
        this.mtOwnerCount = ownerListCount.total_count;
      }
    },
    async getOwnerList() {
      const ownerList = await getMtOwnerList(
        this.denomId,
        this.nftId,
        this.mtOwnerPageNum,
        this.mtOwnerPageSize
      ).catch((error) => console.error(error));
      if (ownerList?.data?.length) {
        this.mtOwnerListData = ownerList?.data.map((item) => {
          return {
            owner: item?.owner || '',
            mtCount: item?.amount ?? 0,
          };
        });
      }
    },
    async getMtInfoTxCount() {
      const mtInfoTxCount = await getMtInfoTx(this.denomId, this.nftId, null, null, true).catch(
        (error) => {
          console.error(error);
        }
      );
      this.mtTxCount = mtInfoTxCount?.total_count ?? 0;
    },
    async getMtInfoTx() {
      this.isShowMtListLoading = true;
      const mtInfoTxListData = await getMtInfoTx(
        this.denomId,
        this.nftId,
        this.pageNum,
        this.pageSize
      ).catch((error) => {
        console.error(error);
      });
      this.isShowMtListLoading = false;
      if (mtInfoTxListData?.data?.length) {
        this.MtDetailTxListData = mtInfoTxListData?.data?.map(async (item) => {
          return {
            txHash: item?.issue_tx_hash || '--',
            status: item.status,
            txType: item.txType?.length ? item.txType : [],
            mtNumber: item.amount,
            signer: item.signer[0],
            time: item?.time ? Tools.formatLocalTime(item.time) : '--',
            blockHeight: item?.height || '--',
            fee: item.fee, // TODO zhangjinbiao 这里需要再次处理
          };
        });
      }
    },
    pageChange(mtTxCurrentPage) {
      this.pageNum = mtTxCurrentPage;
      this.getMtInfoTx();
    },
    mtOwnerPageChange(mtOwnerListPageNum) {
      this.mtOwnerPageNum = mtOwnerListPageNum;
      this.getOwnerList();
    },
    async getMtInfoData() {
      if (!this.denomId || !this.nftId) return;
      const infoData = await getMtInfo(this.denomId, this.nftId).catch((error) => {
        console.error(error);
      });

      if (infoData && JSON.stringify(infoData) !== '{}') {
        this.detailData.forEach((item) => {
          item.value = infoData?.[item.resultKey] || '';
          if (item?.ownerNumberKey) {
            item.ownerNumber = infoData?.data?.[item.ownerNumberKey] ?? '';
          }
        });
      }
    },
    scrollBottom() {
      document.getElementById('mt_owner_cotainer').scrollIntoView();
    },
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}

.mt_token_container {
  padding: 0 0.15rem;

  .mt_token_content_wrap {
    max-width: 12rem;
    margin: 0 auto;

    .mt_token_title {
      font-size: $s18;
      color: $t_first_c;
      font-weight: bold;
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      text-indent: 0.2rem;
    }

    .mt_token_information_content {
      box-sizing: border-box;
      // border: 0.01rem solid $bd_second_c;
      border-radius: 0.04rem;
      background: $bg_white_c;
      padding: 0.2rem;

      .mt_token_information_item {
        text-align: left;
        margin-bottom: 0.16rem;
        display: flex;

        .owner_number {
          cursor: pointer;
          margin-left: 0.08rem;
          display: inline-block;
          padding: 0.01rem 0.12rem;
          font-size: 0.14rem;
          border: 0.01rem solid $theme_c;
          border-radius: 0.14rem;
          color: $theme_c !important;
          background: $bg_white_c;
          min-width: auto !important;
          &:hover {
            color: $bg_white_c !important;
            background: $theme_c;
          }
        }
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

      .mt_token_information_item:last-child {
        margin-bottom: 0;
      }
    }

    .mt_token_list_content {
      .mt_token_list_title {
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
  .mt_token_container {
    .mt_token_content_wrap {
      .mt_token_title {
      }

      .mt_token_information_content {
        .mt_token_information_item {
          span:nth-of-type(1) {
            min-width: 1rem;
          }
        }
      }
    }
  }
}
</style>
