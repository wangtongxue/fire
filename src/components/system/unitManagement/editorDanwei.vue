<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > <router-link style="cursor: pointer" to="/system/unitManagement" tag="a">单位管理</router-link> > 单位编辑</div>
    <div class="public_box">
      <el-form :model="ruleForm" class="unitManagement"  :rules="rules" ref="ruleForm" label-width="100px">
        <div class="unitManagement_type">
          <el-form-item label="单位类型:" prop="type">
            <el-radio-group  v-model="ruleForm.type">
              <el-radio disabled label="业主单位"></el-radio>
              <el-radio disabled label="经营单位"></el-radio>
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
              <el-input v-model="ruleForm.name"></el-input>
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
            <div class="unitManagement_addUnit_map"><span style="color: #f56c6c;">*</span> 地图&nbsp;&nbsp;<span style="margin-left: 10px;">点击地图确认标点</span>
              <img @click="showBigMapHandle" class="unitManagement_addUnit_map_cha" src="../../../assets/img/smallMap.jpg" alt="">
            </div>
          </div>
        </div>
        <div class="unitManagement_contacts">
          <div class="unitManagement_addUnit_set el-form-item__label"><span style="color: #f56c6c;">*</span> 修改管理员:</div>
          <div class="unitManagement_addUnit_add">
            <el-form-item label="管理员" prop="people">
              <el-input v-model="ruleForm.people"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="photo">
              <el-input :disabled="showPhone" v-model="ruleForm.photo"></el-input>
            </el-form-item>
            <el-form-item class="unitManagement_addUnit_add_mima" label="初始密码" prop="Password">
              <el-input type="password"  v-model="ruleForm.Password"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="unitManagement_confirm">
          <el-form-item class="unitManagement_addUnit_enter">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div id="mapContainer" v-show="bigMapState">
      <mapDrag class="addMapBox" :lat="currentLatLng.lat" :lng="currentLatLng.lng" :pos="true" MapStyle="amap://styles/normal"></mapDrag>
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
      currentLatLng(){
        return {
          lat: JSON.parse(sessionStorage.getItem('currentUnitRow')).east,
          lng: JSON.parse(sessionStorage.getItem('currentUnitRow')).north
        }
      },
      getLngLat(){ // 点击标记之后的坐标位置
        return this.$store.state.markerLatLng
      },
      getTypeOfUnit(){ // 用来计算 当前页面是否禁用单位类型选项
        let currentUnit = JSON.parse(sessionStorage.getItem('currentUnitRow'))
        let currentUnitPhone = currentUnit.PhoneNumber
        let UserInfo = JSON.parse(this.cookiesFn.getCookie('UserInfo'))
        let userInfoPhone = UserInfo.PhoneNumber
        if(currentUnitPhone === userInfoPhone){ // 当前为：编辑的单位是登陆的账号单位 即为当前登陆账号下的唯一超管
          this.msg('当前单位不可修改单位类型', 'error')
          return true
        }else if(UserInfo.TypeOfUnit == 0){ // 当登陆的账号为超管 并且编辑的不是账号单位本身
          // this.ruleForm.type = currentUnit.TypeOfUnit
          return false
        }else {
          this.msg('当前单位不可修改单位类型', 'error')
          return true
        }
      }
    },
    created(){
      let currentUnitRow = JSON.parse(sessionStorage.getItem('currentUnitRow'))
      this.ruleForm.type = currentUnitRow.TypeOfUnit // 单位类型
      this.ruleForm.name = currentUnitRow.UnitName // 单位名称
      this.ruleForm.address = currentUnitRow.AddOther // 详细地址
      this.ruleForm.people = currentUnitRow.Contact // 联系人
      this.ruleForm.photo = currentUnitRow.PhoneNumber // 联系电话
      this.ruleForm.Password = 'admin123' // 密码

      this.selectObj.two= false
      this.selectObj.three= false
      this.selectObj.four= false
      this.selectObj.provinceID= currentUnitRow.AddProvince
      this.selectObj.cityID= currentUnitRow.AddCity
      this.selectObj.disID= currentUnitRow.AddDistrict
      this.selectObj.streetID= currentUnitRow.AddTown
      this.selectObj.value6= currentUnitRow.province
      this.selectObj.value7= currentUnitRow.city
      this.selectObj.value8= currentUnitRow.district
      this.selectObj.value9= currentUnitRow.town

      if(JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID == currentUnitRow.ID) {
        // 编辑登陆的账号的单位本身
        this.showPhone = true
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
      sendAxios(params){
        const that = this
        $.ajax({
          type: 'post',
          url: this.url+'/api/Unit/editUnit',
          data: params,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          success: function (response) {
            if(JSON.parse(response).status == 1){
              that.msg('当前单位编辑成功，跳转到单位管理页', 'success')
              that.$router.push({path: '/system/unitManagement'})
            }else {
              that.msg('当前未编辑，保存失败', 'error')
            }
          },
          error: function (error) {
            console.log(error)
          }
        })

        // this.$http({
        //   method: 'post',
        //   url: this.url+'/api/Unit/editUnit',
        //   params: params,
        //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        // })
        //   .then((response) => {
        //     if(response.data.status == 1){
        //       this.msg('当前单位编辑成功，跳转到单位管理页', 'success')
        //       this.$router.push({path: '/system/unitManagement'})
        //     }else {
        //       this.msg('当前未编辑，保存失败', 'error')
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
      },
      submitForm(formName) { // 当store中的lat lng存在的时候，就提交store的latlng 否则就是没有改变标记地址，则提交原来的经纬度
        this.$refs[formName].validate((valid) => {
          // const UserInfo = JSON.parse(this.cookiesFn.getCookie('UserInfo'))
          let currentUnitRow = JSON.parse(sessionStorage.getItem('currentUnitRow')) // 当前编辑的单位信息数据
          let Lat = this.getLngLat.Lat ? this.getLngLat.Lat : currentUnitRow.east  // 获取纬度
          let Lng = this.getLngLat.Lng ? this.getLngLat.Lng : currentUnitRow.north // 获取经度
          let curUnitType = ''
          let sendObj = null
          if(this.ruleForm.type == '超级单位'){ // 将单位类型转换成编码
            curUnitType = 0
          }else if (this.ruleForm.type == '经营单位'){
            curUnitType = 1
          }else {
            curUnitType = 2
          }
          if(valid){ // 当6个基本的存在时
            if(this.selectObj.value6 && this.selectObj.value7 && this.selectObj.value8 && this.selectObj.value9){ // 当省市区街道都存在时
              sendObj = { // 发送请求的参数
                // UserID: UserInfo.UserID,
                UnitID: currentUnitRow.ID,
                UnitName: this.ruleForm.name,
                TypeOfUnit: curUnitType,
                Contact: this.ruleForm.people,
                PhoneNumber: this.ruleForm.photo,
                AddProvince: this.selectObj.provinceID,
                AddCity: this.selectObj.cityID,
                AddDistrict: this.selectObj.disID,
                AddTown: this.selectObj.streetID,
                AddOther: this.ruleForm.address,
                north: Lng,
                east: Lat
              }
              if(this.ruleForm.Password == 'admin123'){ // 当前没有修改密码，不必传密码参数
                // alert('没有修改密码')
                // console.log(sendObj)
                this.sendAxios(sendObj)
              }else { // 当前修改了密码， 所以要传密码
                // alert('已经修改密码')
                console.log(sendObj)
                sendObj.Password = this.ruleForm.Password
                this.sendAxios(sendObj)
              }
            }else {
              this.msg('请根据提示完善地址', 'error')
            }
          }else { /// 当基本的6个不存在时
            this.msg('请根据提示完成编辑', 'error')
          }
        })
      },
      resetForm(formName) {
        this.$router.push({path: '/system/unitManagement'})
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
          Password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入6-18位，以字母开头的密码（不包含特殊字符）' }
          ]
        },
        showPhone: false
      }
    },
  }
</script>

<style scoped>

</style>
