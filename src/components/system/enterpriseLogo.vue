<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > 企业标识</div>
    <div class="public_box">
      <div id="enpriseBox">
        <h5>公司基本信息</h5>
        <div class="enpriseMainBox">
          <div class="enpriseMainBoxTop">
            <div class="comNameBox">
              <span class="comTitle">公司名称：</span>
              <input type="text" disabled v-model="unitName">
            </div>
            <div class="picBox">
              <span class="comTitle">公司logo：</span>
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="imageUrl"
                :data="unitID"
                name="image"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :on-success="handleSuccess"
                :on-error="handleError"
                :file-list="fileList"
                :auto-upload="false"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
              >
                <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb（最佳像素：100*40）</div>
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button class="enpriseMainBoxBtn" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">保存</el-button>
              </el-upload>
                <!--<el-button class="enpriseMainBoxBtn" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">保存</el-button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "enterpriseLogo",
    computed: {
      unitName(){
        return JSON.parse(this.cookiesFn.getCookie('UserInfo')).unit_name
      },
      imageUrl(){
        return this.url + '/api/Unit/logo_upload'
      }
    },
    data(){
      return {
        fileList: [{
          name: 'default.jpg',
          url: JSON.parse(this.cookiesFn.getCookie('UserInfo')).logo_path
        }],
        unitID: {
          UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      }
    },
    methods: {
      handleSuccess(response, file, fileList){ // 文件上传成功时触发的函数
        console.log(response.data)
        let userInfo = JSON.parse(this.cookiesFn.getCookie('UserInfo'))
        userInfo.logo_path = response.data
        this.cookiesFn.setCookie('UserInfo', JSON.stringify(userInfo)) // 这三部重新将地址存进去
        this.$store.commit('setLogoPath', response.data)
        this.fileList = [{
          name: 'default.jpg',
          url: response.data
        }]
        this.msg('上传成功', 'success')
      },
      handleError(){ // 文件上传失败时触发的函数
        this.fileList = [{
          name: 'default.jpg',
          url: require('../../assets/img/logo.jpg')
        }]
      },
      handleChange(file, fileList){ // 保证每次上传一个
        this.fileList=fileList.slice(-1)
      },
      submitUpload() { // 点击保存上传到服务器的时候，判断，若满足限制，则进行上传 否则不上传
        if(!this.beforeAvatarUpload) {
          return
        }else if(this.fileList[0].url == JSON.parse(this.cookiesFn.getCookie('UserInfo')).logo_path){
          return this.msg('请选择要上传的Logo', 'error')
        }
        console.log(this.fileList[0].url)
        this.$refs.upload.submit()
      },
      handleRemove(file, fileList) { // 当上传的图片不满足限制的时候，将默认图片进行重新的赋值
        this.fileList = [{
          name: 'default.jpg',
          url: JSON.parse(this.cookiesFn.getCookie('UserInfo')).logo_path
        }]
      },
      beforeAvatarUpload(file) { //  对上传的图片进行限制
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt20kb = file.size / 1024 / 1024 < 0.2

        if (!isJPG && !isPNG) {
          this.msg('上传头像图片只能是 JPG/PNG 格式!', 'error')
        }
        if (!isLt20kb) {
          this.msg('上传头像图片大小不能超过 200kb !', 'error')
        }
        let isType = isJPG || isPNG
        return isType && isLt20kb
      }
    }
  }
</script>

<style scoped>

</style>
