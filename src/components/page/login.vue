<template>
  <div id="login-bg">
    <el-card class="box-card" id="box-card">
      <header class="login-header">
        <span>欢迎登录</span>
      </header>

      <el-form id="login-from" :model="loginForm" :rules="rules1" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="" prop="PhoneNumber">
          <img src="../../assets/img/login-head.png" alt="">
          <el-input v-model="loginForm.PhoneNumber" auto-complete="off" id="phoneInput" @keyup.enter.native="phoneEnterHandle"></el-input>
        </el-form-item>
        <el-form-item label="" prop="Password">
          <img src="../../assets/img/login-pass.png" alt="">
          <el-input type="password" id="pass" v-model="loginForm.Password" auto-complete="off" @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item class="log">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/forgetpass" id="forget-pass">忘记密码？</router-link>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="width: 0; height: 0; overflow: hidden;"><mapDrag  MapStyle="amap://styles/darkblue"></mapDrag></div>
  </div>
</template>

<script type="es6">
  import mapDrag from '../map/map'
  export default {
    name: "login",
    components: {
      mapDrag
    },
    data(){
      return {
        loginForm: {
          PhoneNumber: '' || this.$store.state.userPhone,
          Password: ''
        },
        rules1: {
          PhoneNumber: [
            { required: true, message: '请输入正确的用户名', trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的用户名'}
          ],
          Password: [
            { required: true, message: '请输入正确的密码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入正确的密码' }
          ]
        }
      }
    },
    mounted(){ // 在这个阶段 让输入框直接获取到焦点，然后再点击获取验证码的时候会失去焦点，然后会触发rules
      document.getElementById('phoneInput').focus()
    },
    methods: {
      submitForm(formName) { // ww-登录的事件处理函数
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('getUserInfo', this)
          } else {
            this.msg('请输入正确的用户名和密码！', 'error')
            return false
          }
        })
      },
      phoneEnterHandle(ev){ // 账号框 点击enter
        if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.loginForm.PhoneNumber)){ /// 当输入的是正确的手机号格式的时候
          document.querySelector('#pass').focus()
        }else {
          return this.msg('请输入手机账号', 'error')
        }
      }
    }
  }
</script>

<style scoped>

</style>
