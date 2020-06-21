import * as gameInfoApi from '@/api/gameInfo'
const accountMixins = {
  data() {
    return {
      allGames: []
    }
  },
  methods: {
    getAllGames(callBack) {
      gameInfoApi.GetAllGames({ gamePlatform: '' }).then(res => {
        this.allGames = res.data.result.items
        if (callBack && typeof callBack === 'function') {
          callBack()
        }
      })
    }
  }
}
export default accountMixins
