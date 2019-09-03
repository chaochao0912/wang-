<template>

<div class="categories">

 <!-- 添加按钮 -->
 <el-button type="success" plain class="addbtn" @click="showAdd">添加商品</el-button>

<!-- 表格 -->
  <el-table
  :data="tableList"
  row-key="cat_id"
  style="width:100%">

    <el-table-column label="分类名称" prop="cat_name">
    </el-table-column>

     <el-table-column label="是否有效">
       <template v-slot:default ="{row}">
         {{row.cat_deleted ? "否" : "是"}}
       </template>
    </el-table-column>

     <el-table-column label="排序" prop="cat_level">
    </el-table-column>

     <el-table-column label="操作">
       <template v-slot:default="{row}">
         <el-button plain size="small" icon="el-icon-edit"  type="primary"></el-button>
         <el-button plain size="small" icon="el-icon-delete" type="danger"></el-button>
         </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加分类对话框 -->
  <el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  @close="closeDialog"
  width="40%">

  <el-form ref="form" :model="form" label-width="80px" :rules="rules">
    <el-form-item label="分类名称" prop='cat_name'>
    <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
  </el-form-item>

  <el-form-item label="父级名称" prop="cat_pid">
   <el-cascader
    clearable
    v-model="form.cat_pid"
    :options="options"
    :props="props"></el-cascader>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        cat_pid: [], // 将来选择时, 会拿到一个选中分类id的数组
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true // 可以只选中一级

      },
      options: []
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async   getCategoryList () {
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(data)
      if (meta.status === 200) {
        this.tableList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },
    async showAdd () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      // console.log(res)
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length,
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.categories{
  .addbtn {
    margin-bottom: 10px;
  }
}
</style>
