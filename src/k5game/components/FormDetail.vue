<template>
  <div class="formDetail">
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
  name: 'FormDetail',
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
.formDetail{
  .title-container{
  color: #f93;
  padding-bottom: 5px;
  border-bottom: 1px solid #f93;
  span{
    padding: 5px 0;
    border-bottom: 5px solid #f93;
  }
}
}

</style>
