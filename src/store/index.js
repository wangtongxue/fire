import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: null,
    userPhone: '',
    unitList: null,
    userList: null,
    showBigMap: false,
    markerLatLng: {
      Lat: '',
      Lng: ''
    },
    removeMarker: false,
    logo_path: null,
    fireDataList: [],
    warnNum: '',
    defaultNum: '',
    unitDataList: [], // 首页获取的当前登陆账号的列表
    aMap: null,
    map: null,
    curUnitID: '',
    sheShiData: []
  },
  getters: {},
  mutations: {
    getMarkerLatLng(state, LatLng){
      state.markerLatLng.Lat = LatLng.Lat
      state.markerLatLng.Lng = LatLng.Lng
    },
    resetMarkerLatLng(state){
      state.markerLatLng.Lat = ''
      state.markerLatLng.Lng = ''
    },
    changeShowBigMap(state, bool){
      console.log(bool)
      state.showBigMap = bool
    },
    curUserPhone(state, phone){
      state.userPhone = phone
    },
    setUserInfoCookies(state, userInfo){ // 存cookie 并且将用户登陆之后的返回值存储在userInfo中
      // console.log(window.vue.cookiesFn)
      // 这里是将返回值对象赋值存给state.userInfo
      if(!userInfo.logo_path){
        userInfo.logo_path = 'http://test.geointech.cn/uploads/20180921/5080ae8fe91a9f0aa3e022a522d846f1.png'
      }
      state.userInfo = userInfo
      // userInfo.unit_name = ''
      // userInfo.Name = ''
      // 存cookie
      window.vue.cookiesFn.setCookie('UserInfo', JSON.stringify(userInfo), 1)
      // 取cookie
      // console.log(decodeURI(window.vue.cookiesFn.getCookie('UserInfo' )))
    },
    deleteUser(state){
      // 删除cookie
      window.vue.cookiesFn.delCookie('UserInfo')
      // 点击退出的时候，清空sessionStorage/localStorage
      sessionStorage.clear()
      localStorage.clear()
    },
    setUnitList(state, unitList){ // 将单位管理页面的单位列表，存储
      state.unitList = unitList
      // window.vue.cookiesFn.setCookie('UnitList', JSON.stringify(unitList), 1 )
      sessionStorage.setItem('UnitList', JSON.stringify(unitList))
    },
    setUserList(state, userList){
      state.userList = userList
      sessionStorage.setItem('UserList', JSON.stringify(userList))
    },
    setUserInfo(){

    },
    setLogoPath(state, url){
      state.logo_path = url
    },
    deleteLogoPath(state){
      state.logo_path = null
    },
    getFireDataList(state, data){ // 单位设备运行状态
      state.fireDataList = data
    },
    addFireDataList(state, data){ // 轮询获取最新的故障添加到原来的list上
      let oldArrID = []
      state.fireDataList.forEach((item) => { // 先拿到原来的数组的所有的 ID
        oldArrID.push(item.ID)
      })
      let newArr = []
      data.forEach((item, index) => {
        if(oldArrID.indexOf(item.ID) == -1){ // 新的故障在原来的数组中没有找到就拼接上
          newArr.push(item)
        }
      })
      state.fireDataList = state.fireDataList.concat(newArr)
      // console.log(state.fireDataList)
    },
    getWarnNumber(state, n){ // 获取今日报警数
      state.warnNum = n
    },
    addWarnNumber(state){
      state.warnNum = Number(state.warnNum)+1
    },
    getDefaultNumber(state, n){ // 获取今日故障
      state.defaultNum = n
    },
    addDefaultNumber(state){
      state.defaultNum = Number(state.defaultNum)+1
    },
    getUnitDataList(state, data){
      state.unitDataList = data
    },
    getAMap(state, mapObj){
      state.aMap = mapObj.AMap
      state.map = mapObj.map
    },
    getCurUnitID(state, id){
      state.curUnitID = id
    },
    getSheShiData(state, data){
      state.sheShiData = data
    }
  },
  actions: {
    getUserInfo(context, that){ // 点击登陆的时候出发这个异步函数，获取值
      $.ajax({
        type: 'post',
        url: that.url+'/api/User/login',
        data: that.loginForm,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function (response) {
          if (JSON.parse(response).status ===  0) {
            that.msg(JSON.parse(response).msg, 'error')
          } else if (JSON.parse(response).status === 1) {
            context.commit('setUserInfoCookies', JSON.parse(response).data )
            that.$router.push({path: '/'})
          }
        },
        error: function (error) {
          console.log(error)
        }
      })
      // that.axios({
      //   method: 'post',
      //   url: that.url+'/api/User/login',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   data: that.loginForm,
      //   transformResponse: [function (data) {
      //     let ret = ''
      //     for (let it in data) {
      //       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //     }
      //     return ret
      //   }]
      // })
      //   .then((response) => {
      //     /*这里是登陆失败的弹窗*/
      //     console.log(response)
      //     if (JSON.parse(response.data).status ===  0) {
      //       that.msg(JSON.parse(response.data).msg, 'error')
      //     } else if (JSON.parse(response.data).status === 1) {
      //       context.commit('setUserInfoCookies', JSON.parse(response.data).data )
      //       that.$router.push({path: '/'})
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    },
    getUnitList(context,{that, UnitID}){ // 在单位管理页面 created阶段提交异步，在这里发送请求得到结果并提交commit存储
      that.$http.get(that.url+'/api/Unit/getUnitList', {
          params: {
            id: UnitID
          }
        })
          .then((response)=> {
            if(response.data.status == 1) { // 请求成功
              context.commit('setUnitList', response.data.data)
              let arrUnitList = JSON.parse(JSON.stringify(response.data.data))
              that.tableData = arrUnitList
              for (let i=0; i<that.tableData.length; i++){
                that.tableData[i].NO = i+1
                if(that.tableData[i].TypeOfUnit == 0){
                  that.tableData[i].TypeOfUnit = "超级单位"
                }else if (that.tableData[i].TypeOfUnit == 1){
                  that.tableData[i].TypeOfUnit = "经营单位"
                }else {
                  that.tableData[i].TypeOfUnit = "业主单位"
                }
                that.tableData[i].dizhi = arrUnitList[i].province+arrUnitList[i].city+arrUnitList[i].district+arrUnitList[i].town+arrUnitList[i].AddOther
              }

              function compare(property){
                return function(a,b){
                  var value1 = a[property];
                  var value2 = b[property];
                  return value1 - value2;
                }
              }
              that.tableData.sort(compare('ID'))
              // console.log(that.tableData.sort(compare('ID')))
              // console.log(that.tableData)
            }else{ // 请求失败
              that.msg(response.data.msg, 'error')
            }
      })
        .catch((error)=>{
          console.log(error)
        })
    },
    getUserList(context, {that, UnitID}){
      that.$http.get(that.url+'/api/User/getUserList', {
        params: {
          UnitID: UnitID
        }
      })
        .then((response) => {
          if(response.data.status == 1) { // 请求成功
            // console.log(response.data.data)
            context.commit('setUserList', response.data.data)
            let arrUserList = JSON.parse(JSON.stringify(response.data.data))
            that.tableData = arrUserList
            for (let i=0; i<that.tableData.length; i++){
              if(that.tableData[i].Permission == 1){
                that.tableData[i].Permission = "超级管理员"
              }else if (that.tableData[i].Permission == 2){
                that.tableData[i].Permission = "管理员"
              }else {
                that.tableData[i].Permission = "用户"
              }
              function compare(property){
                return function(a,b){
                  var value1 = a[property];
                  var value2 = b[property];
                  return value1 - value2;
                }
              }
              that.tableData.sort(compare('UserID'))
            }
            // console.log(JSON.stringify(that.tableData[0]))
          }else{ // 请求失败
            that.msg(response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})
export default store
