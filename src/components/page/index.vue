<template>
  <div id="index-bg-head">
    <div id="index-bg-body" :class="tabClass">
      <div id="mask" v-if="showMask">
        <div class="maskAlert">
          <span>是否确认退出？</span>
          <em @click="ensureHandle">确认</em>
          <em @click="cancelHandle">取消</em>
        </div>
      </div>
      <!--几个页面的主体框架-->
      <header class="header">
        <h1 id="logo">
          <img :src="logoUrl" alt="Geoin">
        </h1>
        <nav class="nav_tab">
          <div id="index_container">
            <router-link tag="a" to="/" id="index_tab" :class="{activeTab: '/' === this.$route.path}" >首页</router-link>
          </div>
          <div id="area_tree_container">
            <a href="javascript:;" @mouseover="hoverHandle" id="area_tab" :class="{activeTab: '/area' === this.$route.path.substr(0,5)}">单位选择</a>
            <section id="area_tabBox">
                <happy-scroll color="#999" size="8" hide-horizontal>
                    <el-tree
                      :data="areaData"
                      :props="defaultProps"
                      default-expand-all
                      :expand-on-click-node="false"
                      @node-click="handleNodeClick">
                    </el-tree>
                  <br>
                  <br>
                  <br>
                  <br>
                    <!--<router-link to="/area/areaLink" tag="a" style="background: none;">单位选择test</router-link>-->
                </happy-scroll>
            </section>
          </div>
          <div id="system_container">
            <a href="javascript:;" id="system_tab" :class="{activeTab: '/system' === this.$route.path.substr(0,7)}">系统设置</a>
            <section id="system_tabBox">
              <div class="tab">
                <!--@click.native="selectTabHandle(item.title)"-->
                <router-link v-for="(item, i) in tabList"  :style="{color: routePath === item.link ? '#fff !important': ''}" :to="item.link" :key="i" tag="a" >{{item.title}}</router-link>
              </div>
            </section>
          </div>
        </nav>
        <div class="user">
          <i></i>
          <span>{{getPhoneNumber}}</span>
          <em class="btn" @click="logoutHandle">退出</em>
        </div>
      </header>
      <!--引用的主体部分的组件-->
      <section id="main">
        <!--<div style="color: #fff;" v-if="showSystemBreadNav">系统设置 > {{currentSelected}}</div>-->
        <transition name="component-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
      <footer id="footer">

      </footer>
      <div class="error_mask" v-show="maskState">
        <audio class="warning_voice" loop muted>
          <source src="../../assets/audio/huozaijingbaosheng.mp3" type="audio/ogg" />
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
  // 这里是固定的导航栏数据
  // import cookiesFn from "../../utils/cookies";

  let tabList = [
    {
      title: '单位管理',
      link: '/system/unitManagement'
    },
    {
      title: '账号管理',
      link: '/system/accountManagement'
    },
    {
      title: '关联单位',
      link: '/system/unitSetting'
    },
    {
      title: '业务管理',
      link: '/system/businessBill'
    },
    {
      title: '企业标识',
      link: '/system/enterpriseLogo'
    },
    // {
    //   title: '权限管理',
    //   link: '/system/authorityManagement'
    // },
    {
      title: '系统消息',
      link: '/system/systemMessage'
    },
  ]
  // 这里要模拟从登录进入首页 根据权限获取到的单位的数据信息
  export default {
    name: "index",
    data(){
      return {
        tabList, // 存放系统管理导航菜单
        routePath: '', // 存放下一个要进入的路由
        tabClass: 'home_bg', // 用来存放切换背景的class
        areaData: null, // 这里是存放刚进入首页时mounted向后端发送请求所接受的数据
        defaultProps: {
          children: 'children',
          label: 'lable'
        },
        showMask: false,
        currentSelected: '单位管理',
        unitLength: '',
        maskState: false
        // showSystemBreadNav: false
      }
    },
    computed: {
      getPhoneNumber(){
        // console.log(this.cookiesFn.getCookie('UserInfo'))
        return JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber
      },
      logoUrl(){
        // 当设置企业标识的时候，vuex的值才会存在，就会渲染logo， 否则的话使用cookie
        return this.$store.state.logo_path || JSON.parse(this.cookiesFn.getCookie('UserInfo')).logo_path
      }
    },
    watch: {
      $route(to, from){
        // 这个判断是用来切换背景边框
        this.routePath = to.path
        if(this.routePath === '/'){
          this.tabClass = 'home_bg'
        }else {
          this.tabClass = 'not_home_bg'
        }
        // 这个是用来判断  当只有在系统设置界面才显示面包屑导航
        if(this.routePath.indexOf('/system') >= 0){
          this.showSystemBreadNav = true
        }else {
          this.showSystemBreadNav = false
        }
        // 这个判断用来给监控按钮添加或者移除active、
        if(document.getElementById('jiankong')){
          if(this.routePath.indexOf('/jiankong')>=0 ){
            document.getElementById('jiankong').className = 'router-link-active'
          }else if(document.getElementById('jiankong').className){
            document.getElementById('jiankong').className = ''
          }
        }
      }
    },
    created(){
      // 用来设置刷新页面的时候的背景框
      this.routePath = this.$route.path
      if(this.routePath === '/'){
        this.tabClass = 'home_bg'
      }else {
        this.tabClass = 'not_home_bg'
      }
    },
    mounted(){
      let that = this
      this.$http.get(this.url+'/api/unit/getUnitAddr', { // 获取树形菜单
        params: {
          id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then(function (response) {
          // console.log(response)
          if(response.data.status == 1){
            that.areaData = response.data.data
          }else {
            this.msg(response.data.msg, 'error')
          }
        })
        .catch((error)=>{
          console.log(error)
        })

      setInterval(function () {
        if(that.cookiesFn.getCookie('UserInfo') != undefined){
          that.$http.get(that.url+'/api/Alarm/getAlarms', { // 单位设备运行状态
            params: {
              UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID,
              type: 1
            }
          })
            .then((response) => {
              if(response.data.status == 1){
                let arr = [], malFunctionID = [], fireAlarmID = []
                let newWarn = JSON.parse(that.cookiesFn.getCookie('newWarn'))
                let a = response.data.data.filter((item) => {
                  if(item.malFunction == 1){ // 当前为故障
                    malFunctionID.push(item.UnitID)
                  }
                  if(item.fireAlarm == 1){ // 当前为报警
                    fireAlarmID.push(item.UnitID)
                  }
                  if(item.flg_status == 0) { // 当前故障报警没有处理
                    return newWarn.indexOf(item.ID) == -1
                  }
                })
                // console.log(a)
                let newMalFunctionID = [...new Set(malFunctionID)] // 去重后的故障的ID的数组
                let newFireAlarmID = [...new Set(fireAlarmID)] // 去重后的报警的ID的数组
                // console.log(that.$store.state.aMap)
                let AMap = that.$store.state.aMap // 每三秒 重置marker
                // if(that.$store.state.map){
                  that.$store.state.map.clearMap() // 每次都先清除marker, 然后重置marker,最后将报警的添加上
                // }
                let icon = new AMap.Icon({
                  size: new AMap.Size(40, 40),    // 图标尺寸
                  image: require('../../assets/img/green_light.png'),  // Icon的图像
                  imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
                  imageSize: new AMap.Size(40, 40)   // 根据所设置的大小拉伸或压缩图片
                })
                let markers = []
                that.$store.state.unitDataList.forEach((item, index) => { // 对每一个单位做marker
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
                markers.forEach(function(marker, index) { // 将每个单位的marker标记到地图上
                  let m = new AMap.Marker({
                    map: that.$store.state.map,
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
                that.$store.state.unitDataList.forEach((item) => {
                  if(newMalFunctionID.indexOf(item.ID) != -1){ // 在单位列表找到了当前故障的单位
                    that.markerHandle(require('../../assets/img/yellow_light.png'), item)
                  }
                  if(newFireAlarmID.indexOf(item.ID) != -1){ // 在单位列表找到了当前报警的单位
                    that.markerHandle(require('../../assets/img/red_light.gif'), item)
                  }
                })

                if(a.length != 0) { // 当a不为空的时候 说明有新的报警，所以重新存cookie
                  a.forEach((item) => {
                    newWarn.push(item.ID)
                    // 拿到最新的报警
                    if(item.fireAlarm == 1){ // 火警
                      that.$store.commit('addWarnNumber')
                      that.$notify({
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
                      if(!that.maskState){ // 让遮罩显示
                        that.maskState = true
                      }
                      // 只要有一个alert弹框存在  都播放音乐
                      setTimeout(function () {
                        $('.warning_voice')[0].currentTime = 0
                        $('.warning_voice')[0].play()
                      },300)
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
                      that.$store.commit('addDefaultNumber')
                      if(!that.maskState){
                        // 让遮罩显示
                        that.maskState = true
                      }
                      that.$notify({
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
                  })
                  that.cookiesFn.setCookie('newWarn', JSON.stringify(newWarn))
                  // 在这内部生成弹窗
                  that.$store.commit('addFireDataList', a)
                }
              }else {
                if(that.$store.state.map){
                  that.$store.state.map.clearMap() // 没有故障的时候重置marker,
                  let AMap = that.$store.state.aMap // 每三秒 重置marker
                  let icon = new AMap.Icon({
                    size: new AMap.Size(40, 40),    // 图标尺寸
                    image: require('../../assets/img/green_light.png'),  // Icon的图像
                    imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
                    imageSize: new AMap.Size(40, 40)   // 根据所设置的大小拉伸或压缩图片
                  })
                  let markers = []
                  // console.log(that.$store.state.unitDataList)
                  that.$store.state.unitDataList.forEach((item, index) => { // 对每一个单位做marker
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
                  markers.forEach(function(marker, index) { // 将每个单位的marker标记到地图上
                    let m = new AMap.Marker({
                      map: that.$store.state.map,
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
                }
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }, 3000)

      // 获取单位
      this.$http.get(this.url + '/api/Unit/getUnitList', {
        params: {
          id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then((response) => {
          // console.log(response)
          if(response.data.status == 1){
            // this.unitDataList = response.data.data
            this.$store.commit('getUnitDataList', response.data.data)
            sessionStorage.setItem('UnitList', JSON.stringify(response.data.data))
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    methods: {
      logoutHandle(){
        this.showMask = true
        this.$store.commit('deleteLogoPath')
      },
      ensureHandle(){
        this.$store.commit('deleteUser')
        this.$router.push({path: '/login'})
      },
      cancelHandle(){
        this.showMask = false
      },
      handleNodeClick(data) {
        if(data.level == 5 ){
          this.$router.push('/area/areaLink')
          sessionStorage.setItem('areaID', data.id)
          this.$store.commit('getCurUnitID', data.id)
          this.$http.get(this.url + '/api/Device/getSystemStates', {
            params: {
              UnitID: data.id
            }
          })
            .then((response) => {
              if(response.data.status == 1){
                // console.log(response.data.data)
                this.$store.commit('getSheShiData', response.data.data)
              }else {
                this.msg(response.data.msg, 'error')
                this.$store.commit('getSheShiData', [])
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }else {
          // this.$router.push('/')
        }
      },
      hoverHandle(){ // 鼠标移入单位选择按钮时触发
        if(!JSON.parse(sessionStorage.getItem('UnitList')) || this.unitLength == JSON.parse(sessionStorage.getItem('UnitList')).length){ // 当没有存储单位列表时，说明没有进入单位管理页面，则单位没有增删
          return
        }else { // 只有当单位的数量发生变化时 鼠标移入才会触发请求
          this.unitLength = JSON.parse(sessionStorage.getItem('UnitList')).length
        }
        const that = this
        this.$http.get(this.url+'/api/unit/getUnitAddr', {
          params: {
            id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
          }
        })
          .then(function (response) {
            // console.log(response)
            if(response.data.status == 1){
              that.areaData = response.data.data
            }else {
              this.msg(response.data.msg, 'error')
            }
          })
          .catch((error)=>{
            console.log(error)
          })
      },
      markerHandle(url, item){
        const that = this
        if(that.$store.state.map.getZoom() <= 10){ // 当小于一个层级的时候 让marker消失
          that.$store.state.map.clearMap()
        }else {
          let AMap = that.$store.state.aMap // 每三秒 重置marker
          let icon = new AMap.Icon({
            size: new AMap.Size(40, 40),    // 图标尺寸
            image: url,  // Icon的图像
            imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
            imageSize: new AMap.Size(40, 40)   // 根据所设置的大小拉伸或压缩图片
          })
          let marker = new AMap.Marker({
            map: that.$store.state.map,
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

      }
    }
  }
</script>

<style scoped>

</style>
