<template>
  <div>
    <div class="content_title">
      {{ $t('ExplorerLang.addressDetail.consumerTitle') }}
    </div>
    <el-table
      class="table"
      :data="consumerTxList"
      row-key="txHash"
      :empty-text="$t('ExplorerLang.table.emptyDescription')"
      :span-method="arraySpanMethod"
    >
      <el-table-column
        :min-width="ColumnMinWidth.serviceName"
        :label="$t('ExplorerLang.table.serviceName')"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="!scope.row.isChildren" :content="scope.row.serviceName" placement="top">
            <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
              {{ scope.row.serviceName }}
            </router-link>
          </el-tooltip>
          <span class="serviceNameText" v-if="scope.row.isChildren && scope.row.index == 0">{{
            getRespondCount(scope.row.count)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="tx_type"
        :width="ColumnMinWidth.minTxType"
        :label="$t('ExplorerLang.table.txType')"
        prop="txType"
      ></el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.state"
        :label="$t('ExplorerLang.table.requestStatus')"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.state" class="consumer_transaction_content_available">
            <span
              class="consumer_transaction_content_available_icon"
              :style="`background:${getBgColorWithState(scope.row.state)}`"
            ></span>
            <span>{{
              scope.row.state === 'Running'
                ? '--'
                : $t('ExplorerLang.table.' + getContentWithState(scope.row.state))
            }}</span>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.blockListHeight"
        :label="$t('ExplorerLang.table.block')"
      >
        <template slot-scope="scope">
          <router-link :to="`/block/${scope.row.blockHeight}`"
            >{{ scope.row.blockHeight }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        class-name="hash_status"
        :min-width="ColumnMinWidth.addressTxHash"
        :label="$t('ExplorerLang.table.txHash')"
      >
        <template slot-scope="scope">
          <div class="address_transaction_content_hash">
            <div class="status">
              <img
                class="status_icon"
                :src="
                  require(`../assets/${
                    scope.row.status == TX_STATUS.success ? 'success.png' : 'failed.png'
                  }`)
                "
              />
            </div>
            <el-tooltip :content="scope.row.txHash" placement="top">
              <div>
                <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                  {{ formatTxHash(scope.row.txHash) }}
                </router-link>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="requestId"
        :min-width="ColumnMinWidth.requestId"
        :label="$t('ExplorerLang.table.requestId')"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.requestContextId"
            placement="top"
            effect="dark"
            :disabled="Tools.disabled(scope.row.requestContextId)"
          >
            <span>{{ formatAddress(scope.row.requestContextId) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        class-name="address"
        :min-width="ColumnMinWidth.address"
        :label="$t('ExplorerLang.table.provider')"
      >
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.txType == TX_TYPE_DISPLAY.respond_service"
            :content="scope.row.provider"
            placement="top"
          >
            <router-link :to="`/address/${scope.row.provider}`">
              {{ formatAddress(scope.row.provider) }}
            </router-link>
          </el-tooltip>
          <div v-if="scope.row.txType == TX_TYPE_DISPLAY.call_service">
            <el-tooltip
              v-if="(scope.row.provider || []).length === 1"
              :content="scope.row.provider[0]"
              placement="top"
            >
              <router-link :to="`/address/${scope.row.provider[0]}`">
                {{ formatAddress(scope.row.provider[0]) }}
              </router-link>
            </el-tooltip>
            <div class="service_tx_muti_to_container" v-else>
              <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                {{ `${scope.row.provider.length} ${$t('ExplorerLang.unit.providers')}` }}
              </router-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.time}` }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_content" v-show="consumerTxCount > consumerTxPageSize">
      <m-pagination
        :page-size="consumerTxPageSize"
        :total="consumerTxCount"
        :page="consumerTxPageNum"
        :page-change="consumerTxPageChange"
      >
      </m-pagination>
    </div>
  </div>
</template>

<script>
import { ColumnMinWidth, TX_STATUS } from '@/constant';
import Tools from '@/util/Tools';
import { getTxType } from '@/helper/IritaHelper';
import { getCallServiceWithAddress, getServiceContextsByServiceName } from '@/service/api';
import MPagination from '@/components/common/MPagination';

export default {
  name: 'IServiceConsumerOptions',
  components: { MPagination },
  data() {
    return {
      consumerTxList: [],
      ColumnMinWidth,
      TX_STATUS,
      TX_TYPE_DISPLAY: {},
      consumerTxCount: 0,
      consumerTxPageSize: 5,
      consumerTxPageNum: 1,
      Tools,
    };
  },
  created() {
    this.getTxTypeData();
    this.getConsumerTxList();
    this.getConsumerTxListCount();
  },
  methods: {
    // 服务调用-消费者
    async getConsumerTxList() {
      try {
        const res = await getCallServiceWithAddress(
          this.consumerTxPageNum,
          this.consumerTxPageSize,
          false,
          this.$route.params.param
        );
        if (res?.data?.length > 0) {
          this.consumerTxList = [];
          for (const item of res.data) {
            const result = {
              serviceName: item.msgs[0].msg.service_name || '--',
              txHash: item.tx_hash,
              blockHeight: item.height,
              txType: this.TX_TYPE_DISPLAY[item.type],
              provider: item.msgs[0].msg.providers,
              time: Tools.formatLocalTime(item.time),
              state: 'Running',
              status: item.status,
              respond: [],
            };
            item.events.forEach((item) => {
              (item.attributes || []).forEach((attr) => {
                if (attr.key == 'request_context_id') {
                  result.requestContextId = attr.value;
                }
              });
            });
            const context = await this.getContext(result.requestContextId || '');
            if (context && context.result) {
              result.state = context.result.state;
            }
            this.consumerTxList.push(result);
            if (item.respond && item.respond.length) {
              item.respond.forEach((r, index) => {
                const respondResult = {
                  index,
                  isChildren: true,
                  count: item.respond.length,
                  serviceName: (r.msgs[0].msg.ex || {}).service_name || '',
                  txHash: r.tx_hash,
                  blockHeight: r.height,
                  txType: this.TX_TYPE_DISPLAY[r.type],
                  provider: r.msgs[0].msg.provider,
                  time: Tools.formatLocalTime(r.time),
                  requestContextId: (r.msgs[0].msg.ex || {}).request_context_id,
                  requestStatus: '--',
                  status: r.status,
                };
                this.consumerTxList.push(respondResult);
              });
            }
          }
        } else {
          this.consumerTxList = [];
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getContext(requestContextId) {
      try {
        return await getServiceContextsByServiceName(requestContextId);
      } catch (error) {
        console.log(error);
      }
    },
    async getConsumerTxListCount() {
      try {
        const res = await getCallServiceWithAddress(null, null, true, this.$route.params.param);
        if (res?.count) {
          this.consumerTxCount = res.count;
        } else {
          this.consumerTxCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    consumerTxPageChange(pageNum) {
      this.consumerTxPageNum = pageNum;
      this.getConsumerTxList();
    },
    async getTxTypeData() {
      try {
        const res = await getTxType();
        this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY;
      } catch (error) {
        console.log(error);
      }
    },
    arraySpanMethod(table) {
      if (table.columnIndex === 0) {
        if (table.row.isChildren) {
          if (table.row.index == 0) {
            return {
              rowspan: table.row.count,
              colspan: 1,
            };
          }
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    },
    getRespondCount(count) {
      return this.$t('ExplorerLang.unit.totalRespond').replace(/\$\{\%value\%\}/, count);
    },
    getBgColorWithState(state) {
      let bgColor = '';
      switch (state) {
        case 0:
          bgColor = '#B1E96E';
          break;
        case 1:
          bgColor = '#E96E6E';
          break;
        case 2:
          bgColor = '#FFC456';
          break;
      }
      return bgColor;
    },
    getContentWithState(state) {
      let content = '';
      switch (state) {
        case 0:
          content = 'running';
          break;
        case 1:
          content = 'paused';
          break;
        case 2:
          content = 'completed';
          break;
      }
      return content;
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash);
      }
      return '--';
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address) || '--';
    },
  },
};
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.address_transaction_content_hash {
  display: flex;

  .status {
    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }
  }
}
.content_title {
  padding-top: 0.25rem;
  color: #171d44;
  margin-bottom: 0.4rem;
  text-align: left;
  font-size: 0.16rem;
  font-family: PublicSans;
  font-weight: 600;
  line-height: 22px;
}
.serviceNameText {
  color: $t_second_c;
}

.consumer_transaction_content_hash {
  display: flex;
  align-items: center;
}

.consumer_transaction_content_available {
  display: flex;
  align-items: center;

  .consumer_transaction_content_available_icon {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    margin-right: 0.1rem;
  }
}

.pagination_content {
  margin-top: 0.2rem;
  display: flex;
  justify-content: flex-end;
}
</style>
