<template>
  <div>
    <div v-html="apply" />
  </div>
</template>

<script>
export default {
  name: 'ApplyText',
  data() {
    return {
      apply: ''
    }
  },
  mounted() {
    this.apply = this.$route.query.htmls
    this.$nextTick(() => {
      document.forms[0].submit()
    })
  }
}
</script>

<style scoped>

</style>
