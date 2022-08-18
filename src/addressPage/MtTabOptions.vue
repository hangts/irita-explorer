<template>
  <list-component
    :is-loading="isShowMtLoading"
    :column-list="addressDetailMtTabColumnConfig"
    :list-data="mtListData"
    :pagination="{
      pageSize: Number(mtPageSize),
      dataCount: mtTxCount,
      pageNum: Number(mtPageNum),
    }"
    @pageChange="mtPageChange"
  >
    <template v-slot:txCount>
      <tx-count-component
        :title="
          mtTxCount > 1 ? $t('ExplorerLang.mtList.subTitles') : $t('ExplorerLang.mtList.subTitle')
        "
        :icon="'iconNFT'"
        :tx-count="mtTxCount"
      ></tx-count-component>
    </template>
  </list-component>
</template>

<script>
import ListComponent from '../components/common/ListComponent';
import addressDetailMtTabColumnConfig from '../components/tableListColumnConfig/addressDetailMtTabColumnConfig';
import { getMtCount, getMts } from '../service/api';
import Tools from '../util/Tools';
import TxCountComponent from '../components/TxCountComponent';

export default {
  name: 'MtTabOptions',
  components: { TxCountComponent, ListComponent },
  data() {
    return {
      isShowMtLoading: false,
      addressDetailMtTabColumnConfig,
      mtListData: [],
      mtPageSize: 5,
      mtTxCount: 0,
      mtPageNum: 1,
    };
  },
  created() {
    this.getMtListCountByAddress();
    this.getMtListByAddress();
  },
  methods: {
    mtPageChange(mtCurrentPage) {
      this.mtPageNum = mtCurrentPage;
      this.getMtListByAddress();
    },
    async getMtListCountByAddress() {
      const addressMtCountList = await getMtCount('', '', this.$route.params.param).catch((error) =>
        console.error(error)
      );
      this.mtTxCount = addressMtCountList?.count ?? 0;
    },
    async getMtListByAddress() {
      this.isShowMtLoading = true;
      const addressMtList = await getMts(
        this.mtPageNum,
        this.mtPageSize,
        '',
        '',
        this.$route.params.param
      ).catch((error) => console.error(error));
      this.isShowMtLoading = false;
      if (addressMtList?.data?.length) {
        this.mtListData = addressMtList?.data?.map((item) => {
          return {
            mtId: item?.mt_id || '',
            mtDenomName: item?.denom_name || '',
            mtDenomId: item?.denom_id || '',
            mtNumber: item?.amount ?? '',
            publisher: item?.creator || '',
            time: item?.latest_tx_time ? Tools.formatLocalTime(item?.latest_tx_time) : '',
          };
        });
      }
    },
  },
};
</script>

<style scoped></style>
