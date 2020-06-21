<template>
  <div class="boost-detail">
    <table class="boss-table">
      <tr>
        <td>id</td>
        <td>{{ data.id }}</td>
      </tr>
      <tr>
        <td>账号</td>
        <td>{{ data.账号 }}</td>
      </tr>
      <tr>
        <td>密码</td>
        <td>{{ data.密码 }}</td>
      </tr>
      <tr>
        <td>ST值</td>
        <td>{{ data.sT值 }}</td>
      </tr>
      <tr>
        <td>代练内容</td>
        <td>{{ data.代练内容 }}</td>
      </tr>
      <tr>
        <td>价格(1G)</td>
        <td>{{ data.价格 }}</td>
      </tr>
      <tr>
        <td>炉石账号余额</td>
        <td>{{ data.炉石账号余额 }}</td>
      </tr>
      <tr>
        <td>联系方式</td>
        <td>{{ data.联系方式 }}</td>
      </tr>
      <tr>
        <td>所属用户</td>
        <td>{{ data.所属用户 }}</td>
      </tr>
      <tr>
        <td>所属客服</td>
        <td>{{ data.所属客服 }}</td>
      </tr>
    </table>
    <table class="boss-table">
      <tr>
        <td>备注</td>
        <td>{{ data.备注 }}</td>
      </tr>
      <tr>
        <td>代练时间段</td>
        <td>{{ data.代练时间段起 }} - {{ data.代练时间段止 }}</td>
      </tr>
      <tr>
        <td>上次读取时间</td>
        <td>{{ data.上次读取时间|dateFormat }}</td>
      </tr>
      <tr>
        <td>上次完成时间</td>
        <td>{{ data.上次完成时间|dateFormat }}</td>
      </tr>
      <tr>
        <td>上次友谊赛时间</td>
        <td>{{ data.上次友谊赛时间|dateFormat }}</td>
      </tr>
      <tr>
        <td>是否自动友谊赛</td>
        <td>{{ data.是否自动友谊赛 ? '是' : '否' }}</td>
      </tr>
      <tr>
        <td>开启挂机</td>
        <td>{{ data.开启挂机 ? '是' : '否' }}</td>
      </tr>
      <tr>
        <td>付款信息</td>
        <td>{{ data.付款信息 }}</td>
      </tr>
      <tr>
        <td>付款金额</td>
        <td>{{ data.付款金额 }}</td>
      </tr>
    </table>
    <table class="boss-table">
      <tr>
        <td>当前炉石金币数量</td>
        <td>{{ data.当前炉石金币数量 }}</td>
      </tr>
      <tr>
        <td>累计获得炉石金币数量</td>
        <td>{{ data.累计获得炉石金币数量 }}</td>
      </tr>
      <tr>
        <td>累计获得友谊赛奖励</td>
        <td>{{ data.累计获得友谊赛奖励 }}</td>
      </tr>
      <tr>
        <td>炉石状态</td>
        <td>{{ data.炉石状态 }}</td>
      </tr>
      <tr>
        <td>创建时间</td>
        <td>{{ data.creationTime|dateFormat }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BoostDetail',
  props: {
    data: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.boost-detail{
  display: flex;
  flex-wrap: wrap;
  table{
    flex: 1;
    max-width: 300px;
    margin-right: 20px;
    td:first-child{
      background: #EDF3F4;
      width: 120px;
    }
  }
}
</style>
