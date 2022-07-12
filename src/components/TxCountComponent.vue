<template>
  <div class="tx_count_content">
    <div class="tx_count_content_wrap">
      <span :class="`iconfont ${icon}`"></span>
      <span class="tx_count_label"> {{ title }}</span>
      <span class="tx_count_number">
        <router-link class="link_style" v-if="isLink" :to="`${linkRoute}/${txCount}`">
          {{ txCount }}
        </router-link>
        <span v-else>{{ txCount }}</span>
      </span>
    </div>
    <div class="count_item_wrap">
      <div v-for="(item, index) in countMsgs" :key="index" class="count_item">
        <span :class="`iconfont ${item.icon}`"></span>
        <span class="count_item_label">{{ item.title }}</span>
        <span class="count_item_val">{{ item.count }}</span>
      </div>
    </div>
    <div class="show_address_send_tx_content">
      <slot name="displayShowAddressSendTx"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TxCountComponent',
  props: {
    txCount: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    linkRoute: {
      type: String,
      default: '',
    },
    countMsgs: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss">
.tx_count_content {
  display: flex;
  margin: 0.2rem 0 0 0;
  align-items: center;
  &_wrap {
    display: flex;
    align-items: center;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
  .iconfont {
    margin-right: 0.08rem;
    font-size: 0.24rem;
  }

  .tx_count_label {
    font-size: 0.18rem;
    color: rgba(23, 29, 68, 1);
    margin-right: 0.08rem;
    line-height: 0.32rem;
  }

  .tx_count_number {
    font-size: 0.18rem;
    line-height: 0.32rem;

    .link_style {
      color: $theme_c !important;
    }
  }
  .show_address_send_tx_content {
    margin-left: 0.2rem;
    @media (max-width: 768px) {
      margin-top: 0.12rem;
      margin-left: 0;
    }
  }
}
.count_item {
  font-size: 0.18rem;
  color: rgba(23, 29, 68, 0.5);
  margin-left: 0.24rem;
  position: relative;
  display: flex;
  align-items: center;
  &:before {
    content: '';
    width: 1px;
    height: 0.16rem;
    background: #e3e3e3;
    position: absolute;
    left: -0.1rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .iconfont {
    margin-right: 0.08rem;
    font-size: 0.24rem;
  }
  &_label {
    font-weight: 400;
    margin-right: 0.08rem;
    color: #171d44;
  }
  &_val {
    color: #171d44;
  }
}
@media (max-width: 768px) {
  .count_item {
    margin-top: 0.14rem;
    margin-left: 0;
    &:before {
      display: none;
    }
  }
}
</style>
