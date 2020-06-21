<template>
  <div class="container">
    <div class="filter-div">
      <div class="input-group">
        <label>账号</label>
        <el-input v-model="params.email" placeholder="请输入内容" />
      </div>
      <div class="input-group">
        <label>代练时间段</label>
        <el-select v-model="params.代练时间段" placeholder="请选择代练时间段">
          <el-option
            v-for="(item, key) in boostTimeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input-group">
        <label>炉石状态</label>
        <el-select v-model="params.炉石状态" placeholder="请选择炉石状态">
          <el-option
            v-for="(item, key) in lushiStatusList"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input-group">
        <label>是否友谊赛</label>
        <el-select v-model="params.是否自动友谊赛" placeholder="请选是否友谊赛">
          <el-option
            v-for="(item, key) in yeOrNoList"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input-group">
        <label>是否开启挂机</label>
        <el-select v-model="params.开启挂机" placeholder="请选择是否开启挂机">
          <el-option
            v-for="(item, key) in yeOrNoList"
            :key="key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input-group">
        <label>订单编号</label>
        <el-input v-model="params.订单编号" placeholder="请输入内容" />
      </div>
      <div class="input-group">
        <label>余额范围</label>
        <el-input-number
          v-model="params.余额范围起"
          placeholder="余额范围起"
          controls-position="right"
          :min="0"
          :max="100000000"
        />
        <el-input-number
          v-model="params.余额范围止"
          style="margin-left: 10px"
          placeholder="余额范围止"
          controls-position="right"
          :min="0"
          :max="100000000"
        />
        <el-button slot="append" style="margin-left: 10px" icon="el-icon-search" @click="getList" />
      </div>
    </div>
    <el-divider />
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template v-slot="scope">
          <boost-detail :data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
      />
      <el-table-column
        prop="账号"
        label="账号"
        width="180"
      />
      <el-table-column
        prop="代练内容"
        label="代练内容"
      />
      <el-table-column
        prop="付款金额"
        label="付款金额"
      />
      <el-table-column
        prop="备注"
        label="备注"
      />
      <el-table-column
        prop="address"
        label="代练时间段"
      >
        <template v-slot="scope">
          {{ scope.row.代练时间段起 }}-{{ scope.row.代练时间段止 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="上次读取时间"
        label="上次读取时间"
      >
        <template v-slot="scope">
          {{ scope.row.上次读取时间|dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="上次挂满金币时间"
      >
        <template v-slot="scope">
          {{ scope.row.上次完成时间|dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="上次友谊赛时间"
      >
        <template v-slot="scope">
          {{ scope.row.上次友谊赛时间|dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="是否自动友谊赛"
        label="是否自动友谊赛"
      >
        <template v-slot="scope">
          {{ scope.row.是否自动友谊赛 ? '是': '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="开启挂机"
      >
        <template v-slot="scope">
          {{ scope.row.开启挂机 ? '是': '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="友谊赛场次"
        label="友谊赛场次"
      />
      <el-table-column
        prop="累计获得友谊赛奖励"
        label="累计友谊赛奖励"
      />
      <el-table-column
        prop="炉石账号余额"
        label="炉石账号余额(KB)"
      />
      <el-table-column
        prop="累计获得炉石金币数量"
        label="累计挂满金币数量"
      />
      <el-table-column
        prop="炉石状态"
        label="炉石状态"
      />
    </el-table>
  </div>
</template>

<script>
import * as hSDLAccInfoApi from '@/api/hSDLAccInfo'
import BoostDetail from './components/BoostDetail'
export default {
  name: 'Index',
  components: { BoostDetail },
  data() {
    return {
      list: [],
      params: {
        email: '',
        maxResultCount: 10,
        skipCount: 0,
        sorting: '上次读取时间 DESC',
        代练时间段: '',
        余额范围止: 1000000,
        余额范围起: 0,
        开启挂机: '',
        是否自动友谊赛: '',
        炉石状态: '',
        订单编号: ''
      },
      boostTimeList: [
        { label: '全部', value: null },
        { label: '0-6', value: '0-6' },
        { label: '6-12', value: '6-12' },
        { label: '12-18', value: '12-18' },
        { label: '18-24', value: '18-24' }
      ],
      lushiStatusList: [
        { label: '全部', value: null },
        { label: '被封', value: '被封' },
        { label: '登录信息有误', value: '登录信息有误' },
        { label: '等待客服验号', value: '等待客服验号' },
        { label: '等待客服处理', value: '等待客服处理' },
        { label: '已完成', value: '已完成' },
        { label: '正常', value: '正常' },
        { label: '已清理', value: '已清理' }
      ],
      yeOrNoList: [
        { label: '全部', value: null },
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      hSDLAccInfoApi.GetPagedHSDLAccInfosAsync(this.params).then(res => {
        this.list = res.data.result.items
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 20px;
}
</style>
