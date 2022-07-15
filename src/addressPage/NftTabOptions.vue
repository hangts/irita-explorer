<template>
  <list-component
    :is-loading="assetLoading"
    :list-data="assetArray"
    :column-list="assetColumnArray"
    :pagination="{
      pageSize: Number(assetPageSize),
      dataCount: assetCount,
      pageNum: Number(assetPageNum),
    }"
    @pageChange="assetPageChange"
  >
    <template v-slot:txCount>
      <tx-count-component
        :title="
          assetCount > 1
            ? $t('ExplorerLang.nftAsset.subTitles')
            : $t('ExplorerLang.nftAsset.subTitle')
        "
        :icon="'iconNFT'"
        :tx-count="assetCount"
      ></tx-count-component>
    </template>
  </list-component>
</template>

<script>
import addressDetailNftTabColumnConfig from '@/components/tableListColumnConfig/addressDetailNftTabColumnConfig';
import TxCountComponent from '@/components/TxCountComponent';
import { getNfts } from '@/service/api';
import ListComponent from '@/components/common/ListComponent';

export default {
  name: 'NftTabOptions',
  components: { ListComponent, TxCountComponent },
  data() {
    return {
      assetLoading: false,
      assetArray: [],
      assetColumnArray: addressDetailNftTabColumnConfig,
      assetPageSize: 5,
      assetCount: 0,
      assetPageNum: 1,
    };
  },
  created() {},
  mounted() {
    this.getNftListCount();
    this.getNftList();
  },
  methods: {
    assetPageChange(pageNum) {
      this.assetPageNum = pageNum;
      this.getNftList();
    },
    async getNftListCount() {
      try {
        const nftData = await getNfts(null, null, true, '', '', this.$route.params.param);
        if (nftData?.count) {
          this.assetCount = nftData.count;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getNftList() {
      try {
        this.assetLoading = true;
        const nftData = await getNfts(
          this.assetPageNum,
          this.assetPageSize,
          false,
          '',
          '',
          this.$route.params.param
        );
        this.assetLoading = false;
        if (nftData && nftData.data) {
          this.assetArray = nftData.data.map((item) => {
            return {
              id: item.nft_id,
              denomName: item.denom_name || item.denom_id,
              denomId: item.denom_id,
              nftName: item.nft_name,
              owner: item.owner,
              tokenData: item.tokenData,
              tokenUri: item.tokenUri,
            };
          });
        }
      } catch (e) {
        this.assetLoading = false;
        console.error(e);
      }
    },
  },
};
</script>

<style scoped></style>
