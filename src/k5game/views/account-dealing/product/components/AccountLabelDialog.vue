<template>
  <el-dialog class="my-dialog" title="批量设置标签" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm">
        <el-form-item label="游戏" :label-width="formLabelWidth">
          <el-select v-model="gameId" placeholder="请选择" style="max-width: 200px">
            <el-option
              v-for="item in allGames"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="roleType !== 1" label="游戏标签" :label-width="formLabelWidth">
          <div class="input-group select-group">
            <el-select v-model="selectedLabel2" multiple placeholder="请选择">
              <el-option
                v-for="(item, key) in accountGameLabelList2"
                :key="key"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item v-if="roleType !== 0" label="批量出售" :label-width="formLabelWidth">
          <div class="input-group select-group">
            <el-select v-model="selectedLabel1" multiple placeholder="请选择">
              <el-option
                v-for="(item, key) in accountGameLabelList"
                :key="key"
                :label="item.name + `（${item.packagePrice}）`"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import accountMixin from '@/k5game/mixins/account-mixin'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as accountPackageApi from '@/api/accountPackage'
import * as accountTransactionApi from '@/api/account-transaction'
import { mapGetters } from 'vuex'
export default {
  name: 'AccountLabelDialog',
  mixins: [dialogMixin, accountMixin],
  data() {
    return {
      allGames: [],
      gameId: '',
      accountGameLabelList: [],
      accountGameLabelList2: [],
      selectedLabel1: [],
      selectedLabel2: [],
      formLabelWidth: '100px',
      form: {
        accountIds: [],
        accountLableIds: []
      }
    }
  },
  computed: {
    ...mapGetters(['roleType'])
  },
  watch: {
    gameId(newValue) {
      if (newValue) {
        this.selectedLabel1 = []
        this.selectedLabel2 = []
        accountPackageApi.GetGameLable({ gameId: newValue }).then(res => {
          const items = res.data.result.items
          this.accountGameLabelList = []
          this.accountGameLabelList2 = []
          items.map(item => {
            if (item.isBestStart && item.parentId) {
              this.accountGameLabelList.push(item)
            } else if (!item.isBestStart) {
              this.accountGameLabelList2.push(item)
            }
          })
        })
      }
    }
  },
  mounted() {
    this.getAllGames()
  },
  methods: {
    setValues(list) {
      this.selectedLabel1 = []
      this.selectedLabel2 = []
      this.form.accountIds = list
    },
    submitClick() {
      this.dialogFormVisible = false
      this.form.accountLableIds = this.selectedLabel1.concat(this.selectedLabel2)
      accountTransactionApi.SetLab(this.form).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('onRefresh')
          this.dialogFormVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>
