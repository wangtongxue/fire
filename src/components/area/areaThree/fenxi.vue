<template>
  <div class="fenxi_body">
    <nav class="fenxi_nav">
      <ul class="clearfix">
        <router-link to="/area/areaLink/fenxi/fenxi_huozai" tag="li"><a>火灾自动报警</a></router-link>
        <router-link to="/area/areaLink/fenxi/fenxi_dianqi" tag="li"><a>电气火灾监控</a></router-link>
        <router-link to="/area/areaLink/fenxi/fenxi_NB" tag="li"><a>NB-IOT烟感</a></router-link>
        <router-link to="/area/areaLink/fenxi/fenxi_outroom" tag="li"><a>室外消防栓</a></router-link>
        <router-link to="/area/areaLink/fenxi/fenxi_video" tag="li"><a>视频</a></router-link>
      </ul>
    </nav>
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "fenxi",
    watch: {
      $route(to){
        // console.log(to.path.indexOf('jiankong'))
      }
    },
    mounted(){
      document.getElementById('jiankong').classList.remove('router-link-active')
    }
  }
</script>

<style scoped>

</style>
