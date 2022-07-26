<template>
  <div class="tx_status_container">
    <div class="tx_status_content mt-16">
      <el-button
        size="small"
        v-for="(item, index) in statusTypes"
        :key="index"
        @click="choiceTxStatus(index)"
        :class="item.isActive ? 'active_style' : 'default_style'"
      >
        {{ item.label }}
      </el-button>
    </div>
    <div class="tx_date_picket_container" v-if="isShowDatePicker">
      <div class="tx_status_content mt-16">
        <el-button
          size="small"
          v-for="item in timeTabs"
          :key="item.value"
          @click="timeTabsChoose(item)"
          :class="item.value === timeTabVal ? 'active_style' : 'default_style'"
        >
          {{ item.label }}
        </el-button>
      </div>
      <div class="mt-16 flex">
        <div class="tx_date_picket_content">
          <el-date-picker
            size="small"
            v-model="value"
            :editable="false"
            range-separator="~"
            type="daterange"
            :start-placeholder="$t('ExplorerLang.common.startDate')"
            :end-placeholder="$t('ExplorerLang.common.endDate')"
            :picker-options="pickerOptions"
            @change="selectTime"
          ></el-date-picker>
        </div>
        <div class="tooltip_content">
          <el-tooltip popper-class="tooltip" :content="$t('ExplorerLang.transactions.tooltip')">
            <i class="iconfont iconyiwen"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import config from '../../productionConfig';
import Tools from '../../util/Tools';

export default {
  name: 'TxStatusTabsComponents',
  props: {
    isShowDatePicker: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      statusTypes: [
        {
          value: 0,
          label: this.$t('ExplorerLang.common.allTxStatus'),
          isActive: true,
        },
        {
          value: 1,
          label: this.$t('ExplorerLang.common.success'),
          isActive: false,
        },
        {
          value: 2,
          label: this.$t('ExplorerLang.common.failed'),
          isActive: false,
        },
      ],
      timeTabs: [
        {
          value: 'all',
          label: this.$t('ExplorerLang.common.all'),
          matchFormatTimes: [],
        },
        {
          value: 'today',
          label: this.$t('ExplorerLang.common.today'),
        },
        {
          value: 'last7',
          label: this.$t('ExplorerLang.common.last7'),
        },
        {
          value: 'last30',
          label: this.$t('ExplorerLang.common.last30'),
        },
      ],
      timeTabVal: 'all',
      value: sessionStorage.getItem('txTimeRange')
        ? JSON.parse(sessionStorage.getItem('txTimeRange'))
        : [],
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now();
          const startTime = Number(config.firstBlockTimestamp) - 24 * 60 * 60 * 1000;
          return time.getTime() > _now || time.getTime() < startTime.toString();
          // 大于当前的禁止，小于7天前的禁止
        },
      },
    };
  },
  created() {
    this.initTabTimes();
  },
  mounted() {
    const { status } = Tools.urlParser();
    if (status) {
      this.statusTypes.forEach((item) => {
        item.isActive = false;
        if (item.value === Number(status)) {
          item.isActive = true;
        }
      });
    }
  },
  methods: {
    choiceTxStatus(index) {
      this.statusTypes.forEach((item) => {
        item.isActive = false;
      });
      this.statusTypes[index].isActive = true;
      this.$emit('onChangTxStatus', this.statusTypes[index].value);
    },
    selectTime() {
      const times = [];

      if (this?.value?.length === 2) {
        const startTime = this.value[0].toString();
        const endTime = this.value[1].toString();
        times[0] = moment(startTime).format('YYYY-MM-DD');
        times[1] = moment(endTime).format('YYYY-MM-DD');
        // 存时间的动作放到具体页面 比如 TxList.vue
        // sessionStorage.setItem('txTimeRange',JSON.stringify([startTimeStamp,engTimeStamp]))
      }

      this.matchTimeTab(times);
      this.$emit('onChangeDate', times);
    },
    resetParams() {
      this.statusTypes.forEach((item) => {
        item.isActive = false;
      });
      this.statusTypes[0].isActive = true;
      this.value = [];
      // this.$emit('resetParams','')
    },
    // 匹配的时间
    timeTabsMatchValInit() {
      const format = 'YYYY-MM-DD';

      this.timeTabs.forEach((v) => {
        let matchFormatTimes = [];

        switch (v.value) {
          case 'all':
            matchFormatTimes = [];
            break;
          case 'today':
            matchFormatTimes[0] = moment().format(format);
            matchFormatTimes[1] = moment().format(format);
            break;
          case 'last7':
            matchFormatTimes[0] = moment().subtract(6, 'days').format(format);
            matchFormatTimes[1] = moment().format(format);
            break;
          case 'last30':
            matchFormatTimes[0] = moment().subtract(29, 'days').format(format);
            matchFormatTimes[1] = moment().format(format);
            break;
          default:
            break;
        }

        v.matchFormatTimes = matchFormatTimes;
      });
    },
    timeTabsChoose(item) {
      this.timeTabVal = item.value;
      this.value = item.matchFormatTimes;

      this.$emit('onChangeDate', this.value);
    },
    /**
     * 清空时候匹配全部
     * 没有匹配，快捷选项不选中
     * @param times
     */
    matchTimeTab(times) {
      if (!times.length) {
        this.timeTabVal = 'all';
        return;
      }

      const matchItem = this.timeTabs.find((v) => {
        return (
          v.matchFormatTimes?.length && v.matchFormatTimes.every((v2, ind) => v2 === times[ind])
        );
      });

      this.timeTabVal = matchItem ? matchItem.value : null;
    },
    /**
     * 初始化快捷选项和时间的匹配
     */
    initTabTimes() {
      // 处理匹配的时间
      this.timeTabsMatchValInit(this.timeTabs);
      this.matchTimeTab(this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.tx_status_container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 0.16rem 0;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
  .tx_status_content {
    display: flex;
    margin-right: 0.12rem;

    ::v-deep.el-button + .el-button {
      margin-left: 0;
      border-radius: 0;
    }

    .el-button {
      color: rgba(23, 29, 68, 1);
      border-color: rgba(231, 234, 243, 1);

      &:hover {
        background: rgba(90, 93, 99, 0.1);
      }
    }

    .el-button:first-child {
      border-radius: 0.08rem 0 0 0.08rem;
      border-right: none;
    }

    .el-button:last-child {
      border-radius: 0 0.08rem 0.08rem 0;
      border-left: none;
    }

    .active_style {
      border-color: $theme_c !important;
      background: $theme_c !important;
      color: #fff !important;
    }
  }
  .tx_date_picket_container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tx_date_picket_content {
      @media (max-width: 768px) {
        display: flex;
        justify-content: flex-start;
      }
      @media (max-width: 450px) {
        .el-date-editor {
          width: 2.8rem !important;
        }
      }
      @media (max-width: 375px) {
        .el-date-editor {
          width: 2.3rem !important;
        }
      }

      ::v-deep.el-range-editor.is-active {
        border-color: $theme_c !important;
      }
      ::v-deep.el-range-editor.is-active:hover {
        border-color: $theme_c !important;
      }
      ::v-deep.el-date-editor {
        border-radius: 0.08rem;
        border-color: #e7eaf3;
      }
    }
    .tooltip_content {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 0.1rem;
    }
  }
}
</style>
