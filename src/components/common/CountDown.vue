<template>
  <span>{{ this.timeStr }}</span>
</template>

<script>
import Tools from '@/util/Tools';

export default {
  name: 'CountDown',
  props: {
    timeProp: {
      type: Number,
    },
  },
  data() {
    return {
      timer: null,
      timeStr: '',
    };
  },
  mounted() {
    this.countDown();
  },
  methods: {
    countDown() {
      clearInterval(this.timer);
      let accTime = Tools.getTimestamp();

      this.timer = setInterval(() => {
        this.timeStr = Tools.formatAge(accTime++, this.timeProp * 1000, 'ago', '>');
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss"></style>
