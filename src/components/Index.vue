<template>
    <el-container class="index">
      <!-- header部分 -->
  <el-header>
    <div class="logo">
      <img src="../assets/logo .png" alt="">
    </div>
    <div class="title">
      <h1>电商后台管理系统</h1>
    </div>
    <div class="logoout">
      <span>欢迎光临~ </span>
        <a href="javascript:;" @click="logoout">退出</a>
    </div>
  </el-header>

  <el-container>
    <!-- 导航条部分 -->
    <el-aside width="200px">
      <el-menu
      :default-active="defaultActive"
      router
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

      <el-submenu :index="menu.path" v-for="menu in  menuList" :key="menu.id">
        <template v-slot:title>
          <i class="el-icon-location"></i>
          <span >{{ menu.authName}}</span>
        </template>

          <el-menu-item :index="item.path" v-for= "item in  menu.children" :key="item.id">
            <i class="el-icon-menu"></i>
          <span slot="title">{{item.authName}}</span>
          </el-menu-item>
      </el-submenu>

    </el-menu>
    </el-aside>

    <!-- main部分 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    // console.log(res)
    if (meta.status === 200) {
      // console.log(data)
      this.menuList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logoout () {
      this.$confirm('亲，你确认要退出系统吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch((e) => {
        console.log(e)
      })
    }

  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
 .index {
   height: 100%;

   .el-header{
     background-color: #d8d8d8;
     display: flex;
     .logo {
      width:180px;
      img {
        height:40px;
       margin: 10px;
      }
       }
      .title {
         flex: 1;
         h1 {
           height:60px;
           line-height: 60px;
           text-align: center;
           color:#545c64;
         }
      }
      .logoout {
        width:180px;
        height: 60px;
        line-height: 60px;
        text-align: right;
        font-weight: 700;
        a {
          color:orange;
        }
      }

   }
   .el-aside{
     background-color: #545c64;
     .el-menu {
       border:none;
     }

   }
   .el-main {
     background-color: #ecf0f1;

   }
 }
</style>
