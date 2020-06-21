/**
 *监听滚动事件
 */

export default {
  data() {
    return {
      rightKey: 0,
      rightMenus: [
        { text: '基本信息', id: '#base' },
        { text: '销售属性', id: '#prop' },
        { text: '销售信息', id: '#info' },
        { text: '商品描述', id: '#desc' },
        { text: '商品保密信息', id: '#secrecy' },
        { text: '卖家信息', id: '#sell' },
        { text: '图文信息', id: '#full' }
      ]
    }
  },
  mounted() {
    this.initListenScroll()
  },
  methods: {
    scrollById(id, key) {
      this.rightKey = key
      const ele = document.getElementById(id.replace('#', ''))
      if (ele) {
        ele.scrollIntoView()
      }
    },
    initListenScroll() {
      window.onscroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.rightMenus.some((item, key) => {
          const ele = document.querySelector(`${item.id}`)
          if (ele) {
            const top = ele.offsetTop
            const height = ele.offsetHeight
            if (scrollTop - top > 0 && scrollTop - top < height) {
              this.rightKey = key
              return true
            }
          }
        })
      }
    }
  }
}

