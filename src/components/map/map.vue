<!--
  描述：拖放地图组件，默认尺寸是 500 * 300
  接收属性参数：
    lat: 纬度
    lng: 经度
  自定义事件：
    drag: 拖放完成事件
  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
  <div class="m-map">
    <div id="js-container" class="map"></div>
    <button v-show="showBtn" class="closeMapBtn" @click="okMarkerHandle">确认标记</button>
  </div>
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'
  export default {
    props: ['lat', 'lng', 'MapStyle', 'pos'],
    data () {
      return {
        // searchKey: '',
        // placeSearch: null,
        dragStatus: false,
        AMapUI: null,
        AMap: null,
        showBtn: false,
        LatLng: {
          Lat: '',
          Lng: ''
        }
      }
    },
    watch: {
      // searchKey () {
      //   if (this.searchKey === '') {
      //     this.placeSearch.clear()
      //   }
      // }
    },
    methods: {
      okMarkerHandle(){ // 点击关闭大地图
        if(!this.LatLng.Lat){
          return this.msg('当前没有标记位置', 'error')
        }else if(JSON.parse(sessionStorage.getItem("currentUnitRow")) != null && this.LatLng.Lat == JSON.parse(sessionStorage.getItem("currentUnitRow")).east ){
          this.$store.commit('changeShowBigMap', false)
          this.$store.commit('getMarkerLatLng', this.LatLng)
          this.msg('当前标记位置没有改变', 'error')
        }else {
          this.$store.commit('changeShowBigMap', false)
          this.msg('位置标记成功', 'success')
          this.$store.commit('getMarkerLatLng', this.LatLng)
        }
      },
      // 搜索
      // handleSearch () {
      //   if (this.searchKey) {
      //     this.placeSearch.search(this.searchKey)
      //   }
      // },
      // 实例化地图
      initMap () {
        const that = this
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        this.AMapUI = window.AMapUI
        let AMapUI = this.AMapUI
        this.AMap = window.AMap
        let AMap = this.AMap
        // console.log(AMapUI)
        if(AMapUI && AMap){
          setTimeout(()=> {
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
              let mapConfig = {
                zoom: 16,
                cityName: MapCityName,
                mapStyle: this.MapStyle,
                resizeEnable: true
              }
              if (that.lat && that.lng) {
                mapConfig.center = [that.lng, that.lat]
              }
              that.map = new AMap.Map('js-container', mapConfig)

              if(that.pos){
                that.showBtn = true
                if ( that.$route.path==='/system/unitManagement/editorDanwei' && JSON.parse(sessionStorage.getItem("currentUnitRow")) != null && JSON.parse(sessionStorage.getItem("currentUnitRow")).north ) {
                  //  在编辑界面，已经有了经纬度，则直接显示出来一个标记
                  that.marker = new AMap.Marker({
                    map: that.map
                  })
                  that.marker.setPosition([JSON.parse(sessionStorage.getItem("currentUnitRow")).north, JSON.parse(sessionStorage.getItem("currentUnitRow")).east]);
                  that.marker.setLabel({
                    offset: new AMap.Pixel(-150, -50), //显示位置
                    content: '<span>当前已存在标记的经纬度为:  '+that.lng+','+that.lat+'</span>' //显示内容
                  });
                  that.LatLng.Lat = that.lat
                  that.LatLng.Lng = that.lng
                }
                that.map.plugin(['AMap.Geolocation'], function () {
                  let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  });
                  that.map.addControl(geolocation);
                  geolocation.getCurrentPosition()
                })

                if(!that.marker){ // 如果标记还不存在  则新建标记，否则还使用之前的
                  that.marker= new AMap.Marker({
                    map: that.map
                  })
                }
                that.map.on('click', function(e) {
                  let lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()]; //已知点坐标
                  that.marker.setPosition(lnglatXY);
                  that.marker.setLabel({
                    offset: new AMap.Pixel(-150, -50), //显示位置
                    content: '<span>当前标记位置的经纬度为:  '+e.lnglat.getLng()+','+e.lnglat.getLat()+'</span>' //显示内容
                  });
                  that.LatLng.Lat = e.lnglat.getLat()
                  that.LatLng.Lng = e.lnglat.getLng()
                })
              }

              // 启用工具条
              // AMap.plugin(['AMap.ToolBar'], function () {
              //   map.addControl(new AMap.ToolBar({
              //     position: 'RB'
              //   }))
              // })
              // 创建地图拖拽
              // let positionPicker = new PositionPicker({
              //   mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
              //   map: map // 依赖地图对象
              // })
              // 拖拽完成发送自定义 drag 事件
              // positionPicker.on('success', positionResult => {
              //   过滤掉初始化地图后的第一次默认拖放
              //   if (!this.dragStatus) {
              //     this.dragStatus = true
              //   } else {
              //     this.$emit('drag', positionResult)
              //   }
              // })
              // 启动拖放
              // positionPicker.start()
            })
          },40)
        }
      }
    },
    // async created () {
    //   // 已载入高德地图API，则直接初始化地图
    //   if (window.AMap && window.AMapUI) {
    //     console.log('我走了if')
    //     this.initMap()
    //     // 未载入高德地图API，则先载入API再初始化
    //   } else {
    //     await remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
    //     await remoteLoad(`https://webapi.amap.com/maps?v=1.4.8&key=${MapKey}`)
    //     console.log(window.AMap)
    //     console.log(window.AMapUI)
    //     if(window.AMapUI){
    //       this.initMap()
    //     }
    //     console.log('我走了else')
    //   }
    // },
    created () {
      // 已载入高德地图API，则直接初始化地图
      if (window.AMap && window.AMapUI) {
        this.initMap() // 未载入高德地图API，则先载入API再初始化
      } else { // 载入高德地图和UI组件
        Promise.all([
          remoteLoad(`https://webapi.amap.com/maps?v=1.4.8&key=${MapKey}`)
        ]).then(() => {
          setTimeout(() => { // 2s之后去window.AMap有值，再去调用main函数
            Promise.all([
              remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
            ])
              .then(() => { // 最后初始化地图
                this.initMap()
              })
          }, 2000)
        })
      }
    }
  }
</script>

<style lang="css">
  .m-map{ min-width: 500px; min-height: 300px; position: relative; }
  .m-map .map{ width: 100%; height: 100%; background: rgba(255,255,255,1);}
  .amap-logo {
    display: none !important;
  }
  .amap-copyright {
    display: none !important;
  }
  .amap-marker-label {
    background: red;
    padding: 10px;
    border: 1px solid #FFF;
    font-size: 14px;
  }
  .closeMapBtn {
    position: absolute;
    left: 70px;
    bottom: 20px;
    background: #000;
    border: 1px solid #ccc;
    cursor: pointer;
    outline: none;
    padding: 8px;
    color: #fff;
  }
  /*.m-map .search{ position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1; }*/
  /*.m-map .search input{ width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none; }*/
  /*.m-map .search button{ line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center; }*/
  /*.m-map .result{ max-height: 300px; overflow: auto; margin-top: 10px; }*/
</style>
