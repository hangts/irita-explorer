<template>
  <div>
    <list-component
      :is-loading="isLoading"
      :list-data="energyAssetData"
      :column-list="energyAssetColumn"
      :pagination="{ pageSize: 5, dataCount: 0, pageNum: 1 }"
    >
    </list-component>
  </div>
</template>

<script>
import energyAssetColumn from '@/components/tableListColumnConfig/energyAssetColumn';
import { getEnergyAssetApi } from '@/service/api';
import { UGAS } from '@/constant';
import ListComponent from '@/components/common/ListComponent';

export default {
  name: 'EnergyAssetOptions',
  components: { ListComponent },
  data() {
    return {
      isLoading: false,
      energyAssetData: [],
      energyAssetColumn,
      address: '',
    };
  },
  created() {},
  mounted() {
    this.address = this.$route.params.param;
    this.getEnergyAssetList();
  },
  methods: {
    async getEnergyAssetList() {
      this.isLoading = true;
      const res = await getEnergyAssetApi(this.address);
      this.isLoading = false;
      if (res && res.result && res.result.length > 0) {
        const energyItem = res.result.find((item) => item.denom === UGAS);
        this.energyAssetData = [
          {
            title: this.$t('ExplorerLang.table.energy'),
            amount: energyItem?.amount || '--',
          },
        ];
      } else {
        this.energyAssetData = [
          {
            title: this.$t('ExplorerLang.table.energy'),
            amount: '--',
          },
        ];
      }
    },
  },
};
</script>

<style scoped></style>
