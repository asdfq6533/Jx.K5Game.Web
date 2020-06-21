import request from '@/utils/request'
/**
 * 消息
 * @param data
 */

// 获取消息列表
export function GetPagedCommoditiesAsync(data) {
  return request({
    url: 'api/services/app/notification/GetUserNotifications',
    method: 'post',
    data
  })
}

// 获取所有通知
export const GetDiffNotifications = (data) => {
  return request({
    url: '/api/services/app/chat/GetDiffNotifications',
    method: 'post',
    data
  })
}

// 获取好友列表
export const GetUserChatFriends = (data) => {
  return request({
    url: '/api/services/app/chat/GetUserChatFriendsWithSettings',
    method: 'post',
    data
  })
}

// 获取与好友的消息列表
export const GetUserChatMessages = (data) => {
  return request({
    url: '/api/services/app/chat/GetUserChatMessages',
    method: 'post',
    data
  })
}

// 将所有未读消息标记为已读
export const MarkAllUnread = (data) => {
  return request({
    url: '/api/services/app/chat/MarkAllUnreadMessagesOfUserAsRead',
    method: 'post',
    data
  })
}
// 获得所有消息以及通知列表（所有类型消息的最新一条）
export const GetDiffTypeLatestMessage = (data) => {
  return request({
    url: '/api/services/app/chat/GetDiffTypeLatestMessage',
    method: 'post',
    data
  })
}

// 获得所有通知
export const GetAllNotification = (data) => {
  return request({
    url: '/api/services/app/chat/GetAllNotification',
    method: 'post',
    data
  })
}

// 删除通知
export const DeleteNotification = (data) => {
  return request({
    url: '/api/services/app/chat/DeleteNotification',
    method: 'post',
    data
  })
}

// 删除好友聊天记录
export const DeleteAFriendChatHistory = (data) => {
  return request({
    url: '/api/services/app/chat/DeleteAFriendChatHistory',
    method: 'post',
    data
  })
}

