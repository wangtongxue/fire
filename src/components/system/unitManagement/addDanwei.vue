<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > <router-link style="cursor: pointer" to="/system/unitManagement" tag="a">单位管理</router-link> > 添加单位</div>
    <div class="public_box">
      <el-form :model="ruleForm" class="unitManagement"  :rules="rules" ref="ruleForm" label-width="100px">
        <div class="unitManagement_type">
            <el-form-item label="单位类型:" prop="type">
              <el-radio-group  v-model="ruleForm.type">
                <el-radio :disabled="!getTypeOfUnit" label="业主单位"></el-radio>
                <el-radio :disabled="getTypeOfUnit" label="经营单位"></el-radio>
                <el-radio disabled label="维保单位"></el-radio>
                <el-radio disabled label="主管单位"></el-radio>
                <el-radio disabled label="物业单位"></el-radio>
                <el-radio disabled label="消防部门"></el-radio>
              </el-radio-group>
            </el-form-item>
        </div>
        <div class="unitManagement_information">
          <div class="unitManagement_addUnit_info el-form-item__label"><span style="color: #f56c6c;">*</span> 基本信息:</div>
          <div class="unitManagement_addUnit_box">
              <el-form-item label="单位名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入单位名称"></el-input>
              </el-form-item>
            <div class="unitManagement_addUnit_ad">
              <div class="unitManagement_addUnit_address_set"><span style="color: #f56c6c;">*</span> 地址</div>
              <el-select @focus="selectProvinceHandle" @change="haveSelectedProvinceHandle" v-model="selectObj.value6" placeholder="请选择省份" style=" width: 200px; margin-left: 11px; margin-top: 5px;">
                <el-option
                  v-for="item in selectObj.provinces"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  <span style="float: left;">{{ item.name }}</span>
                </el-option>
              </el-select>
              <el-select class="selectDizhi" @focus="selectCityHandle" @change="haveSelectedCityHandle" :disabled="selectObj.two" v-model="selectObj.value7" placeholder="请先选择省份" style=" width: 200px; margin-left: 11px; margin-top: 5px;">
                <el-option
                  v-for="item in selectObj.cities"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  <span style="float: left;">{{ item.name }}</span>
                </el-option>
              </el-select>
              <el-select class="selectDizhi" @focus="selectDisHandle" @change="haveSelectedDisHandle" :disabled="selectObj.three" v-model="selectObj.value8" placeholder="请先选择市" style=" width: 200px; margin-left: 11px; margin-top: 5px;">
                <el-option
                  v-for="item in selectObj.district"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  <span style="float: left;">{{ item.name }}</span>
                </el-option>
              </el-select>
              <el-select class="selectDizhi" @focus="selectStreetHandle" @change="haveSelectedStreetHandle" :disabled="selectObj.four" v-model="selectObj.value9" placeholder="请先选择区" style=" width: 200px; margin-left: 11px; margin-top: 5px;">
                <el-option
                  v-for="item in selectObj.streets"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  <span style="float: left;">{{ item.name }}</span>
                </el-option>
              </el-select>
            </div>
            <el-form-item label="详细地址" prop="address">
              <el-input placeholder="请输入详细地址" v-model="ruleForm.address">
              </el-input>
            </el-form-item>
              <div class="unitManagement_addUnit_map"><span style="color: #f56c6c;">*</span> 地图&nbsp;&nbsp;<span style="margin-left: 10px">点击地图确认标点</span>
                <img @click="showBigMapHandle" class="unitManagement_addUnit_map_cha" src="../../../assets/img/smallMap.jpg" alt="">
              </div>
          </div>
        </div>
        <div class="unitManagement_contacts">
          <div class="unitManagement_addUnit_set el-form-item__label"><span style="color: #f56c6c;">*</span>  添加管理员:</div>
          <div class="unitManagement_addUnit_add">
            <el-form-item label="管理员" prop="people">
              <el-input v-model="ruleForm.people" placeholder="请输入管理员姓名"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="photo">
              <el-input v-model="ruleForm.photo" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item class="unitManagement_addUnit_add_mima" label="初始密码" prop="Password">
              <el-input type="password"  v-model="ruleForm.Password" placeholder="请输入6-18位，以字母开头的密码（不包含特殊字符）"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="unitManagement_confirm">
            <el-form-item class="unitManagement_addUnit_enter">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </div>
      </el-form>
    </div>
    <div id="mapContainer" v-show="bigMapState">
      <mapDrag class="addMapBox" :lat="lat" :lng="lng" :pos="true" MapStyle="amap://styles/normal"></mapDrag>
    </div>
  </div>
