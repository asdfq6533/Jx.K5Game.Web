
/* eslint-disable */
<template>
  <div
    ref="editDiv"
    :class="`edit-div ${isLocked ? 'border' : ''}`"
    :contenteditable="canEdit"
    @focus="isLocked = true"
    @blur="onBlur"
    @input="changeText"
    @keyup.enter="submitClick"
    v-html="innerText"
  />
</template>

<script>
export default {
  name: 'EditDiv',
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false,
      playerCreated: false
    }
  },
  watch: {
    'value'() {
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value
      }
    }
  },
  methods: {
    submitClick() {
      console.log('submitClick')
    },
    onBlur() {
      this.isLocked = false
      this.$emit('onBlur')
    },
    changeText() {
      let html = this.$refs.editDiv.innerHTML
      html = html.replace(/<[^>]+>/g, '')
      if (!html || !html.trim()) {
        html = '新建节点'
      }
      this.$emit('input', html)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import "~@/styles/variables";
.border{
  border: 1px solid $menuActiveText;
  padding: 4px;
}
.edit-div {
  min-height: 20px;
  text-align: right;
  height: 100%;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  &[contenteditable=true]{
    user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
}
</style>
