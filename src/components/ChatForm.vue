<template>
  <el-dialog :visible="isShow" class="ChatFormDialog" :show-close="false" :append-to-body="true" @close="close">
    <div class="left-item">
      <div class="my-info">
        <img :src="loginProfile">
        <div>
          <p>{{ loginName }} </p>
          <span>实名认证</span>
        </div>
      </div>
      <div class="search-form">
        <el-input
          v-model="searchContent"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
        />
      </div>
      <div class="message-lists">
        <ul v-if="dataList.length">
          <li v-for="(item, index) in dataList" :key="index" class="list" :class="item.isSelected?'selected':''" @click="goChat(item)" @contextmenu.prevent="showBtn(item)">
            <div class="profile">
              <img :src="item.profilePicture">
              <span v-if="item.uneadMessageCount">{{ item.uneadMessageCount }}</span>
            </div>
            <div class="info">
              <p>{{ item.name }} <span>{{ item.time }}</span></p>
              <p>{{ item.messageContent }}</p>
            </div>
            <div v-if="item.showBtn" class="deleteBtn">
              <li class="active" @click="deleteFriend(item)">删除</li>
              <!-- <li>修改</li> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="hasChooseChat" class="chat-form-wrap">
      <h3>{{ chatObject }}</h3>
      <div class="chat-form">
        <ul ref="scroll">
          <div class="scrollWrap">
            <li v-for="(item, index) in chatMessageList" :key="index" :class="item.side === 1?'sender':'receiver'">
              <p v-if="item.isTimeVisible" class="time">{{ item.creationTime | timeFormatNotUtc }}</p>
              <div class="chat-content">
                <img :src="item.profilePicture" class="profile">
                <i />
                <div class="chat-content-wrap">
                  <p class="name">{{ item.name }}</p>
                  <div class="content-wrap">
                    <div class="content" :class="item.isOrderOrProduct?'productOrOrder':''">
                      <span v-if="item.side === 1" :class="item.readState === 2?'isRead':'unRead'">{{ item.readState === 2?'已读':'未读' }}</span>
                      <p v-if="item.isOrderOrProduct === ''" class=""> {{ item.message }}</p>
                      <div v-if="item.isOrderOrProduct === 'product'" class="productInfo" @click="goToProductDetail(item.productInfo)">
                        <img :src="item.productInfo.img">
                        <div>
                          <p>{{ item.productInfo.title }}</p>
                          <p class="price">￥<span>{{ item.productInfo.price }}</span> </p>
                        </div>
                      </div>
                      <div v-if="item.isOrderOrProduct === 'order'" class="orderInfo" @click="goToOrderDetail(item.orderInfo)">
                        <p>订单编号：{{ item.orderInfo.id }} </p>
                        <p>商品信息：{{ item.orderInfo.title }} </p>
                        <p>订单金额：¥{{ item.orderInfo.price }}</p>
                        <p class="creatTime">创建时间：{{ item.orderInfo.downOrderTime | timeFormat }}</p>
                      </div>
                      <div v-if="item.isOrderOrProduct === 'afterSale'" class="orderInfo" @click="goToAfterSaleInfoDetail(item.afterSaleInfo)">
                        <p>售后编号：{{ item.afterSaleInfo.id }} </p>
                        <p>商品信息：{{ item.afterSaleInfo.title }} </p>
                        <p>订单金额：¥{{ item.afterSaleInfo.price }}</p>
                        <p class="creatTime">创建时间：{{ item.afterSaleInfo.creationTime | timeFormat }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="blank" />
              </div>
            </li>

          </div>
        </ul>
      </div>
      <div class="input-form">
        <div class="icon-form">
          <img src="@/assets/images/face.png" alt="">
          <img src="@/assets/images/screenshot .png" alt="">
          <img src="@/assets/images/picture.png" alt="">
        </div>
        <div>
          <el-input
            v-model.trim="inputContent"
            type="textarea"
            @keyup.enter.native="sendMessage"
          />
        </div>
      </div>
    </div>
    <div v-if="hasChooseChat" class="order-lists">
      <h3>用户订单</h3>
      <div class="orderList">
        <ul>
          <li v-for="(item, index) in orderList" :key="index">
            <p class="time">{{ item.creationTime | timeFormat }}</p>
            <div class="product-wrap">
              <div class="orderId">
                <p>订单号：{{ item.id }}</p>
                <span @click="copyClick(item.id,$event)">复制</span>
              </div>
              <p class="status">{{ item.orderStatus }}</p>
              <div class="productInfo">
                <img src="http://p.qpic.cn/music_cover/jXFicBvicUcfIWSoCNT1OrbAoHG2fqqnrJVnGV4iaLCapWUpCKqbmAicJg/600?n=1" alt="">
                <div>
                  <p>{{ item.commodityTitle }}</p>
                  <p class="price">¥{{ item.orderAmount }}</p>
                </div>
              </div>
              <div class="btn" @click="sendOrderInfo(item)">发送</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="right-item" />
  </el-dialog>
</template>
<script>
import $ from 'jquery'
import * as messagesApi from '@/api/message'
import clipboard from '@/utils/clipboard'
// eslint-disable-next-line no-unused-vars
// import { getUserKey } from '@/utils/user-key'
import * as userApi from '@/api/user'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import signalrMixin from '@/mixin/signalr-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'ChatFormDialog',
  mixins: [signalrMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    searchContent: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data(val) {
    return {
      dataList: [],
      params: {
        maxResultCount: 10,
        skipCount: 0,
        state: ''
      },
      hasChooseChat: false,
      userInfo: '',
      chatObject: '',
      chatMessageList: [],
      loginProfile: '',
      loginName: '',
      from: '',
      inputContent: '',
      chatFriend: '',
      orderList: [],
      status: [
        {
          id: 0,
          name: '待付款',
          title: 'payPending',
          number: 0
        },
        {
          id: 1,
          name: '待发货',
          title: 'deliverPending',
          number: 0
        },
        {
          id: 2,
          name: '待收货',
          title: 'receivePending',
          number: 0
        },
        {
          id: 3,
          name: '已完成',
          title: 'complete',
          number: 0
        },
        {
          id: 4,
          name: '待收货',
          title: 'complete',
          number: 0
        },
        {
          id: -1,
          name: '交易关闭',
          title: 'close',
          number: 0
        }
      ]
    }
  },
  computed: {

  },
  watch: {
    isShow(val) {
      console.log(val)
      if (val === true) {
        // 判断是否是从订单详情或者售后详情打开聊天窗口，将聊天对象加入聊天列表，
        this.chatFriend = JSON.parse(window.sessionStorage.getItem('chatFriendInfo'))
        if (this.chatFriend) {
          if (this.dataList.length) {
            this.dataList.some((item, index) => {
              if (Number(item.friendUserId) === this.chatFriend.friendUserId) {
                this.dataList.splice(index, 1) // 如果聊天列表已经有该聊天对象，先从列表删除
              }
            })
            this.dataList.unshift(this.chatFriend) // 将该聊天对象加到数组的第一个
          } else {
            this.dataList.push(this.chatFriend)
          }
          // console.log(this.dataList)
          this.goChat(this.chatFriend) // 发送订单信息或售后信息
        }
      }
    }
  },
  mounted() {
    this.getList()
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.loginName = this.userInfo.nickName
    if (this.userInfo.profilePictureId) {
      this.getProfilePicture()
    } else {
      this.loginProfile = 'https://api.k5game.com/Profile/GetProfilePictureById'
    }
    this.receiveMsg() // 获取即时消息
    this.getNotice() // 获取通知
  },
  methods: {
    getNotice() {
      // eslint-disable-next-line no-unused-vars
      const _this = this
      this.connection.received((data) => {
        console.log('received')
        console.log(data)
        if (data.M === 'SendNoti') {
          const message = JSON.parse(data.A[1])
          console.log(message)
          _this.showNotification(message)
        }
      })
    },
    receiveMsg() {
      const _this = this
      // 收到即时消息后加入到消息列表
      this.connection.received((data) => {
        console.log('received')
        console.log(data)
        if (data.A) {
          if (data.M === 'SendMsg') { // 判断收到的是否是好友消息
            const message = data.A[0]
            const time = moment(new Date()).format('HH:mm') // 格式化时间
            message.friendProfilePictureId = message.profilePictureId
            message.time = time
            if (message.friendProfilePictureId) {
              this.getProfile(message)
            } else {
              this.$set(message, 'profilePicture', 'https://api.k5game.com/Profile/GetProfilePictureById')
            }
            const lastVisibleTime = new Date(moment(_this.dataList[_this.dataList.length - 1].creationTime).format('YYYY-MM-DD HH:mm')).getTime()
            if (new Date() - lastVisibleTime >= 30 * 60 * 1000) {
              message.isTimeVisible = true
            }
            if (message.message.indexOf('商品') > -1) {
              _this.$set(message, 'isOrderOrProduct', 'product')
              this.$set(message, 'messageContent', '【商品信息】')
              const product = JSON.parse(message.message.split('】+')[1])
              _this.$set(message, 'productInfo', product)
            } else if (message.message.indexOf('订单') > -1) {
              _this.$set(message, 'isOrderOrProduct', 'order')
              const order = JSON.parse(message.message.split('】+')[1])
              _this.$set(message, 'orderInfo', order)
              this.$set(message, 'messageContent', '【订单信息】')
            } else if (message.message.indexOf('售后') > -1) {
              _this.$set(message, 'isOrderOrProduct', 'afterSale')
              const afterSale = JSON.parse(message.message.split('】+')[1])
              _this.$set(message, 'afterSaleInfo', afterSale)
              this.$set(message, 'messageContent', '【售后信息】')
            } else {
              _this.$set(message, 'isOrderOrProduct', '')
              this.$set(message, 'messageContent', message.message)
            }
            console.log(message)
            _this.chatFriendInfo = { // 收到的即时消息的发送对象
              friendNickName: message.nickName,
              friendProfilePictureId: message.profilePictureId,
              friendUserId: message.sender,
              friendUserName: message.userName,
              message: message.message,
              time: message.time,
              messageType: '好友',
              messageContent: message.messageContent,
              name: message.nickName
            }
            if (message.profilePicture) {
              _this.chatFriendInfo.profilePicture = message.profilePicture
            } else {
              if (_this.chatFriendInfo.friendProfilePictureId) {
                this.getProfile(_this.chatFriendInfo)
              } else {
                this.$set(_this.chatFriendInfo, 'profilePicture', 'https://api.k5game.com/Profile/GetProfilePictureById')
              }
            }
            console.log(_this.chatFriendInfo)
            _this.dataList.some((item, index) => {
              if (Number(item.friendUserId) === Number(_this.chatFriendInfo.friendUserId)) {
                _this.dataList.splice(index, 1) // 如果聊天列表已经有该聊天对象，先从列表删除
              }
              this.$set(item, 'isSelected', false)
            })
            _this.dataList.unshift(_this.chatFriendInfo) // 将该聊天对象加到数组的第一个
            // 判断是否显示聊天窗口
            if (_this.hasChooseChat) {
              _this.chatFriendInfo.isSelected = true
              _this.chatMessageList.push(message)
              _this.chatMessageList.some(item => {
                _this.$set(item, 'readState', 2)
              })
              _this.markAllUnread()
              _this.$nextTick(() => {
                _this.$refs.scroll.scrollTop = $('.scrollWrap')[0].offsetHeight
              })
            }
          }
        }
      })
    },
    // 删除跟好友的聊天记录
    deleteFriend(item) {
      messagesApi.DeleteAFriendChatHistory({ id: item.friendUserId }).then(
        res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
            this.hasChooseChat = false
          }
        }).catch(() => {
      })
    },
    // 聊天窗口点击订单列表发送订单信息
    sendOrderInfo(item) {
      const orderInfo = {
        id: item.id,
        title: item.commodityTitle,
        price: item.orderAmount,
        downOrderTime: item.creationTime
      }
      this.inputContent = '【订单】+' + JSON.stringify(orderInfo)
      this.sendMessage()
    },
    // 复制订单号
    copyClick(val, event) {
      clipboard(val, event)
    },
    // 鼠标右键点击事件
    showBtn: function(item) {
      // alert('触发了右击事件')
      this.dataList.some(it => {
        this.$set(it, 'showBtn', false)
      })
      item.showBtn = true
    },
    close() {
      this.$emit('input', false)
      this.$store.dispatch('message/setIsChatDialogShow', false)
    },
    open() {
      this.$emit('input', true)
      this.$store.dispatch('message/setIsChatDialogShow', true)
    },
    // 获取登陆人的头像
    getProfilePicture() {
      userApi.getProfilePictureById({ id: this.userInfo.profilePictureId }).then(res => {
        this.loginProfile = 'data:image/png;base64,' + res.data.result.profilePicture
      })
    },
    // 获取消息列表
    getList() {
      this.params.skipCount = 0
      messagesApi.GetDiffTypeLatestMessage(this.params).then(
        res => {
          const items = res.data.result.items
          this.dataList = items
          items.some(item => {
            this.$set(item, 'showBtn', false)
            this.$set(item, 'isSelected', false)
            if (item.messageType === '好友') {
              if (item.friendProfilePictureId) {
                this.getProfile(item)
              } else {
                this.$set(item, 'profilePicture', 'https://api.k5game.com/Profile/GetProfilePictureById')
              }
              this.$set(item, 'name', item.friendNickName)
            } else if (item.messageType === '系统') {
              this.$set(item, 'profilePicture', require('@/assets/images/sysMessage.png'))
              this.$set(item, 'name', '系统消息')
            } else if (item.messageType === '订单') {
              this.$set(item, 'profilePicture', require('@/assets/images/orderMessage.png'))
              this.$set(item, 'name', '订单消息')
            } else if (item.messageType === '通知') {
              this.$set(item, 'profilePicture', require('@/assets/images/notice.png'))
              this.$set(item, 'name', '通知消息')
            }
            if (item.messageType === '好友') {
              const messageContent = item.message
              if (messageContent.indexOf('订单') > -1) {
                this.$set(item, 'messageContent', '【订单信息】')
              } else if (messageContent.indexOf('商品') > -1) {
                this.$set(item, 'messageContent', '【商品信息】')
              } else if (messageContent.indexOf('售后') > -1) {
                this.$set(item, 'messageContent', '【商品信息】')
              } else {
                this.$set(item, 'messageContent', messageContent)
              }
            } else {
              const messageContent = JSON.parse(item.message).Message
              this.$set(item, 'messageContent', messageContent)
            }
            const time = moment(item.messageTime).format('YYYY-MM-DD')
            const today = moment(new Date()).format('YYYY-MM-DD')
            if (time === today) {
              this.$set(item, 'time', moment(item.messageTime).format('HH:mm'))
            } else {
              this.$set(item, 'time', time)
            }
          })
        }).catch(() => {
      })
    },
    // 获取头像
    getProfile(item) {
      userApi.getProfilePictureById({ id: item.friendProfilePictureId }).then(res => {
        if (res.data.success) {
          if (res.data.result.profilePicture) {
            this.$set(item, 'profilePicture', 'data:image/png;base64,' + res.data.result.profilePicture)
          } else {
            this.$set(item, 'profilePicture', 'https://api.k5game.com/Profile/GetProfilePictureById')
          }
        }
      })
    },
    // 显示聊天窗口
    goChat(item) {
      // console.log(item)
      this.chatFriendInfo = item
      if (item.messageType === '好友') {
        this.hasChooseChat = true
        this.chatObject = item.friendNickName
        this.getUserChatMessages(item)
        this.getChatFriendOrder(item)
        this.dataList.some(item => {
          this.$set(item, 'isSelected', false)
        })
        this.$set(item, 'isSelected', true)
      } else {
        this.$store.dispatch('message/setIsChatDialogShow', false)
        this.$router.push({
          name: 'SystemMessages'
        })
      }
    },
    // 获取好友聊天记录
    getUserChatMessages(chatFriend) {
      // this.chatFriendInfo = chatFriend
      console.log(chatFriend)
      const params = {
        tenantId: 1,
        userId: Number(chatFriend.friendUserId),
        minMessageId: null
      }
      messagesApi.GetUserChatMessages(params).then(
        res => {
          // const totalCount = res.data.result.totalCount
          const items = res.data.result.items
          // eslint-disable-next-line no-unused-vars
          let lastVisibleTime = ''
          this.chatMessageList = items
          items.forEach((item, index) => {
            this.$set(item, 'isTimeVisible', false)
            const creationTime = new Date(moment(item.creationTime).format('YYYY-MM-DD HH:mm')).getTime()
            if (index === 0) {
              lastVisibleTime = creationTime
              this.$set(item, 'isTimeVisible', true)
            } else if (creationTime - lastVisibleTime >= 30 * 60 * 1000) {
              lastVisibleTime = creationTime
              this.$set(item, 'isTimeVisible', true)
            }
            if (item.side === 1) {
              this.$set(item, 'profilePicture', this.loginProfile)
              this.$set(item, 'name', this.loginName)
            } else {
              this.$set(item, 'profilePicture', chatFriend.profilePicture)
              this.$set(item, 'name', chatFriend.friendNickName)
            }
            if (item.message.indexOf('商品') > -1) {
              this.$set(item, 'isOrderOrProduct', 'product')
              const product = JSON.parse(item.message.split('】+')[1])
              this.$set(item, 'productInfo', product)
            } else if (item.message.indexOf('订单') > -1) {
              this.$set(item, 'isOrderOrProduct', 'order')
              const order = JSON.parse(item.message.split('】+')[1])
              console.log(order)
              this.$set(item, 'orderInfo', order)
            } else if (item.message.indexOf('售后') > -1) {
              this.$set(item, 'isOrderOrProduct', 'afterSale')
              const afterSale = JSON.parse(item.message.split('】+')[1])
              this.$set(item, 'afterSaleInfo', afterSale)
            } else {
              this.$set(item, 'isOrderOrProduct', '')
            }
          })
          if (window.sessionStorage.getItem('chatFriendInfo')) {
            this.chatFriendInfo = this.chatFriend
            this.inputContent = this.chatFriend.message
            this.sendMessage()
          }
          this.markAllUnread()
          this.$nextTick(() => {
            this.$refs.scroll.scrollTop = $('.scrollWrap')[0].offsetHeight
          })
        }).catch(() => {
      })
    },
    // 获取聊天对象的订单
    getChatFriendOrder(item) {
      const params = {
        buyerId: item.friendUserId,
        salerId: this.userInfo.id
      }
      accountTransactionApi.GetOrdersByUserID(params).then(
        res => {
          // eslint-disable-next-line no-empty
          if (res.data.success) {
            const items = res.data.result.items
            this.orderList = items
            items.some(item => {
              this.status.some(element => {
                if (item.status === element.id) {
                  this.$set(item, 'orderStatus', element.name)
                }
              })
            })
          }
        }).catch(() => {
      })
    },
    // 将所有未读消息标记为已读
    markAllUnread() {
      const params = {
        tenantId: 1,
        userId: this.chatFriendInfo.friendUserId
      }
      messagesApi.MarkAllUnread(params).then(res => {
        // this.loginName = res.data.result.user.nickName
        this.chatFriendInfo.uneadMessageCount = 0
      })
    },
    // 发送信息
    sendMessage() {
      if (!this.inputContent) {
        this.$message.error('请先输入内容！')
        return
      }
      const params = {
        sendUserId: this.userInfo.id,
        tenantId: 1,
        userId: this.chatFriendInfo.friendUserId,
        message: this.inputContent,
        tenancyName: 'Default',
        userName: this.userInfo.userName,
        nickName: this.userInfo.nickName,
        profilePictureId: this.userInfo.profilePictureId
      }
      // 调用后端方法 Send 传入参数
      const _this = this
      this.connection.start()
        .done(function() {
          _this.chatHub.invoke('SendMessage', params).done(function() {
            console.log('Invocation of NewContosoChatMessage succeeded')
            addMessageToList()
          }).fail(function(error) {
            console.log('Invocation of NewContosoChatMessage failed. Error: ' + error)
          })
        })
        .fail(function() {
          console.log('Could not connect')
        })
      function addMessageToList() {
        // 聊天窗口添加刚刚发送的信息
        const message = {
          side: 1,
          creationTime: new Date().toUTCString(),
          message: _this.inputContent,
          isTimeVisible: true,
          profilePicture: _this.loginProfile,
          name: _this.loginName
        }
        if (_this.inputContent.indexOf('商品') > -1) {
          _this.$set(message, 'isOrderOrProduct', 'product')
          const product = JSON.parse(message.message.split('】+')[1])
          _this.$set(message, 'productInfo', product)
        } else if (_this.inputContent.indexOf('订单') > -1) {
          _this.$set(message, 'isOrderOrProduct', 'order')
          const order = JSON.parse(message.message.split('】+')[1])
          _this.$set(message, 'orderInfo', order)
        } else if (_this.inputContent.indexOf('售后') > -1) {
          _this.$set(message, 'isOrderOrProduct', 'afterSale')
          const afterSale = JSON.parse(message.message.split('】+')[1])
          _this.$set(message, 'afterSaleInfo', afterSale)
        } else {
          _this.$set(message, 'isOrderOrProduct', '')
        }
        if (_this.chatMessageList.length) {
          const lastVisibleTime = new Date(moment(_this.chatMessageList[_this.chatMessageList.length - 1].creationTime).format('YYYY-MM-DD HH:mm')).getTime()
          if (new Date() - lastVisibleTime <= 30 * 60 * 1000) {
            message.isTimeVisible = false
          }
        }
        _this.chatMessageList.push(message)
        _this.$nextTick(() => {
          _this.$refs.scroll.scrollTop = $('.scrollWrap')[0].offsetHeight
        })
        const messageContent = message.message
        if (messageContent.indexOf('订单') > -1) {
          _this.$set(_this.chatFriendInfo, 'messageContent', '【订单信息】')
        } else if (messageContent.indexOf('商品') > -1) {
          _this.$set(_this.chatFriendInfo, 'messageContent', '【商品信息】')
        } else if (messageContent.indexOf('售后') > -1) {
          _this.$set(_this.chatFriendInfo, 'messageContent', '【商品信息】')
        } else {
          _this.$set(_this.chatFriendInfo, 'messageContent', messageContent)
        }
        _this.chatFriendInfo.time = moment(new Date()).format('HH:mm')
        _this.inputContent = ''
        window.sessionStorage.removeItem('chatFriendInfo')
        _this.dataList.some((item, index) => {
          if (Number(item.friendUserId) === Number(_this.chatFriendInfo.friendUserId)) {
            _this.dataList.splice(index, 1) // 如果聊天列表已经有该聊天对象，先从列表删除
          }
        })
        _this.dataList.unshift(_this.chatFriendInfo) // 将该聊天对象加到数组的第一个
      }
    },
    // 跳转到商品详情页面
    goToProductDetail(item) {
      this.close()
      this.$router.push({
        name: 'ProductDetail',
        query: {
          productId: item.id
        }
      })
    },
    goToOrderDetail(item) {
      this.close()
      this.$router.push({
        name: 'OrderDetail',
        query: {
          id: item.id
        }
      })
    },
    // 跳转到售后详情页面
    goToAfterSaleInfoDetail(item) {
      this.close()
      this.$router.push({
        name: 'AfterSaleDetail',
        query: {
          id: item.id
        }
      })
    },
    // 弹窗显示通知
    showNotification(message) {
      this.$store.dispatch('message/setNotificationMsg', message)
      this.$store.dispatch('message/setNotify', true)
      setTimeout(() => {
        this.$store.dispatch('message/setNotify', false)
      }, 5000)
    }
  }
}
</script>
<style lang="scss">

