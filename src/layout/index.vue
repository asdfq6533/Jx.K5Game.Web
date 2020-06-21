<template>
  <div :class="classObj" class="app-wrapper">
    <navbar />
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}" class="container-header">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
      <!--<right-panel v-if="showSettings">-->
      <!--<settings />-->
      <!--</right-panel>-->
      <footerbar @showChatDialog="showChatDialog" />
      <!-- <chat-form v-model="isChatDialogShow" :chat-content="chatContent" /> -->
      <!-- <notification v-if="showNotify" /> -->
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar } from './components'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ResizeMixin from './mixin/ResizeHandler'
import Footerbar from './components/Footerbar'
import ChatForm from '@/components/ChatForm'
import Notification from '@/components/Notification'
import { mapState, mapGetters } from 'vuex'
// import signalrMixin from './mixin/signalr-mixin'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    Breadcrumb,
    Hamburger,
    // eslint-disable-next-line vue/no-unused-components
    Footerbar,
    // eslint-disable-next-line vue/no-unused-components
    ChatForm,
    // eslint-disable-next-line vue/no-unused-components
    Notification
  },
  mixins: [ResizeMixin],
  data() {
    return {
      chatContent: ''
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'isChatDialogShow',
      'showNotify'
    ])
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    showChatDialog() {
      this.isChatDialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .container-header{
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #dfe4ed;
  }
</style>
