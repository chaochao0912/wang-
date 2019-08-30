<template>
  <div class="user">

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
    <el-button slot="append" @click="searchUser" icon="el-icon-search"></el-button>
  </el-input>
  <el-button type="success" class="addbtn" plain  @click="showAdd">添加用户</el-button>

    <!-- 表格 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

       <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <!-- element-ui组件在slot中, 添加 row, column, $index 和 store 这些数据
               这些数据都会以属性的方式, 添加到一个对象中, 可以通过 = 接收
          -->
          <!-- {{ obj.row }}  row 就是当前组件中遍历的这一条数据的对象信息 -->
          <el-switch
          @change="changeState(obj.row)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>

        </template>
      </el-table-column>

      <el-table-column  label="操作">
        <template v-slot:default="obj">
        <el-button  plain  size="small" type="primary" icon="el-icon-edit" @click="showEdit(obj.row)"></el-button>
        <el-button  plain  size="small" type="danger" icon="el-icon-delete" @click="showDele(obj.row.id)"></el-button>
        <el-button  plain  size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="block"> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

<!-- 添加用户 -->
     <el-dialog
      title="添加用户"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="40%">

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="40%">

      <el-form ref="Editform" :model="Editform" :rules="rules" label-width="80px">
        <el-form-item label="用户名" >
          <el-tag type="info">{{ Editform.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input placeholder="请输入邮箱" v-model="Editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" >
          <el-input placeholder="请输入手机号" v-model="Editform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在3到12个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在3到12个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      Editform: {
        id: '',
        username: '',
        mobile: '',
        email: ''

      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(data.meta)
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 每页条数的变化
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      // 每页条数为val
      this.pagesize = val
      // 将当前页重新渲染为第一页
      this.pagenum = 1
      this.getUserList()
    },
    // 当前页变化时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      // const { meta } = res.data
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
    },
    showAdd () {
      this.dialogVisible = true
    },
    closeDialog () {
      // console.log('对话框关闭了')
      this.$refs.form.resetFields()
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        // console.log('校验成功')
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
        } else {
          this.$message.error(meta.mag)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEdit (row) {
      console.log(row)
      this.editVisible = true
      this.Editform.id = row.id
      this.Editform.username = row.username
      this.Editform.email = row.email
      this.Editform.mobile = row.mobile
    },
    async edituser () {
      try {
        await this.$refs.Editform.validate()
        // console.log('成功')
        const { id, email, mobile } = this.Editform
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showDele (id) {
      try {
        await this.$confirm('你确定要删除么', '温馨提示', {
          type: 'warning'
        })
        // console.log('确认删除')
        const { meta } = await this.$axios.delete(`users/${id}`)
        // console.log(data)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log('取消删除')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user
.input-with-select{
  width: 300px;
  margin-bottom: 10px;
}
.addbtn{
  margin-left: 60px;
}
</style>
