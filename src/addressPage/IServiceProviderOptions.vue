<template>
  <div>
    <div class="content_title">
      {{ $t('ExplorerLang.addressDetail.providerTitle') }}
    </div>
    <el-table
      class="table"
      :data="providerTxList"
      :empty-text="$t('ExplorerLang.table.emptyDescription')"
    >
      <el-table-column
        :min-width="ColumnMinWidth.serviceName"
        :label="$t('ExplorerLang.table.serviceName')"
      >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.serviceName" placement="top">
            <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
              {{ scope.row.serviceName }}
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.respondTimes"
        :label="$t('ExplorerLang.table.respondTimes')"
      >
        <template slot-scope="scope">
          <router-link :to="`/service/respond/${scope.row.serviceName}/${address}`">
            {{ `${scope.row.respond_times} ${$t('ExplorerLang.unit.time')}` }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.available"
        :label="$t('ExplorerLang.table.isAvailable')"
      >
        <template slot-scope="scope">
          <div class="provider_transaction_content_available">
            <span
              class="provider_transaction_content_available_icon"
              :style="`background:${scope.row.isAvailable ? '#B1E96E' : '#C4C4C4'}`"
            ></span>
            <span class="provider_transaction_content_available_status">{{
              scope.row.isAvailable
            }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column :min-width="ColumnMinWidth.price" :label="$t('ExplorerLang.table.price')">
							<template slot-scope="scope">
								<span>{{scope.row.pricing}}</span>
							</template>
						</el-table-column>
						<el-table-column :min-width="ColumnMinWidth.deposit" :label="$t('ExplorerLang.table.deposit')">
							<template slot-scope="scope">
								<span>{{scope.row.deposit}}</span>
							</template>
						</el-table-column> -->
      <el-table-column :min-width="ColumnMinWidth.qos" :label="$t('ExplorerLang.table.minBlock')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.qos} ${$t('ExplorerLang.unit.blocks')}` }}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.bindTime')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.time}` }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.disabledTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.isAvailable ? '--' : scope.row.unbindTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_content" v-show="providerTxCount > providerTxPageSize">
      <m-pagination
        :page-size="providerTxPageSize"
        :total="providerTxCount"
        :page="providerTxPageNum"
        :page-change="providerTxPageChange"
      >
      </m-pagination>
    </div>
    <div class="content_title" style="margin-top: 0.4rem">
      {{ $t('ExplorerLang.addressDetail.respondRecord') }}
    </div>
    <el-table
      class="table"
      :data="respondRecordList"
      :empty-text="$t('ExplorerLang.table.emptyDescription')"
    >
      <el-table-column
        :min-width="ColumnMinWidth.serviceName"
        :label="$t('ExplorerLang.table.serviceName')"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.serviceName" :content="scope.row.serviceName" placement="top">
            <router-link :to="`/service?serviceName=${scope.row.serviceName}`">
              {{ scope.row.serviceName }}
            </router-link>
          </el-tooltip>
          <span v-if="!scope.row.serviceName">--</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="tx_type"
        :width="ColumnMinWidth.txType"
        :label="$t('ExplorerLang.table.txType')"
        prop="type"
      ></el-table-column>
      <el-table-column
        class-name="hash_status"
        :min-width="ColumnMinWidth.respondHash"
        :label="$t('ExplorerLang.table.respondHash')"
      >
        <template slot-scope="scope">
          <div class="respond_transaction_content_hash">
            <div class="status">
              <img
                class="status_icon"
                :src="
                  require(`../assets/${
                    scope.row.respondStatus == TX_STATUS.success ? 'success.png' : 'failed.png'
                  }`)
                "
              />
            </div>
            <el-tooltip :content="scope.row.respondHash" placement="top">
              <div>
                <router-link :to="`/tx?txHash=${scope.row.respondHash}`">
                  {{ formatTxHash(scope.row.respondHash) }}
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
        :min-width="ColumnMinWidth.blockListHeight"
        :label="$t('ExplorerLang.table.block')"
      >
        <template slot-scope="scope">
          <router-link :to="`/block/${scope.row.height}`">{{ scope.row.height }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="ColumnMinWidth.time"
        :label="$t('ExplorerLang.table.timestamp')"
        prop="time"
      >
        <template slot-scope="scope">
          <span>{{ Tools.formatLocalTime(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="address"
        :min-width="ColumnMinWidth.address"
        :label="$t('ExplorerLang.table.consumer')"
      >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.consumer" placement="top">
            <router-link
              v-if="scope.row.consumer && scope.row.consumer.length"
              :to="`/address/${scope.row.consumer}`"
            >
              {{ formatAddress(scope.row.consumer) }}
            </router-link>
          </el-tooltip>
          <span v-if="!scope.row.consumer">--</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="hash_status"
        :min-width="ColumnMinWidth.requestHash"
        :label="$t('ExplorerLang.table.requestHash')"
      >
        <template slot-scope="scope">
          <div class="address_transaction_content_hash">
            <div class="status">
              <img
                v-if="scope.row.requestHash && scope.row.requestHash != '--'"
                class="status_icon"
                src="../assets/success.png"
              />
            </div>
            <el-tooltip
              v-if="scope.row.requestHash && scope.row.requestHash != '--'"
              :content="scope.row.requestHash"
              placement="top"
            >
              <div>
                <router-link :to="`/tx?txHash=${scope.row.requestHash}`">
                  {{ formatTxHash(scope.row.requestHash) }}
                </router-link>
              </div>
            </el-tooltip>
            <span v-else>{{ '--' }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_content" v-show="respondRecordCount > respondRecordPageSize">
      <m-pagination
        :page-size="respondRecordPageSize"
        :total="respondRecordCount"
        :page="respondRecordPageNum"
        :page-change="respondRecordPageChange"
      >
      </m-pagination>
    </div>
  </div>
</template>

<script>
import { ColumnMinWidth } from '@/constant';
import {
  getRespondServiceRecord,
  getRespondServiceWithAddress,
  getServiceBindingByServiceName,
} from '@/service/api';
import Tools from '@/util/Tools';
import MPagination from '@/components/common/MPagination';

export default {
  name: 'IServiceProviderOptions',
  components: { MPagination },
  data() {
    return {
      providerTxList: [],
      ColumnMinWidth,
      providerTxCount: 0,
      providerTxPageSize: 5,
      providerTxPageNum: 1,
      respondRecordCount: 0,
      respondRecordPageSize: 5,
      respondRecordPageNum: 1,
      respondRecordList: [],
      address: '',
      Tools,
    };
  },
  created() {
    this.getProviderTxList();
    this.getProviderTxListCount();
    this.getRspondRecordListCount();
    this.getRspondRecordList();
  },
  methods: {
    providerTxPageChange(pageNum) {
      this.providerTxPageNum = pageNum;
      this.getProviderTxList();
    },
    respondRecordPageChange(pageNum) {
      this.respondRecordPageNum = pageNum;
      this.getRspondRecordList();
    },
    // 服务调用-提供者
    async getProviderTxList() {
      try {
        const res = await getRespondServiceWithAddress(
          this.$route.params.param,
          this.providerTxPageNum,
          this.providerTxPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.providerTxList = [];
          for (const item of res.data) {
            const result = {
              serviceName: (item.msgs[0].msg.ex || {}).service_name,
              provider: item.msgs[0].msg.provider,
              owner: item.msgs[0].msg.owner,
              respond_times: item.respond_times,
              pricing: JSON.parse(item.msgs[0].msg.pricing || '{}').price,
              qos: item.msgs[0].msg.qos,
              time: Tools.formatLocalTime(item.time),
              unbindTime: item.unbinding_time ? Tools.formatLocalTime(item.unbinding_time) : '--',
              txHash: item.tx_hash,
              blockHeight: item.height,
              txType: item.type,
              status: item.status,
            };
            if (item.msgs[0].msg.deposit && item.msgs[0].msg.deposit.length) {
              result.deposit = `${item.msgs[0].msg.deposit[0].amount} ${item.msgs[0].msg.deposit[0].denom}`;
            }
            const bindings = await getServiceBindingByServiceName(result.serviceName).catch(
              (error) => {
                console.log(error);
              }
            );
            result.isAvailable = this.$t('ExplorerLang.common.false');
            (bindings?.result || []).forEach((bind) => {
              if (result.provider === bind.provider && result.owner == bind.owner) {
                result.isAvailable = bind.available
                  ? this.$t('ExplorerLang.common.true')
                  : this.$t('ExplorerLang.common.false');
                result.pricing = JSON.parse(bind.pricing || '{}').price;
                result.qos = bind.qos;
                if (bind.disabled_time) {
                  const time = new Date(bind.disabled_time).getTime();
                  result.unbindTime = time > 0 ? Tools.formatLocalTime(time / 1000) : '--';
                }
              }
            });
            if (result.pricing && result.pricing.length) {
              result.pricing = result.pricing.replace('point', ' point');
            }
            this.providerTxList.push(result);
          }
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getProviderTxListCount() {
      try {
        const res = await getRespondServiceWithAddress(this.$route.params.param, null, null, true);
        if (res?.count) {
          this.providerTxCount = res.count;
        } else {
          this.providerTxCount = 0;
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    // 响应记录
    async getRspondRecordList() {
      try {
        const res = await getRespondServiceRecord(
          '',
          this.$route.params.param,
          this.respondRecordPageNum,
          this.respondRecordPageSize,
          false
        );
        if (res?.data?.length > 0) {
          this.respondRecordList = (res.data || []).map((tx) => {
            tx.type = this.TX_TYPE_DISPLAY[tx.type];
            return tx;
          });
        } else {
          this.respondRecordList = [];
        }
      } catch (e) {
        console.error(e);
        this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
      }
    },
    async getRspondRecordListCount() {
      try {
        const res = await getRespondServiceRecord('', this.$route.params.param, null, null, true);
        if (res?.count) {
          this.respondRecordCount = res.count;
        } else {
          this.respondRecordCount = 0;
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
a {
  color: $t_link_c !important;
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
.respond_transaction_content_hash {
  display: flex;

  .status {
    .status_icon {
      width: 0.13rem;
      height: 0.13rem;
      margin-right: 0.05rem;
    }
  }
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

.provider_transaction_content_available {
  display: flex;
  align-items: center;

  .provider_transaction_content_available_icon {
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
