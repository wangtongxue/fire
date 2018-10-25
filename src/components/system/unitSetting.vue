<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > 关联单位</div>
      <div class="public_box">
        <el-form id="unitFormBox" class="owner_form" :rules="rules" :model="ownerForm" ref="ownerForm" label-width="80px">
          <!--第一块-->
          <div class="box1 _owner_box">
            <h4 class="owner_title">业主单位</h4>
            <div class="owner_select">
              <el-form-item class="owner_form_box" label="选择单位" prop="unit">
                <el-select v-model="ownerForm.unit" @change="selectUnitHandle" placeholder="请选择单位" >
                  <el-option v-for="item in unitTableData" :key="item.ID" :label="item.UnitName" :value="item.ID"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!--第二块-->
          <div class="box2 _owner_box">
            <h4 class="owner_title">设置关联单位</h4>
            <div class="owner_select">
              <el-form-item class="owner_form_box" label="经营单位" prop="jingying">
                <el-select v-model="ownerForm.jingying" placeholder="请选择经营单位" >
                  <el-option v-for="item in jingyingTableData" :key="item.ID" :label="item.UnitName" :value="item.ID"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="owner_form_box" label="主管单位" prop="zhuguan">
                <el-select disabled v-model="ownerForm.zhuguan" placeholder="请选择主管单位(当前不可选)">
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="owner_form_box" label="维保单位" prop="weibao">
                <el-select disabled v-model="ownerForm.weibao" placeholder="请选择维保单位(当前不可选)">
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="owner_form_box" label="消防部门" prop="xiaofang">
                <el-select disabled v-model="ownerForm.xiaofang" placeholder="请选择消防部门(当前不可选)">
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="杭州极英信息科技有限公司" value="jiying"></el-option>
                  <el-option label="区域二" value="quyuer"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!--保存 重置-->
          <div class="box4 unitFormBtn">
            <el-form-item>
              <el-button class="unitBtn" type="primary" @click="submitForm('ownerForm')">保存</el-button>
              <el-button  class="unitBtn" @click="resetForm('ownerForm')">重置</el-button>
            </el-form-item>
          </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "unitSetting",
    mounted(){

    },
    data(){
      return {
        showMaskAlert: false,
        state4: '',
        unitTableData: [],
        jingyingTableData: [],
        ownerForm: {
          unit: '',
          weibao: '',
          zhuguan: '',
          jingying: '',
          xiaofang: '',
          // huozaiConnectNum: '0',
          // huozaiDateStart: '',
          // huozaiServerTime: '',
          // huozaiDateEnd: '',
          // dianqiConnectNum: '0',
          // dianqiDateStart: '',
          // dianqiServerTime: '',
          // dianqiDateEnd: '',
          // NBConnectNum: '0',
          // NBDateStart: '',
          // NBServerTime: '',
          // NBDateEnd: '',
          // outroomConnectNum: '0',
          // outroomDateStart: '',
          // outroomServerTime: '',
          // outroomDateEnd: '',
          // videoConnectNum: '0',
          // videoDateStart: '',
          // videoServerTime: '',
          // videoDateEnd: ''
        },
        rules: {
          unit: [
            { required: true, message: '请选择业主单位', trigger: 'change' }
          ],
          jingying: [
            { required: true, message: '请选择经营单位', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) { // 点击提交的时候
        const that = this
        this.$refs[formName].validate((valid) => {
          // console.log(JSON.stringify(that.ownerForm))
          if (valid) {
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/Related_unit/saveRelatedUnit',
              data: {
                UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
                UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
                PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
                OwnerUnitID: this.ownerForm.unit,
                BusinessUnitID: this.ownerForm.jingying
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                // console.log(response.data)
                if(JSON.parse(response).status == 1){ // 保存成功
                  that.msg(JSON.parse(response).msg, 'success')
                  // 保存成功之后，重新请求业主单位数据重新赋值
                  that.$http.get(that.url+'/api/Related_unit/getOwnerUnits', { // 获取业主单位的数据
                    params: {
                      id: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
                    }
                  })
                    .then((response) => {
                      if(response.data.status == 1){
                        that.unitTableData = response.data.data
                      }else {
                        that.msg(response.data.msg, 'error')
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                    })
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
            //   url: this.url+'/api/Related_unit/saveRelatedUnit',
            //   params: {
            //     UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
            //     UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
            //     PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
            //     OwnerUnitID: this.ownerForm.unit,
            //     BusinessUnitID: this.ownerForm.jingying
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     // console.log(response.data)
            //     if(response.data.status == 1){ // 保存成功
            //       this.msg('保存成功', 'success')
            //       // 保存成功之后，重新请求业主单位数据重新赋值
            //       this.$http.get(this.url+'/api/Related_unit/getOwnerUnits', { // 获取业主单位的数据
            //         params: {
            //           id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
            //         }
            //       })
            //         .then((response) => {
            //           if(response.data.status == 1){
            //             this.unitTableData = response.data.data
            //           }else {
            //             this.msg(response.data.msg, 'error')
            //           }
            //         })
            //         .catch((error) => {
            //           console.log(error)
            //         })
            //
            //     }else {
            //       this.msg('保存失败', 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      resetForm(formName) { // 点击重置
        this.$refs[formName].resetFields()
      },
      selectUnitHandle(currentUnitID){ // 当业主单位改变的时候触发
        // console.log(currentUnitID)  // 为业主单位的id
        let currentUnitParentId = this.unitTableData.filter((item) => {
          return item.ID == currentUnitID ? item : ''
        })
        // console.log(currentUnitParentId)
        if(currentUnitParentId){ // 当 当前选择的业主单位的所属经营单位的id存在时
          this.ownerForm.jingying = currentUnitParentId[0].parent_id
        }
      }
    },
    created(){
      this.$http.get(this.url+'/api/Related_unit/getOwnerUnits', { // 获取业主单位的数据
        params: {
          id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            this.unitTableData = response.data.data
          }else {
            this.msg(response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })

      this.$http.get(this.url+'/api/Related_unit/getBusinessUnits', { // 获取经营单位的数据
        params: {
          id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then((response) => {
          if(response.data.data.length){ // 请求的返回值为数组
            return this.jingyingTableData = response.data.data
          }else { // 请求的返回值为对象
            this.jingyingTableData.push(response.data.data)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
</script>

<style scoped>

</style>
