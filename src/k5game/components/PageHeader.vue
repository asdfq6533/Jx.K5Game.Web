<template>
  <div class="page-header">
    <div class="icon" @click="closeSelectedTag(goBack, query)">
      <svg-icon icon-class="back" />
    </div>
    <p>{{ title }}</p>
  </div>
</template>

<script>
import commonMixin from '@/k5game/mixins/common-mixin'
export default {
  mixins: [commonMixin],
  props: {
    goBack: {
      type: String,
      default: null
    },
    query: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-header{
  border-bottom: 1px solid #e2e1e4;
  display: flex;
  align-items: center;
  color: #afb4ce;
  padding: 8px 0;
  .icon{
    font-size: 24px;
    border-right: 1px solid #c7c6cb;
    padding: 0 10px;
  }
  p {
    margin: 0;
    padding: 0 10px;
  }
}
</style>