.ChatFormDialog{
  ul::-webkit-scrollbar {display:none}
  .el-dialog{
    height: 70%;
    overflow: hidden;
  }
  .el-dialog__body{
    height: 100%;
  }
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog__body{
    padding: 0;
    display: flex;
  }
  .left-item{
    width: 25%;
    background: #fff;
    color: #333;
    border-right: 1px solid #DCE2EF;
    display: flex;
    flex-direction: column;
    min-width: 250px;
    img{
      height: 56px;
      width: 56px;
      border-radius: 6px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .my-info{
      background: #FFBA00;
      display: flex;
      align-items: center;
      height: 80px;
      padding:0 15px ;
      flex-shrink: 0;
      div{
        flex: 1;
        color: #fff;
        p{
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        span{
          border: 1px solid #fff;
          border-radius:14px;
          font-size: 12px;
          padding:2px 5px;
        }
      }
    }
    .search-form{
      display: flex;
      padding: 8px 0;
      justify-content: center;
      .el-input{
        width: 85%;
      }
      input{
        background:#DCE2EF;
        height: 35px;
      }
    }
    .message-lists{
      // overflow: hidden;
      flex: 1;
      ul::-webkit-scrollbar {display:none}
      ul{
        overflow-y:scroll;
        height: 100%;
      }
      .selected{
        background: #FFF9EA;
      }
      .list{
        margin-left:15px ;
        padding: 10px 10px 10px 0;
        border-bottom: 1px solid #DCE2EF;
        display: flex;
        align-items: center;
        color: #333;
        position: relative;
        .profile{
        margin-right:10px;
          position: relative;
          img{
            height: 48px;
            width: 48px;
            margin-right: 0;
          }
          span{
            position: absolute;
            font-size: 12px;
            color: #fff;
            background: #F65151;
            top: -5px;
            right: -5px;
            border-radius: 50%;
            padding: 0px 5px;
          }
        }
        .info{
          flex: 1;
          overflow: hidden;
        }
        p{
          position: relative;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        span{
          position: absolute;
          right: 0;
          color: #999;
        }
        p:last-of-type,span{
          color: #999;
        }
        .deleteBtn{
          position: absolute;
          right: 5px;
          top: 45px;
          background: #fff;
          box-shadow:0px 0px 4px 0px rgba(0, 0, 0, 0.2);
          width: 80px;
          text-align: center;
          z-index: 10;
          li{
            line-height: 40px;
          }
          .active{
            background: #FFF9E9;
          }
        }
      }
    }
  }
  .chat-form-wrap{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    border-right: 1px solid #DCE2EF;
    flex: 1;
    h3{
       height: 80px;
      line-height: 80px;
      border-bottom: 1px solid #DCE2EF;
      padding-left: 20px;
    }
    .chat-form{
      overflow: hidden;
      padding: 10px 0;
      flex: 1;
      ul{
        overflow-y: scroll;
        padding: 0 15px ;
        height: 100%;
        .profile{
          height: 40px;
          width: 40px;
          border-radius: 8px;
        }
        i{
          width:10px;
          flex-shrink: 0;
        }
        .time{
          text-align: center;
          margin-bottom: 8px;
        }
        .chat-content-wrap{
          flex: 1;
        }
        .chat-content{
          display: flex;
          margin-bottom: 10px;
          .blank{
            width: 45px;
            flex-shrink: 0;
          }
          .content-wrap{
            display: flex;
            align-items: flex-end;
          }
          .content{
            border:1px solid #DCE2EF;
            position: relative;
            color: #333;
            p{
              word-break: break-all;
              padding: 10px 15px;
            }
          }
          .productInfo{
            display: flex;
            align-items: center;
            color: #333;
            padding: 12px;
            border-radius:8px 0px 8px 8px;
            img{
              width:60px;
              height:60px;
              margin-right: 8px;
            }
            p{
              padding: 0;
            }
            p:first-of-type{
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin-bottom: 10px;
              font-size: 13px;
            }
            .price{
              color: #FFA800;
              span{
                font-size: 18px;
              }
            }
          }
          .orderInfo{
            color: #333;
            padding: 12px;
            border-radius:8px 0px 8px 8px;
            overflow: hidden;
            cursor: default;
            p{
              color: #333;
              margin-bottom: 5px;
              line-height: 15px;
              padding: 0;
              // overflow: hidden;
              // text-overflow: ellipsis;
              // white-space: nowrap;
              font-size: 12px;
            }
            p:last-of-type{
              margin-bottom: 0;
            }
          }
          .isRead,.unRead{
            font-size: 12px;
            position: absolute;
            left: -30px;
            bottom: 0;
          }
          .isRead{
             color: #999;
          }
          .unRead{
            color: #FFBA00;
          }
        }
        .name{
          color: #999;
          font-size: 12px;
        }
      }
    }
    .receiver {
      .productInfo,.orderInfo{
        border-radius:0px 8px 8px 8px;
      }
      .content{
        background: #FFFFFF;
        border-radius:0px 8px 8px 8px;
      }
      .isRead,.unRead{
        display: none;
      }
    }
    .sender{
      .productInfo,.orderInfo{
        border-radius:8px 0px 8px 8px;
      }
      .name{
        text-align: right;
      }
      .chat-content{
        flex-direction: row-reverse;
      }
      .content{
        background: #FFBA00;
        border-radius:8px 0px 8px 8px
      }
      .content-wrap{
        justify-content: flex-end;
      }
    }
    .productOrOrder{
      width: 100%;
      background: #fff!important;
    }
    .input-form{
      height: 150px;
      flex-shrink: 0;
      border-top: 1px solid #DCE2EF;
      padding: 0 5px;
      .icon-form{
        padding: 5px 10px;
        img{
          height: 24px;
          width: 24px;
          margin-right: 5px;
        }
      }
      .el-textarea__inner{
        border: none;
        background: #fff!important;
        resize: none;
      }
    }
  }
  .order-lists{
    width: 25%;
    flex-shrink: 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    min-width: 250px;
    h3{
      color: #333;
      text-align: center;
      height: 80px;
      line-height: 80px;
      border-bottom: 1px solid #DCE2EF;
      font-size: 14px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .orderList{
      flex: 1;
      overflow: hidden;
      padding: 0 15px;
      ul{
        height: 100%;
        overflow-y: scroll;
        padding: 10px 0;
        li{
          background: #fff;
          border-radius: 8px;
          cursor: default;
          .time{
            line-height: 30px;
            text-align: center;
            color: #999;
          }
          .product-wrap{
            border: 1px solid #DCE2EF;
            border-radius: 8px;
            .orderId{
              background: #F4F6F9;
              padding: 10px 15px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #DCE2EF;
              p{
                margin-right: 15px;
              }
              span{
                color: #FFBA00;
                border: 1px dotted #FFBA00;
                border-radius:4px;
                padding: 2px 4px;
                flex-shrink: 0;
              }
            }
            .status{
              line-height: 30px;
              text-align: right;
              padding: 0 15px;
            }
            .productInfo{
              padding: 0 15px;
              display: flex;
              align-items: center;
              img{
                width:88px;
                height:88px;
                border-radius: 8px;
                margin-right: 12px;
              }
              p:first-of-type{
                margin-bottom: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;  // 控制多行的行数
                -webkit-box-orient: vertical;
              }
              .price{
                color: #FFBA00;
                font-size: 18px;
              }
            }
            .btn{
              background: #FFBA00;
              text-align: center;
              line-height: 30px;
              color: #fff;
              border-radius:0px 0px 8px 8px;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }
}

</style>

