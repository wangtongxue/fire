<template>
  <div id="area">
    <div class="area_body">
      <div class="tab_head">
        <div id="unitName">当前单位：<span>{{getUnitName}}</span></div>
        <nav class="total_nav">
          <div><router-link exact to="/area/areaLink/jiankong" tag="a" id="jiankong" class="router-link-active">实时监控</router-link></div>
          <div><router-link to="/area/areaLink/guanli" tag="a">设备管理</router-link></div>
          <div><router-link to="/area/areaLink/fenxi" tag="a">数据分析</router-link></div>
        </nav>
      </div>
      <transition name="component-fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "areaPage",
    computed: {
      getUnitName(){
        let currentUnit = JSON.parse(sessionStorage.getItem('UnitList')).filter((item) => {
          if(this.$store.state.curUnitID){ // 当前先判断是否有store
            return item.ID == this.$store.state.curUnitID
          }else { // 再判断是否有session
            return item.ID == sessionStorage.getItem('areaID')
          }

        })
        return currentUnit[0].UnitName
      }
    }
  }
</script>

<style scoped>

</style>
