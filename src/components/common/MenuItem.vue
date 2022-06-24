<!--
* 注释的component：
* 受控于 navMenu 的嵌套，以及vue 根元素不能使用 v-for，所以需要外面v-for，里面在展开，很不友好
* 有知道vue如何解决的可以优化一下代码
*/
-->
<!--<template>-->
<!--  <component-->
<!--    v-for="(item, index) in menuList"-->
<!--    :is="item.children ? 'el-submenu' : 'el-menu-item'"-->
<!--    :index="String(index + 1)"-->
<!--    :key="index"-->
<!--  >-->
<!--    &lt;!&ndash; 没有子集情况 &ndash;&gt;-->
<!--    <router-link v-if="!item.children" :to="item.link || ''">-->
<!--      {{ item.title }}-->
<!--    </router-link>-->
<!--    &lt;!&ndash; 有子集情况，进行递归处理 &ndash;&gt;-->
<!--    <template v-else>-->
<!--      <template slot="title">-->
<!--        {{ item.title }}-->
<!--      </template>-->
<!--      <MenuItem :menu-list="item.children" />-->
<!--    </template>-->
<!--  </component>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--  name: 'MenuItem',-->
<!--  props: {-->
<!--    menuList: {-->
<!--      type: Array,-->
<!--      default: () => [],-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
<template>
  <component
    :is="menuItem.children ? 'el-submenu' : 'el-menu-item'"
    :index="index"
    :key="index"
    :popper-append-to-body="popperAppendToBody"
    class="text-left"
  >
    <!-- 没有子集情况 -->
    <router-link v-if="!menuItem.children" :to="menuItem.link || ''" class="block">
      {{ menuItem.title }}
    </router-link>
    <!-- 有子集情况，进行递归处理 -->
    <template v-else>
      <template slot="title">
        {{ menuItem.title }}
      </template>
      <MenuItem
        :menu-item="item"
        :index="`${index}-${subIndex + 1}`"
        v-for="(item, subIndex) in menuItem.children"
        :key="subIndex"
        :popperAppendToBody="false"
      />
    </template>
  </component>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      default: () => {},
    },
    index: {
      type: String,
      require,
    },
    popperAppendToBody: {
      type: Boolean,
    },
  },
};
</script>
