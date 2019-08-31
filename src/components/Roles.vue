<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 添加角色 -->
   <el-button type="success" plain class="addbtn" @click="showadd" >添加角色</el-button>

   <!-- 表格 -->
  <el-table
    :data="roleslist" >
    <el-table-column type="expand">
      <template v-slot:default="{ row }">
     <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
      <!-- 一级权限 -->
      <el-col :span="4">
        <el-tag closable @close="delRoleRights(row,l1.id)">{{l1.authName}}</el-tag>
        <i class="el-icon-arrow-right"></i>
      </el-col>

      <el-col :span="20">
        <el-row   class="l2" v-for="l2 in l1.children" :key="l2.id">
          <!-- 二级权限 -->
          <el-col :span ="4">
              <el-tag type="success" closable @close="delRoleRights(row,l2.id)">{{l2.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
              </el-col>
          <!-- 三级权限 -->
          <el-col :span ="20">
            <el-tag class="l3" v-for="l3 in l2.children"
            :key="l3.id"
            type="warning"
            closable
            @close="delRoleRights(row,l3.id)"> {{l3.authName}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
      </template>
    </el-table-column>

  <el-table-column type="index"></el-table-column>
  <el-table-column  prop = "roleName" label="角色名称"></el-table-column>
  <el-table-column  prop = "roleDesc" label="描述"></el-table-column>
  <el-table-column label="操作">
    <template v-slot:default="{row}">
    <el-button plain size="small" @click="showEditDialog(row)" icon="el-icon-edit" type = "primary"></el-button>
    <el-button plain size="small" @click="delrole(row.id,$event)"  icon="el-icon-delete" type = "danger"></el-button>
    <el-button plain size="small" @click="showlist(row)"  icon="el-icon-check" type = "success">分配权限</el-button>
    </template>
  </el-table-column>
</el-table>

<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="dialogVisible"
  width="50%">
  <!-- 树状图 -->
  <el-tree
  ref="tree"
  node-key="id"
  show-checkbox
  default-expand-all
  :data="data"
  :props="defaultProps">
  </el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="assignRights" >确 定</el-button>
  </span>
</el-dialog>

<!-- 添加和修改的对话框 -->
<el-dialog
  :title="dialogTitle"
  :visible.sync="addVisible"
  @close="closeDialog"
  width="30%">
  <!-- <span>这是一段信息</span> -->
   <el-form ref="form" :model="form" label-width="100px" :rules="rules">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
    </el-form-item>
   </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleslist: [],
      dialogVisible: false,
      addVisible: false,
      data: [],
      dialogTitle: '添加角色',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      form: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getrolesList()
  },
  methods: {
    async  getrolesList () {
      const { data, meta } = await this.$axios.get('roles')
      // console.log(data, meta)
      if (meta.status === 200) {
        // this.$message.success(meta.msg)
        this.roleslist = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRoleRights (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        // this.getrolesList()
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showlist (row) {
      this.dialogVisible = true
      this.roleId = row.id
      const { meta, data } = await this.$axios.get('rights/tree')
      // console.log(meta, data)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      // 获取全选的
      const ids = this.$refs.tree.getCheckedKeys()
      // 获取半选的
      const halfs = this.$refs.tree.getHalfCheckedKeys()

      const rids = [...ids, ...halfs].join()
      // console.log(rids)

      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success('meta.msg')
        // this.data = data
        this.dialogVisible = false
        this.getrolesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async  delrole (id, e) {
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
      try {
        this.$confirm('亲，你确定要删除这个角色么', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        // console.log(res)
        if (meta.status === 200) {
          this.getrolesList()
          // this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showadd () {
      this.addVisible = true
    },
    showEditDialog (row) {
      this.addVisible = true
      this.dialogTitle = '修改角色'
      // 如果第一点击, 直接点修改, 还不能直接回显数据
      // this.$nextTick(函数), 函数会在下次dom更新完成之后, 执行
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    closeDialog () {
      // this.$refs.from.resetFields()
      this.$refs.form.resetFields()
      this.form.id = ''
    },
    async  saveRole () {
      const isadd = this.dialogTitle === '添加角色'
      const url = isadd ? 'roles' : `roles/${this.form.id}`
      const method = isadd ? 'post' : 'put'

      const { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.addVisible = false
        this.getrolesList()
      } else {
        this.$message.error('meta.msg')
      }
    }
  }
}
</script>

<style lang="scss">
.roles
.addbtn {
  margin-bottom: 10px;
}
.l1 {
  margin-bottom: 5px;
}
.l2 {
  margin-bottom: 5px;
}
.l3 {
  margin-bottom: 5px;
  margin-right:5px;
}
</style>
