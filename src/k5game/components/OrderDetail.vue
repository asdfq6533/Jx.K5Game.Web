<template>
  <div class="orderDetail">
    <div class="title-container">
      <span>{{ title }}</span>
    </div>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.title-container{
  padding-bottom: 5px;
  border-bottom: 2px solid #f93;
  span{
    padding: 5px 0;
  }
}

</style>
