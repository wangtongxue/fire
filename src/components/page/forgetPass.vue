<template>
  <div id="login-bg">
    <el-card class="box-card forget-box-card">

      <header class="forget-header">
        <span><i>手机找回</i></span>
      </header>

      <el-form  :model="findForm" :rules="rulesFind" ref="findForm" label-width="100px" class="demo-ruleForm forget-form">
        <el-form-item label="手机号码:" prop="phoneNum">
          <el-input v-model="findForm.phoneNum" type="text" auto-complete="off" id="phoneInput" ></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="code">
          <el-input v-model="findForm.code" type="text"  auto-complete="off"></el-input>
          <el-button type="primary" class="getCode" @click="getCode">{{code}}</el-button>
        </el-form-item>
        <el-form-item label="输入新密码:" prop="password">
          <el-input v-model="findForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirmPassword">
          <el-input v-model="findForm.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item class="forget-btn">
          <el-button type="primary" @click="submitForm('findForm')">确认重置密码</el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/login" class="back_login">返回登录页面</router-link>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
    export default {
      name: "forgetPass",
      data(){
        return {
          code: '获取验证码',
          code_time: 60,
          timer: null,
          codeNum: '',
          findForm: {
            phoneNum: '',
            code: '',
            password: '',
            confirmPassword: ''
          },
          rulesFind: {
            phoneNum: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' },
              { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号' }
            ],
            code: [
              { required: true, message: '请输入短信验证码', trigger: 'blur' },
              { pattern: /^\d{6}$/, message: '请输入6位的短信验证码', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入6-18位，以字母开头的密码（不包含特殊字符）', trigger: 'blur' }
            ],
            confirmPassword: [
              { required: true, message: '请再次输入新密码', trigger: 'blur' },
              { validator: (rule, value, callback) => { // 两次输入的密码必须一致
                if (value !== this.findForm.password) {
                  callback(new Error('两次输入密码不一致!'))
                } else {
                  callback()
                }
                }
              }
            ]
          }
        }
      },
      mounted(){ // 在这个阶段 让输入框直接获取到焦点，然后再点击获取验证码的时候会失去焦点，然后会触发rules
        document.getElementById('phoneInput').focus()
      },
      watch: {
        code_time: function (val, oldVal) {
          if(val == 0){
            this.code = '重新获取'
          }else{
            this.code = val + 's'
          }
        }
      },
      methods: {
        submitForm(formName){
          if(this.findForm.password !== this.findForm.confirmPassword || !this.findForm.phoneNum || !this.findForm.code || !this.findForm.password || !this.findForm.confirmPassword){
            this.msg('请根据输入框提示输入正确信息！', 'error')
          }else {
            const that = this
            $.ajax({
              type: 'post',
              url: that.url+'/api/User/updateUser',
              data: {
                PhoneNumber: that.findForm.phoneNum,
                Password: that.findForm.password,
                Code: that.findForm.code
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                // console.log(response)
                if(JSON.parse(response).status === 1){
                  that.msg(JSON.parse(response).msg, 'success')
                  that.$router.push({path: '/login'})
                  that.$store.commit('curUserPhone', that.findForm.phoneNum)
                  // that.cookiesFn.pssDelCookie('sendCodeTime')
                }else {
                  that.msg(JSON.parse(response).msg, 'error')
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
            // this.$http({
            //   method: 'post',
            //   url: this.url+'/api/User/updateUser',
            //   params: {
            //     PhoneNumber: this.findForm.phoneNum,
            //     Password: this.findForm.password
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then( (response) => {
            //     if(response.data.status === 1){
            //       this.msg(response.data.msg, 'success')
            //       this.$router.push({path: '/login'})
            //       this.$store.commit('curUserPhone', this.findForm.phoneNum)
            //       this.cookiesFn.delCookie('sendCodeTime')
            //     }else {
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch( (error) => {
            //     console.log(error)
            //   })
          }
        },
        // MathRand(){
        //   let Num="";
        //   for (let i=0;i<6;i++) {
        //     Num+=Math.floor(Math.random()*10)
        //   }
        //   return Num
        // },
        getCode(ev){
          clearInterval(this.timer)
          // 当已经输入了手机号
          if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.findForm.phoneNum)){
            if(Boolean(this.cookiesFn.passGetCookie('sendCode'))){ // 当已经发送过验证码，并且还存在时 不允许再次发送，只有当上一次的消失才会再次发送
              this.msg('操作太过频繁，请稍后发送！', 'error')
            }else {
              // this.codeNum = this.MathRand()
              this.$http.get(this.url+'/api/User/sendCode', {
                params: {
                  PhoneNumber: this.findForm.phoneNum,
                  type: 'update'
                }
              })
                .then((response)=>{
                  if(response.data.status == 1) { // 验证码发送成功
                    this.msg(response.data.msg, 'success') // 验证码发送成功的提示框
                    // console.log(this.cookiesFn)
                    this.cookiesFn.passSetCookie('sendCode', true, 1/1440) // 60s后可以再次发送
                    // this.cookiesFn.passSetCookie('sendCodeTime', true, 5/1440) // 5分钟有效期
                    // 这个是对这个按钮的禁止操作处理
                    this.code_time = 60
                    ev.target.parentNode.disabled = true
                    ev.target.style.color = '#ccc'
                    ev.target.style.cursor = 'default'
                    ev.target.parentNode.style.cursor = 'default'
                    const that = this
                    this.timer = setInterval(function () {
                      that.code_time--
                      if(that.code_time <= 0){
                        clearInterval(that.timer)
                        // 还原按钮的操作处理
                        ev.target.parentNode.disabled = false
                        ev.target.style.color = ''
                        ev.target.style.cursor = ''
                        ev.target.parentNode.style.cursor = ''
                      }
                    },1000)
                  }else { // 发送失败
                    this.msg(response.data.msg, 'error')
                  }
                })
                .catch((error)=>{
                  console.log(error)
                })
            }
          }else{
            this.msg('请输入正确的手机号码！', 'error')
          }
          /*
          this.$http.post('', JSON.stringify(this.findForm.phoneNum))
            .then((res) => {
              // 后端传回的数据 得到短信已发送，则
            })
            .catch((error) => {
              console.log(error)
            })*/
        }
      }
    }
</script>

<style scoped>

</style>
