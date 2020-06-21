<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" style="margin-left: 8px;">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link> -->
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link> -->
    </transition>
    <p v-if="!collapse" class="worker">工作台</p>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'K5电竞',
      logo: require('@/assets/images/K5-icon@2x.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  padding-top: 20px;
  position: relative;
  width: 100%;
  background: #2d2d2d;
  text-align: center;
  overflow: hidden;
  .worker{
    font-size: 14px;
    text-align: left;
    padding-left: 20px;
    color: gray;
  }
  & .sidebar-logo-link {
    text-align: left;
    & .sidebar-logo {
      margin-left:20px;
      width: 38px;
      height: 38px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 24px;
      font-weight: bold;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
