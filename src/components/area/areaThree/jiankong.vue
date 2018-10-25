<template>
  <div class="table_body">
    <nav class="detail_nav">
      <ul class="clearfix">
        <router-link to="/area/areaLink/jiankong/huozai" tag="li"><a>火灾自动报警</a></router-link>
        <router-link to="/area/areaLink/jiankong/dianqi" tag="li"><a>电气火灾监控</a></router-link>
        <router-link to="/area/areaLink/jiankong/NB" tag="li"><a>NB-IOT烟感</a></router-link>
        <router-link to="/area/areaLink/jiankong/outroom" tag="li"><a>室外消防栓</a></router-link>
        <router-link to="/area/areaLink/jiankong/video1" tag="li"><a>视频</a></router-link>
      </ul>
    </nav>
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
    export default {
      name: "jiankong",
      watch: {
        $route(to){
          // console.log(to.path.indexOf('jiankong'))
        }
      }
    }
</script>

<style scoped>

</style>
