
import $ from 'jquery'
// eslint-disable-next-line no-unused-vars
import signalR from 'signalr'

// var connection = $.hubConnection('http://adsl01.ruianer.com:6500')
// // 如果前后端为同一个端口，可不填参数。如果前后端分离，这里参数为服务器端的URL
// var demoChatHubProxy = connection.createHubProxy('chatHub')
// // demoChatHub为后端定义，使用驼峰式命名，后端首字母必须大写
// // addMessageToList 为后端demoChatHub方法
// demoChatHubProxy.on('Recv', function (userName, message) {
//   console.log(userName + ' ' + message)
// })
// connection.start()
//   .done(function () {
//     console.log('Now connected, connection ID=' + connection.id)
//   })
//   .fail(function () {
//     console.log('Could not connect')
//   })

const signalrMixin = {
  data() {
    return {
      demoChatHubProxy: '',
      connection: ''
    }
  },
  created() {
    this.startConnection()
  },
  computed: {

  },
  mounted() {

  },
  watch: {

  },
  methods: {
    startConnection() {
      this.connection = $.hubConnection('http://adsl01.ruianer.com:6500')
      // 如果前后端为同一个端口，可不填参数。如果前后端分离，这里参数为服务器端的URL
      this.demoChatHubProxy = this.connection.createHubProxy('chatHub')
      this.demoChatHubProxy.on('Recv', function(userName, message) {
        console.log(userName + ' ' + message)
      })
      const _this = this
      this.connection.start()
        .done(function() {
          console.log('Now connected, connection ID=' + _this.connection.id)
        })
        .fail(function() {
          console.log('Could not connect')
        })
      this.connection.error((error) => {
        console.log(error)
      })

      this.connection.reconnected(() => {
        console.log('reconnected')
      })

      this.connection.disconnected(() => {
        console.log('disconnected')
      })

      this.connection.received((data) => {
        console.log('received')
        console.log(data)
      })

      this.connection.connectionSlow(() => {
        console.log('connectionSlow')
      })
    }
  }
}
export default signalrMixin
