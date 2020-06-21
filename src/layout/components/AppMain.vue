<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <loading v-if="isLoading" />
  </section>
</template>

<script>
import Loading from '@/k5game/components/Loading'
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  components: { Loading },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    ...mapGetters(['isLoading'])
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 140px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 60 + 40 */
    min-height: calc(100vh - 140px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
