<template>
  <div>
    <div class="content_title">
      {{ $t('ExplorerLang.addressDetail.identities') }}
    </div>
    <el-table
      class="table"
      :data="identityList"
      :empty-text="$t('ExplorerLang.table.emptyDescription')"
    >
      <el-table-column
        :min-width="ColumnMinWidth.identity"
        :label="$t('ExplorerLang.table.identity')"
      >
        <template slot-scope="scope">
          <router-link :to="`/identity/${scope.row.id}`">{{ scope.row.id }}</router-link>
        </template>
      </el-table-column>
      <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.txHash"
            placement="top"
            :disabled="!Tools.isValid(scope.row.txHash)"
          >
            <router-link :to="`/tx?txHash=${scope.row.txHash}`"
              >{{ formatTxHash(scope.row.txHash) }}
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.time"
        :label="$t('ExplorerLang.table.timestamp')"
        prop="time"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_content" v-show="identityCount > identityPageSize">
      <m-pagination
        :page-size="identityPageSize"
        :total="identityCount"
        :page="identityPageNum"
        :page-change="identityPageChange"
      >
      </m-pagination>
    </div>
  </div>
</template>

<script>
import { ColumnMinWidth } from '@/constant';
import Tools from '@/util/Tools';
import { getIdentityListByAddress } from '@/service/api';
import MPagination from '@/components/common/MPagination';

export default {
  name: 'IdentityOptions',
  components: { MPagination },
  data() {
    return {
      identityList: [],
      ColumnMinWidth,
      Tools,
      identityCount: 0,
      identityPageSize: 5,
      identityPageNum: 1,
    };
  },
  created() {
    this.getIdentityListCount();
    this.getIdentityList();
  },
  methods: {
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
      return '--';
    },
    // 身份id列表
    identityPageChange(pageNum) {
      this.identityPageNum = pageNum;
      this.getIdentityList();
    },
    async getIdentityList() {
      try {
        const res = await getIdentityListByAddress(
          this.$route.params.param,
          this.identityPageNum,
          this.identityPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.identityList = res.data.map((item) => {
            return {
              id: item.identities_id,
              txHash: item.update_tx_hash || '--',
              time: Tools.formatLocalTime(item.update_block_time) || '--',
            };
          });
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getIdentityListCount() {
      try {
        const res = await getIdentityListByAddress(this.$route.params.param, null, null, true);
        if (res?.count) {
          this.identityCount = res.count;
        } else {
          this.identityCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content_title {
  color: $t_first_c;
  margin-bottom: 0.4rem;
  text-align: left;
  font-size: $s16;
  font-family: PublicSans;
  font-weight: 600;
  line-height: 22px;
}
</style>