</template>

<script>
  import mapDrag from '../../map/map'
  export default {
    name: "addDanwei",
    computed: {
      bigMapState(){
        return this.$store.state.showBigMap
      },
      getLngLat(){ // 点击标记之后的坐标位置
        return this.$store.state.markerLatLng
      },
      getTypeOfUnit(){
        if(JSON.parse(this.cookiesFn.getCookie('UserInfo')).TypeOfUnit == 0){ // 当是0的时候显示 业主和经营两个单位类型
          return false
        }else if (JSON.parse(this.cookiesFn.getCookie('UserInfo')).Permission == 1){ //当时1的时候 只显示业主单位类型
          return true
        }
      }
    },
    components: {
      mapDrag
    },
    methods: {
      selectProvinceHandle(){ // 选中省份的输入框
        this.$http.get(this.url+'/api/Unit/getProvinces', {
          params: {
            type: 1
          }
        })
          .then((response) => {
            console.log(response)
            if(response.data.status == 0){
              this.msg(response.data.msg, 'error')
            }else if(response.data.status == 1){
              this.selectObj.provinces = response.data.data
              this.selectObj.provinces.forEach((item) => {
                item.value = item.id
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      haveSelectedProvinceHandle(parent_id){ // 选中省份之后触发的函数

        this.selectObj.three = true// 每次选择省份 都禁用区，并让市区都为空
        this.selectObj.four = true
        this.selectObj.value7 = ''
        this.selectObj.value8 = ''
        this.selectObj.value9 = ''

        this.selectObj.two = false
        this.selectObj.provinceID = parent_id
        console.log(parent_id)
          // console.log(parent_id) 参数为当前选择的省份 id
        // }

      },
      selectCityHandle(){ // 选择市触发的函数
        this.$http.get(this.url+'/api/Unit/getProvinces', {
          params: {
            type: 2,
            parent_id: this.selectObj.provinceID
          }
        })
          .then((response) => {
            console.log(response)
            if(response.data.status == 0){
              this.msg(response.data.msg, 'error')
            }else if(response.data.status == 1){
              this.selectObj.cities = response.data.data
              this.selectObj.cities.forEach((item) => {
                item.value = item.id
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      haveSelectedCityHandle(parent_id){ // 选中市以后触发的函数
        this.selectObj.four = true
        this.selectObj.value8 = ''
        this.selectObj.value9 = ''
        this.selectObj.three = false
        this.selectObj.cityID = parent_id
        // console.log(parent_id) 参数为当前选择的市 id
        console.log(parent_id)
      },
      selectDisHandle(){ // 选中区之后触发的函数
        this.$http.get(this.url+'/api/Unit/getProvinces', {
          params: {
            type: 3,
            parent_id: this.selectObj.cityID
          }
        })
          .then((response) => {
            console.log(response)
            if(response.data.status == 0){
              this.msg(response.data.msg, 'error')
            }else if(response.data.status == 1){
              this.selectObj.district = response.data.data
              this.selectObj.district.forEach((item) => {
                item.value = item.id
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      haveSelectedDisHandle(parent_id){ // 选中区以后触发的函数
        this.selectObj.four = false
        this.selectObj.value9 = ''
        this.selectObj.disID = parent_id
        // console.log(parent_id) 参数为当前选择的区 id
        console.log(parent_id)
      },
      selectStreetHandle(){ // 选中区之后触发的函数
        this.$http.get(this.url+'/api/Unit/getProvinces', {
          params: {
            type: 4,
            parent_id: this.selectObj.disID
          }
        })
          .then((response) => {
            console.log(response)
            if(response.data.status == 0){
              this.msg(response.data.msg, 'error')
            }else if(response.data.status == 1){
              this.selectObj.streets = response.data.data
              this.selectObj.streets.forEach((item) => {
                item.value = item.id
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      haveSelectedStreetHandle(parent_id){ // 选中区以后触发的函数
        this.selectObj.streetID = parent_id
        // console.log(parent_id) 参数为当前选择的区 id
        console.log(parent_id)
      },
      showBigMapHandle(){ // 点击显示大地图
        this.$store.commit('changeShowBigMap', true)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.selectObj.value6 && this.selectObj.value7 && this.selectObj.value8 && this.selectObj.value9 && this.$store.state.markerLatLng.Lat && this.$store.state.markerLatLng.Lng) {// 这里是资料填的完整
            const UserInfo = JSON.parse(this.cookiesFn.getCookie('UserInfo'))
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/Unit/addUnit',
              data: {
                UserID: UserInfo.UserID,
                UnitID: UserInfo.UnitID,
                UnitName: this.ruleForm.name,
                TypeOfUnit: this.ruleForm.type == '经营单位' ? 1 : 2,
                Contact: this.ruleForm.people,
                PhoneNumber: this.ruleForm.photo,
                AddProvince: this.selectObj.provinceID,
                AddCity: this.selectObj.cityID,
                AddDistrict: this.selectObj.disID,
                AddTown: this.selectObj.streetID,
                AddOther: this.ruleForm.address,
                north: this.$store.state.markerLatLng.Lng,
                east: this.$store.state.markerLatLng.Lat,
                Password: this.ruleForm.Password
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                console.log(response.data)
                if(JSON.parse(response).status == 1){
                  that.msg('当前单位添加成功，跳转到单位管理页', 'success')
                  that.$router.push({path: '/system/unitManagement'})
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
            //   url: this.url+'/api/Unit/addUnit',
            //   params: {
            //     UserID: UserInfo.UserID,
            //     UnitID: UserInfo.UnitID,
            //     UnitName: this.ruleForm.name,
            //     TypeOfUnit: this.ruleForm.type == '经营单位' ? 1 : 2,
            //     Contact: this.ruleForm.people,
            //     PhoneNumber: this.ruleForm.photo,
            //     AddProvince: this.selectObj.provinceID,
            //     AddCity: this.selectObj.cityID,
            //     AddDistrict: this.selectObj.disID,
            //     AddTown: this.selectObj.streetID,
            //     AddOther: this.ruleForm.address,
            //     north: this.$store.state.markerLatLng.Lng,
            //     east: this.$store.state.markerLatLng.Lat,
            //     Password: this.ruleForm.Password
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     console.log(response.data)
            //     if(response.data.status == 1){
            //       this.msg('当前单位添加成功，跳转到单位管理页', 'success')
            //       this.$router.push({path: '/system/unitManagement'})
            //     }else {
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          } else if(!valid) { // 没有填完输入框
            this.msg('请根据提示完成填写', 'error')
            console.log('error submit!!')
            return false
          }else if(!this.selectObj.value6 || !this.selectObj.value7 || !this.selectObj.value8 || !this.selectObj.value9) {
            // 没有选择省市区街道
            this.msg('请选择省市区街道', 'error')
            console.log('error submit!!')
            return false
          }else if(!this.$store.state.markerLatLng.Lat && !this.$store.state.markerLatLng.Lng){ // 没有标记当前位置
            this.msg('请点击地图进行标记当前的位置', 'error')
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.selectObj.two = true
        this.selectObj.three = true
        this.selectObj.value6 = ''
        this.selectObj.value7 = ''
        this.selectObj.value8 = ''
        this.selectObj.value9 = ''
        this.$store.commit('resetMarkerLatLng')
      }
    },
    data() {
      return {
        // lat: 30.2041300000,
        // lng: 120.2473600000,
        lat: '',
        lng: '',
        selectObj: {
          two: true,
          three: true,
          four: true,
          provinces: [],
          provinceID: '',
          cities: [],
          cityID: '',
          district: [],
          disID: '',
          streets: [],
          streetID: '',
          value6: '',
          value7: '',
          value8: '',
          value9: ''
        },
        ruleForm: {
          type: '',
          name: '',
          address: '',
          people: '',
          photo: '',
          Password:''
        },
        rules: {
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
            { min: 1, max:100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          people: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请填写正确地址', trigger: 'blur' }
          ],
          photo: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号' }
          ],
          type: [
            { required: true, message: '请选择单位类型', trigger: 'change' }
          ],
          Password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入6-18位，以字母开头的密码（不包含特殊字符）' }
          ]
        }
      }
    }
  }
</script>

<style scoped>

</style>
