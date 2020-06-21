export default {
  methods: {
    closeSelectedTag(name, query) {
      const view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        this.toLastView(name, query, visitedViews, view)
      })
    },
    toLastView(name, query, visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (name) {
        this.$router.push({
          name: name,
          query: query
        })
      } else if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    }
  }
}
