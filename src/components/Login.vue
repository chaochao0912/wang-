<template>
  <div class="login">
    <el-form :model="form" :rules="rules" status-icon label-width="80px" ref="form">
      <img class="logo" src="../assets/2.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="loginb">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        uesrname: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '长度请在3到5个字符之间',
            tigger: '[change,blur]'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度请在3到16个字符之间',
            tigger: '[change,blur]'
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async  loginb () {
      try {
        await this.$refs.form.validate()
        const { data, meta } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          console.log(meta.msg)
          localStorage.setItem('token', data.token)
          this.$message({
            message: meta.msg,
            type: 'success',
            duration: 1000
          })
          this.$router.push({ name: 'index' })
        }
      } catch (e) {
        console.log(e)
      }
    }
    // loginb () {
    //   this.$refs.form.validate(isValid => {
    //     if (!isValid) return
    //     console.log('发送请求')
    //     this.$axios.post('login', this.form).then(res => {
    //       console.log(res)
    //       const { meta, data } = res.data
    //       if (meta.status === 200) {
    //         // 成功, 跳转到首页
    //         console.log(meta.msg)
    //         // (1) 直接默认提示
    //         // this.$message(meta.msg)
    //         // 把token 存到本地存储
    //         localStorage.setItem('token', data.token)
    //         // (2) 配置具体的提示
    //         this.$message({
    //           message: meta.msg,
    //           type: 'success',
    //           duration: 1000
    //         })

    //         // 跳转到首页, 需要有首页组件
    //         // this.$router.push('/index') // 通过path进行跳转
    //         this.$router.push({ name: 'index' })
    //       } else {
    //         // 失败, 给用户提示
    //         // console.log(meta.msg)
    //         // this.$message({
    //         //   message: meta.msg,
    //         //   type: 'error',
    //         //   duration: 1000
    //         // })

    //         // (3) 直接配置提示的类型, 进行提示
    //         this.$message.error(meta.msg)
    //       }
    //     })
    //   })
    // }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    margin: 0 auto;
    background-color: #fff;
    margin-top: 200px;
    position: relative;

    .logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 5px solid #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      top: -70px;
    }
    .loginBtn {
      margin-right: 70px;
    }
  }
}
</style>
