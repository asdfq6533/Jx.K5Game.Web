<template>
  <div class="collapse">
    <div class="title-container">
      <div class="left" @click="isShow = !isShow">
        <svg-icon icon-class="up-arrow" class="icon" />
        <p>{{ title }}</p>
      </div>
      <a v-show="isAddField" href="javascript:void(0)" class="right" @click="addField">
        <svg-icon icon-class="add2" class="icon2" />
        <p>自定义字段</p>
      </a>
    </div>
    <vertical-toggle>
      <div v-if="isShow" class="container">
        <slot />
      </div>
    </vertical-toggle>
  </div>
</template>

<script>
import VerticalToggle from '@/k5game/components/vertical-toggle'
export default {
  name: 'LxzCollapse',
  components: { VerticalToggle },
  props: {
    title: {
      type: String,
      default: ''
    },
    isAddField: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    addField() {
      this.$emit('addField')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.collapse{
  border: 1px solid #e2e1e4;
  margin: 10px 0;
  .title-container{
    background: #f6f4fc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px 0 10px;
    height: 40px;
    .left, .right{
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      color: gray;
      p {
        margin: 0;
      }
      .icon{
        font-size: 24px;
      }
      .icon2{
        font-size: 16px;
        margin-right: 4px;
        color: $primary_color;
      }
    }
    .right{
      border: 1px dashed $primary_color;
      padding: 3px 5px;
    }
  }
  .container{
    padding: 20px 15px 10px 15px;
  }
}
</style>
