<template>
  <div class="links_tab_container">
    <ul class="links_tab_wrap">
      <li
        class="link_tab_item"
        v-for="(item, index) in proposLinks"
        :key="index"
        :class="item.isActive ? 'active_style' : ''"
      >
        <router-link class="link_tab_link" :to="item.href">{{ item.label }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LinksTabCopmonent',
  props: {
    proposLinks: {
      type: Array,
      default: [],
    },
  },
};
</script>

<style scoped lang="scss">
.links_tab_container {
  margin: 0.16rem 0;
  .links_tab_wrap {
    display: flex;
    .link_tab_item {
      margin-right: 0.16rem;
      .link_tab_link {
        background: $bg_white_c;
        display: inline-block;
        padding: 0.09rem 0.16rem;
        border-radius: 0.06rem;
        font-size: 0.18rem;
        font-weight: 400;
        color: $t_first_c;
        line-height: 0.18rem;
        box-shadow: 0 0 0.01rem 0 rgba(0, 0, 0, 0.01), 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.04),
          0 0.24rem 0.32rem 0 rgba(0, 0, 0, 0.01);
      }
    }
    .active_style{
      .link_tab_link{
        background: $theme_c;
        color: $bg_white_c;
      }
    }
    .link_tab_item:last-child {
      margin-right: 0;
    }
  }
}
</style>
