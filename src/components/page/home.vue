<template>
    <div id="home" class="clearfix">
      <div class="home_body">
        <!--<mapDrag class="mapbox" :lat="lat" :lng="lng" :pos="false" MapStyle="amap://styles/darkblue"></mapDrag>-->
        <div id="container"></div>
        <div class="area_count">
          <ul class="count_ul">
            <li>
              <i>{{unitStatistics.unitTotal}}</i>
              <i>单位总数</i>
            </li>
            <li>
              <i>{{unitStatistics.equipmentTotal}}</i>
              <i>设备总数</i>
            </li>
            <li>
              <i>{{getWarnNumber}}</i>
              <i>今日报警</i>
            </li>
            <li>
              <i>{{getDefaultNumber}}</i>
              <i>今日故障</i>
            </li>
          </ul>
        </div>
        <div class="indicator_color">
          <!--<h4>设备</h4>-->
          <ul class="color_ul">
            <li>
              <span>正常</span>
              <img src="../../assets/img/green_light.png" alt="">
              <!--<em style="background: rgba(0,255,0,1);"></em>-->
            </li>
            <li>
              <span>故障</span>
              <img src="../../assets/img/yellow_light.png" alt="">
              <!--<em style="background: rgba(255,255,0,1);"></em>-->
            </li>
            <li>
              <span>报警</span>
              <img src="../../assets/img/3.png" alt="">
              <!--<em style="background: rgba(255,0,0,1);"></em>-->
            </li>
          </ul>
        </div>
      </div>
      <div class="slider">
        <div class="slider_item">
          <h4>
            <i class="slider_item_border_l"></i>
            <span>单位设备运行状态</span>
            <i class="slider_item_border_r"></i>
          </h4>
          <div class="slider_item_body">
            <happy-scroll class="slider_scroll" color="#999" size="0">
              <ul id="fireList">
                <li v-if="getFireDataList.length" v-for="(item, index) in getFireDataList" :key="index">
                  <img src="../../assets/img/icon_dizhi.png" alt="">
                  <el-tooltip class="placeName" :content="item.UnitName" placement="top" effect="light">
                    <el-button >{{item.UnitName.slice(0,3)}}...</el-button>
                  </el-tooltip>
                  <button class="fault" v-if="item.malFunction == 1">故障</button>
                  <button class="check_error" @click="showMaskBreakDownHandle(item.ID)" v-if="item.malFunction == 1">查看</button>
                  <button class="alert" v-if="item.fireAlarm == 1">报警</button>
                  <button class="check_error" v-if="item.fireAlarm == 1" @click="showMaskAlertHandle(item.ID)">查看</button>
                </li>
                <li v-if="!getFireDataList.length">运行正常</li>
              </ul>
            </happy-scroll>
          </div>
        </div>
        <div class="slider_item">
          <h4>
            <i class="slider_item_border_l"></i>
            <span>数据上传动态</span>
            <i class="slider_item_border_r"></i>
          </h4>
          <div class="slider_item_body">
            <happy-scroll class="slider_scroll" color="#999" size="0">
              <ul class="slider_two">
                <li v-if="infoDataList.length" v-for="(item, index) in infoDataList" :key="index">
                  <span style="color: red;">{{item.addTime.slice(10)}}</span>
                  <span>设备:<i style="color: red;">{{item.DeviceSn}}</i> 数据上传</span>
                </li>
                <li v-if="!infoDataList.length">暂无上报数据</li>
              </ul>
            </happy-scroll>
          </div>
        </div>
      </div>
      <div class="error_mask" v-show="maskState">
        <audio class="warning_voice" loop muted>
          <source src="../../assets/audio/huozaijingbaosheng.mp3" type="audio/ogg" />
        </audio>
      </div>
    </div>
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'
  let map
  export default {
    name: 'home',
    data () {
      return {
        lat: 30.2041300000,
        lng: 120.2473600000,
        maskState: false,
        unitStatistics: {
          unitTotal: '', // 单位总数
          equipmentTotal: '', // 设备总数
          warningNumber: '', // 报警总数
          defaultNumber: '' // 故障总数
        },
        infoDataList: [],
        unitDataList: []
      }
    },
    computed: {
      getFireDataList(){ // 获取单位设备运行状态列表
        return this.$store.state.fireDataList.reverse()
      },
      getWarnNumber(){ // 获取今日报警数
        return this.$store.state.warnNum || 0
      },
      getDefaultNumber(){ // 获取今日故障数
        return this.$store.state.defaultNum || 0
      }
    },
    mounted(){
      const that = this
      if(window.AMap){ // 显示地图
        that.init()
      }

      this.getSomeNumber(this.url+'/api/Index/get_OwnerUnit_count', 'unitTotal') // 单位总数
      this.getSomeNumber(this.url+'/api/Index/get_device_count', 'equipmentTotal') // 设备总数
      this.getSomeNumber(this.url+'/api/Index/get_today_fire_count', 'warningNumber') // 报警总数
      this.getSomeNumber(this.url+'/api/Index/get_today_mal_count', 'defaultNumber') // 故障总数

      // this.getInfoDataList(this.url+'/api/Alarm/getAlarms', 'fireDataList') // 首次获取单位设备运行状态
      this.$http.get(this.url+'/api/Alarm/getAlarms', { // 单位设备运行状态
        params: {
          UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            this.$store.commit('getFireDataList', response.data.data)
          }else {
            // this.msg(response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
      this.$http.get(this.url+'/api/Alarm/getAlarms', { // 第一次轮询接口单位设备运行状态
        params: {
          UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
          type: 1
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            let arr = [], malFunctionID = [], fireAlarmID = []
            response.data.data.forEach((item, index) => {
              if(item.malFunction == 1){ // 当前为故障
                malFunctionID.push(item.UnitID)
              }
              if(item.fireAlarm == 1){ // 当前为报警
                fireAlarmID.push(item.UnitID)
              }

              if(item.flg_status == 0){ // 当前拿到的是没有处理的故障
                arr.push(item.ID)
                if(item.fireAlarm == 1){ // 火警
                  this.$notify({
                    dangerouslyUseHTMLString: true,
                    customClass: 'warningAlert',
                    message: `
                      <h4>火灾报警</h4>
                      <ul>
                        <li>发生时间：${item.TimeStamp}</li>
                        <li>发生地点：${item.UnitName}</li>
                      </ul>
                      <h4 class="quick_warn">请马上处理！</h4>
                    `,
                    duration: 0
                  })
                  if(!this.maskState){ // 让遮罩显示
                    this.maskState = true
                  }
                  // 只要有一个alert弹框存在  都播放音乐
                  setTimeout(function () {
                    $('.warning_voice')[0].currentTime = 0
                    $('.warning_voice')[0].play()
                  },300)
                  const that = this
                  $('.el-icon-close').on('click', function () { // 点击x关闭按钮时
                    if(document.getElementsByClassName('el-notification').length == 1){
                      that.maskState = false
                    }
                    if($('.warningAlert').length == 1){
                      $('.warning_voice')[0].pause()
                    }
                    that.$http.get(that.url+'/api/Alarm/deal_with_alarm', {
                      params: {
                        id: item.ID
                      }
                    })
                      .then((response) => {
                        // console.log(response)
                        if(response.data.status == 1){
                          let arr = JSON.parse(that.cookiesFn.getCookie('newWarn'))
                          arr.splice(arr.indexOf(item.ID), 1)
                          that.cookiesFn.setCookie('newWarn', JSON.stringify(arr))
                        }
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                  })
                }
                if(item.malFunction == 1){ // 故障
                if(!this.maskState){
                  // 让遮罩显示
                  this.maskState = true
                }
                this.$notify({
                  dangerouslyUseHTMLString: true,
                  customClass: 'BreakDown',
                  message: `
                    <h4>故障报警</h4>
                    <ul>
                      <li>发生时间：${item.TimeStamp}</li>
                      <li>发生地点：${item.UnitName}</li>
                    </ul>
                    <h4 class="quick_break">请马上处理！</h4>
                  `,
                  duration: 0
                })
                const that = this
                $('.el-icon-close').on('click', function () { // 点击x关闭按钮时
                  if($('.el-notification').length == 1){
                    that.maskState = false
                  }
                  that.$http.get(that.url+'/api/Alarm/deal_with_alarm', {
                    params: {
                      id: item.ID
                    }
                  })
                    .then((response) => {
                      // console.log(response)
                      if(response.data.status == 1){
                        let arr = JSON.parse(that.cookiesFn.getCookie('newWarn'))
                        arr.splice(arr.indexOf(item.ID), 1)
                        that.cookiesFn.setCookie('newWarn', JSON.stringify(arr))
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                })
              }
              }
            })

            let newMalFunctionID = [...new Set(malFunctionID)] // 去重后的故障的ID的数组
            let newFireAlarmID = [...new Set(fireAlarmID)] // 去重后的报警的ID的数组

            setTimeout(() => {
              that.$store.state.unitDataList.forEach((item) => {
                if(newMalFunctionID.indexOf(item.ID) != -1){ // 在单位列表找到了当前故障的单位
                  that.markerHandle(require('../../assets/img/yellow_light.png'), item)
                }
                if(newFireAlarmID.indexOf(item.ID) != -1){ // 在单位列表找到了当前报警的单位
                  that.markerHandle(require('../../assets/img/red_light.gif'), item)
                }
              })
            },500)

            that.cookiesFn.setCookie('newWarn', JSON.stringify(arr))
          }else {
            that.cookiesFn.setCookie('newWarn', JSON.stringify([]))
            // this.msg(response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
      this.getInfoDataList(this.url+'/api/Msglog/getlog', 'infoDataList') // 首次获取数据上传动态

      setInterval(function () { // 每5分钟 请求一次数据
        if(that.cookiesFn.getCookie('UserInfo') != undefined){
          that.getInfoDataList(that.url+'/api/Msglog/getlog', 'infoDataList')
        }
      }, 3000)

    },
    methods: {
      showMaskAlertHandle(ID){ // 报警函数
        this.$http.get(this.url+'/api/Alarm/get_alarm_info', { // 点击查看得到这一条的数据
          params: {
            id: ID
          }
        })
          .then((response) => {
            // console.log(response)
            if(response.data.status == 1){
              this.$notify({
                dangerouslyUseHTMLString: true,
                customClass: 'warningAlert',
                message: `
                    <h4>火灾报警</h4>
                    <ul>
                      <li>发生时间：${response.data.data.TimeStamp}</li>
                      <li>发生地点：${response.data.data.UnitName}</li>
                    </ul>
                    <h4 class="quick_warn">请马上处理！</h4>
                  `,
                duration: 0
              })
              this.map.setZoom(16)
              this.map.panTo([response.data.data.north, response.data.data.east])
              if(!this.maskState){ // 让遮罩显示
                this.maskState = true
                // 只要有一个alert弹框存在  都播放音乐
                $('.warning_voice')[0].currentTime = 0
                $('.warning_voice')[0].play()
              }
              const that = this
              $('.el-icon-close').on('click', function () { // 点击x关闭按钮时
                if(document.getElementsByClassName('el-notification').length == 1){
                  that.maskState = false
                  $('.warning_voice')[0].pause()
                }
                that.$http.get(that.url+'/api/Alarm/deal_with_alarm', {
                  params: {
                    id: ID
                  }
                })
                  .then((response) => {
                    // console.log(response)
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              })
            }else {
              // this.msg(response.data.msg, 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      showMaskBreakDownHandle(ID){ // 故障函数
        if(!this.maskState){ // 让遮罩显示
          this.maskState = true
        }
        this.$http.get(this.url+'/api/Alarm/get_alarm_info', { // 点击查看得到这一条的数据
          params: {
            id: ID
          }
        })
          .then((response) => {
            if(response.data.status == 1){
              this.$notify({
                dangerouslyUseHTMLString: true,
                customClass: 'BreakDown',
                message: `
                    <h4>故障报警</h4>
                    <ul>
                      <li>发生时间：${response.data.data.TimeStamp}</li>
                      <li>发生地点：${response.data.data.UnitName}</li>
                    </ul>
                    <h4 class="quick_break">请马上处理！</h4>
                  `,
                duration: 0
              })
              this.map.setZoom(16)
              this.map.panTo([response.data.data.north, response.data.data.east])
              const that = this
              $('.el-icon-close').on('click', function () { // 点击x关闭按钮时
                if(document.getElementsByClassName('el-notification').length == 1){
                  that.maskState = false
                }
                that.$http.get(that.url+'/api/Alarm/deal_with_alarm', {
                  params: {
                    id: ID
                  }
                })
                  .then((response) => {
                    // console.log(response)
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              })
            }else {
              // this.msg(response.data.msg, 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })

      },
      init() { // 初始化地图
        const that = this
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap
        let mapConfig = {
          zoom: 16,
          mapStyle: 'amap://styles/darkblue',
          resizeEnable: true,
          animateEnable: true
        }
        // console.log(JSON.parse(that.cookiesFn.getCookie('UserInfo')).east)
        if (JSON.parse(that.cookiesFn.getCookie('UserInfo')).east && JSON.parse(that.cookiesFn.getCookie('UserInfo')).north) {
          mapConfig.center = [JSON.parse(that.cookiesFn.getCookie('UserInfo')).north, JSON.parse(that.cookiesFn.getCookie('UserInfo')).east]
        }
        that.map = new AMap.Map('container', mapConfig)

        // that.map.plugin('AMap.Geolocation', function () {
        //   let geolocation = new AMap.Geolocation({
        //     enableHighAccuracy: true,//是否使用高精度定位，默认:true
        //     timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        //     maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        //     convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        //     showButton: false,        //显示定位按钮，默认：true
        //     buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        //     buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        //     showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        //     showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        //     panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        //     zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        //   });
        //   that.map.addControl(geolocation);
        //   geolocation.getCurrentPosition();
        //   AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        //   AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        // });
        // function onComplete(e) {
        //   // console.log(e)
        //   // console.log('定位成功')
        // }
        // function onError(e) {
        //   // console.log(e)
        //   // console.log('定位失败')
        // }

        if(window.AMap){
          let icon = new AMap.Icon({
            size: new AMap.Size(40,40),    // 图标尺寸
            image: require('../../assets/img/green_light.png'),  // Icon的图像
            imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
            imageSize: new AMap.Size(40,40)   // 根据所设置的大小拉伸或压缩图片
          })
          let markers = []
          this.$store.state.unitDataList.forEach((item, index) => { // 对每一个单位做marker
            if(item.TypeOfUnit == 2){
              markers.push({
                position: new AMap.LngLat(item.north,item.east),
                offset: new AMap.Pixel(-20, -20),
                icon: icon, // 添加 Icon 图标 URL
                title: item.UnitName,
                extData:{
                  UnitID: item.ID
                }
              })
            }
          })
          that.$store.commit('getAMap', {
            AMap,
            map: that.map
          })
          setTimeout(function () {
            markers.forEach(function(marker, index) { // 将每个单位的marker标记到地图上
              var m = new AMap.Marker({
                map: that.map,
                icon: marker.icon,
                position: marker.position,
                offset: marker.offset,
                title: marker.title,
                extData: marker.extData
              })
              m.on('click', function () {
                that.$router.push({path: '/area/areaLink/jiankong/huozai/sheshi', query: {UnitID: this.getExtData().UnitID}})
                sessionStorage.setItem('areaID', this.getExtData().UnitID)
                that.$store.commit('getCurUnitID', this.getExtData().UnitID)
                // console.log(this.getExtData()) // 可以拿到当前点击的单位的ID
              })
            })
          },300)
        }
      },
      getSomeNumber(url, name){
        // console.log(url, name)
        this.$http.get(url, { // 进入界面的时候获取当前单位总数
          params: {
            UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
          }
        })
          .then( (response)=> {
            if(response.data.status == 1){
              // console.log(response.data.data)
              this.unitStatistics[name] = response.data.data
              if(name == 'warningNumber'){ // 今日报警数
                this.$store.commit('getWarnNumber', response.data.data)
              }
              if(name == 'defaultNumber'){ // 今日故障数
                this.$store.commit('getDefaultNumber', response.data.data)
              }
            }else {
              this.unitStatistics[name] = 0
              // this.msg(response.data.msg, 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      getInfoDataList(url, data){ // 获取数据上传动态
        this.$http.get(url, { // 数据上传动态
          params: {
            UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
          }
        })
          .then((response) => {
            // console.log(response)
            if(response.data.status == 1){
              this[data] = response.data.data
            }else {
              // this.msg(response.data.msg, 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      markerHandle(url, item){
        const that = this
        let icon = new AMap.Icon({
          size: new AMap.Size(40,40),    // 图标尺寸
          image: url,  // Icon的图像
          imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(40,40)   // 根据所设置的大小拉伸或压缩图片
        })
        let marker = new AMap.Marker({
          map: that.map,
          icon: icon,
          position: new AMap.LngLat(item.north,item.east),
          offset: new AMap.Pixel(-20, -20),
          title: item.UnitName,
          extData: {
            UnitID: item.ID
          }
        })
        marker.on('click', function () {
          that.$router.push({path: '/area/areaLink/jiankong/huozai/sheshi', query: {UnitID: this.getExtData().UnitID}})
          sessionStorage.setItem('areaID', this.getExtData().UnitID)
          that.$store.commit('getCurUnitID', this.getExtData().UnitID)
          // console.log(this.getExtData()) // 可以拿到当前点击的单位的ID
        })
      }
    },
    created(){
      // 已载入高德地图API，则直接初始化地图
      if (window.AMap && window.AMapUI) {
        this.init() // 未载入高德地图API，则先载入API再初始化
      } else { // 载入高德地图和UI组件
        Promise.all([
          remoteLoad(`https://webapi.amap.com/maps?v=1.4.8&key=${MapKey}`)
        ]).then(() => {
          Promise.all([
            remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
          ])
            .then(() => { // 最后初始化地图
              this.init()
            })
        })
      }

    }
  }
</script>

<style scoped>

</style>
