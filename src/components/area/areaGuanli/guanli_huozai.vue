<template>
    <div class="guanli_huozai_box">
      <div class="guanli_huozai_main_box">
        <div class="box_head">
          <h4>用户信息传输装置</h4>
        </div>
        <div class="box_body">
          <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设备编码" prop="DeviceSn">
              <el-input type="text" v-model="ruleForm2.DeviceSn" ></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="Model">
              <el-input type="text" v-model="ruleForm2.Model" ></el-input>
            </el-form-item>
            <el-form-item label="厂家" prop="Manufacturer">
              <el-input type="text" v-model="ruleForm2.Manufacturer"></el-input>
            </el-form-item>
            <el-form-item label="传输方式" prop="TransferMode">
              <el-input type="text" v-model.number="ruleForm2.TransferMode"></el-input>
            </el-form-item>
            <el-form-item label="设备电话" prop="PhoneNumber">
              <el-input type="text" v-model.number="ruleForm2.PhoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="IPadress">
              <el-input type="text" v-model="ruleForm2.IPadress"></el-input>
            </el-form-item>
            <el-form-item class="guanli_huozai_btn">
              <el-button class="huozai_btn" type="primary" @click="saveForm('ruleForm2')">[保存]</el-button>
              <el-button class="huozai_btn"  type="primary" @click="deleteForm('ruleForm2')">[删除]</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--<input type="text" style="border: 0; background: rgba(0,0,0,0); outline: none; border-bottom: 1px solid #71c7d5; color: #fff; padding: 0 5px">-->
    </div>
</template>

<script>
    export default {
      name: "guanli_huozai",
      data(){
        return {
          ruleForm2: {
            DeviceID: '',
            DeviceSn: '',
            Model: '',
            Manufacturer: '',
            TransferMode: '',
            PhoneNumber: '',
            IPadress: ''
          },
          rules: {
            DeviceSn: [
              {required: true, message: '请输入设备编码', trigger: 'change'}
            ],
            Model: [
              {required: true, message: '请输入型号', trigger: 'change'}
            ],
            Manufacturer: [
              {required: true, message: '请输入厂家', trigger: 'change'}
            ],
            TransferMode: [
              {required: true, message: '请输入传输', trigger: 'change'}
            ],
            PhoneNumber: [
              {required: true, message: '请输入设备电话', trigger: 'change'}
            ],
            IPadress: [
              {required: true, message: '请输入IP地址', trigger: 'change'},
              { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '请输入正确格式的IP地址' }
            ]
          }
        }
      },
      created(){
        // 在创建阶段发送axios请求得到数据 进行渲染
      },
      mounted(){
        this.$http.get(this.url+'/api/Device/DeviceInfo', {
          params: {
            UnitID: sessionStorage.getItem('areaID')
          }
        })
          .then((response) => {
            // console.log(response)
            if(response.data.status == 1){
              this.ruleForm2 = response.data.data
            }else {
              this.msg('当前单位暂无用户信息传输装置数据信息', 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      methods: {
        saveForm(formName) {
          // console.log(this.ruleForm2)
          const that = this
          this.$refs[formName].validate((valid) => {
            console.log(this.ruleForm2.IPadress)
            if (valid) {
              $.ajax({
                type: 'post',
                url: this.url+'/api/Device/addDevice',
                data: {
                  UnitID: sessionStorage.getItem('areaID'),
                  UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
                  PhoneNumber: this.ruleForm2.PhoneNumber,
                  DeviceSn: this.ruleForm2.DeviceSn,
                  Model: this.ruleForm2.Model,
                  Manufacturer: this.ruleForm2.Manufacturer,
                  TransferMode: this.ruleForm2.TransferMode,
                  IPadress: this.ruleForm2.IPadress,
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                success: function (response) {
                  if(JSON.parse(response).status == 1){
                    that.msg(JSON.parse(response).msg, 'success')
                  }else {
                    that.msg(JSON.parse(response).msg, 'error')
                  }
                },
                error: function (error) {
                  console.log(error)
                }
              })
              // this.msg('保存成功', 'success')
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        deleteForm(formName) {
          if(this.ruleForm2.DeviceID){
            this.$confirm('此操作将会删除此装置信息, 是否继续?', {
              title: '提示框',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {// 在此处想后端发送数据 在数据库中进行删除
              this.$http.get(this.url+'/api/Device/delDecvice', {
                params: {
                  DeviceID: this.ruleForm2.DeviceID
                }
              })
                .then((response) => {
                  if(response.data.status == 1){
                    this.msg(response.data.msg, 'success')
                    this.$refs[formName].resetFields()
                  }else {
                    this.msg(response.data.msg, 'error')
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            }).catch(() => {
              this.msg('已取消删除', 'info')
            })
          }else {
            this.msg('当前不可删除', 'error')
          }
        }
      }
    }
</script>

<style scoped>

</style>
