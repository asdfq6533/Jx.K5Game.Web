<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in breadList"
        :key="item.path"
        style="cursor: pointer"
      >
        <span v-if="item.redirect==='noRedirect'|| index==breadList.length-1" class="no-redirect">{{ item.name }}</span>
        <a v-else @click.prevent="breadcrumbClick(item)">{{ item.name }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      breadList: null
    }
  },
  computed: {
    ...mapGetters(['breadListState'])
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      // if (route.path.startsWith('/redirect/')) {
      //   return
      // }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const that = this
      // 由于本项目大部分属于‘一级’页面，所以在设置路由时候，一级页面不设置breadNumber = 1，‘二级’页面以上才设置breadNumber
      const breadNumber = typeof (this.$route.meta.breadNumber) !== 'undefined' ? this.$route.meta.breadNumber : 1
      // 获取当前页面的名字和路由，并组合成新的对象
      const newBread = { name: this.$route.meta.title, path: this.$route.path, redirect: this.$route.redirect }
      // console.log(breadNumber)
      let vuexBreadList = [] // 默认初始化面包屑数据
      if (breadNumber > 2 & breadNumber < 4) {
        // 当前面包屑breadNumber大于1时才会从vuex中获取值
        vuexBreadList = this.breadListState // 获取breadList数组
      }
      if (breadNumber < vuexBreadList.length) {
        // "回退"面包屑----判断条件：当前路由breadNumber小于vuexBreadList的长度
        vuexBreadList.splice(breadNumber - vuexBreadList.length, vuexBreadList.length - breadNumber)
      }
      if (breadNumber !== 3 && breadNumber > vuexBreadList.length) {
        vuexBreadList.push(newBread)
      } else if (breadNumber > vuexBreadList.length + 1 && breadNumber === 3) {
        vuexBreadList.push(newBread)
      }
      // if (breadNumber > vuexBreadList.length) {
      //   // 添加面包屑----判断条件：当前路由breadNumber大于vuexBreadList的长度

      // }
      // eslint-disable-next-line no-unused-vars
      if (breadNumber === 4) {
        const arr = [{ name: this.$route.matched[1].meta.title, path: this.$route.matched[1].path, redirect: this.$route.matched[1].redirect }]
        vuexBreadList = arr.concat(vuexBreadList)
      }
      // console.log(vuexBreadList)
      // 添加父路由面包屑
      if (vuexBreadList[0].name !== '首页') {
        // console.log(this.$route.matched[0])
        const parentPath = [{ name: this.$route.matched[0].meta.title, path: this.$route.matched[0].path, redirect: this.$route.matched[0].redirect }]
        // console.log(parentPath)
        // console.log(parentPath)
        this.breadList = parentPath.concat(vuexBreadList)
      } else {
        this.breadList = vuexBreadList
      }
      // 处理完数据后，将最终的数据更新到vuex（用于页面刷新）
      that.$store.commit('breadList/setBreadList', vuexBreadList)
    },
    breadcrumbClick(item) {
      this.$router.push({
        path: item.path
      })
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
