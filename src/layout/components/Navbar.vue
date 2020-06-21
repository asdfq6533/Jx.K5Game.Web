<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <div class="logo">
      <img v-if="logo" :src="logo" class="sidebar-logo">
      <h1 class="title">{{ title }} </h1>
    </div>
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template> -->

      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('../../assets/images/GetProfilePictureById.png')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <p class="accountName">
        {{ getTimeState() }}，{{ userName }}
      </p>
      <div class="accountOperate">
        <a href="javascript:void(0)" @click="logout">
          退出
          <i />
        </a>
        <a href="javascript:void(0)">修改密码</a>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    return {
      title: 'K5电竞管理系统',
      logo: require('@/assets/images/K5-icon@2x.png'),
      userName: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  mounted() {
    // this.getInfo()
    this.userName = window.localStorage.getItem('nickName')
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getTimeState() {
      // 获取当前时间
      const timeNow = new Date()
      // 获取当前小时
      const hours = timeNow.getHours()
      // 设置默认文字
      let text = ''
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        text = '早上好'
      } else if (hours > 10 && hours <= 14) {
        text = '中午好'
      } else if (hours > 14 && hours <= 18) {
        text = '下午好'
      } else if (hours > 18 && hours <= 24) {
        text = '晚上好'
      }
      // 返回当前时间段对应的状态
      return text
    },
    async getInfo() {
      const data = await this.$store.dispatch('user/getInfo')
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  background: #2d2d2d;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  border-bottom: 1px solid #dfe4ed;;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .logo{
    position: absolute;
    left:0;
    display: flex;
    align-items: center;
    height: 60px;
    img{
      margin-left: 20px;
      width: 38px;
      height: 38px;
      vertical-align: middle;
      margin-right: 12px;
    }
    .title{
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
  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    position: absolute;
    right: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #fff;
    .accountOperate{
      display: flex;
      a{
        padding: 20px;
        position: relative;
        text-align: center;
        display: inline-block;
        i{
          position: absolute;
          right: 0;
          height: 19px;
          width: 1px;
          background: #fff;
          top: 22px;
        }
      }
    }
  }
}
</style>
