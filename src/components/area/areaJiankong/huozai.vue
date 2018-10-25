<template>
  <div class="huozai_box">
    <ul class="huozai_box_nav clearfix">
      <router-link to="/area/areaLink/jiankong/huozai/sheshi" tag="li"><a>设施系统状态</a></router-link>
      <router-link to="/area/areaLink/jiankong/huozai/bujian" tag="li"><a>设施部件状态</a></router-link>
      <router-link to="/area/areaLink/jiankong/huozai/baojingguzhang" tag="li"><a>报警故障记录</a></router-link>
      <router-link style="cursor: not-allowed; background: rgba(102,100,100, 0.6);" to="javascript:;" tag="li"><a style="cursor: not-allowed; color: gray!important;">设备分布图</a></router-link>
      <!--<router-link style="cursor: not-allowed" to="/area/areaLink/jiankong/huozai/shebeifenbu" tag="li"><a style="cursor: not-allowed">设备分布图</a></router-link>-->
      <router-link style="cursor: not-allowed; background: rgba(102,100,100, 0.6);"  to="javascript:;" tag="li"><a style="cursor: not-allowed;  color: gray!important;">视频联动</a></router-link>
      <!--<router-link style="cursor: not-allowed; background: #ccc;"  to="/area/areaLink/jiankong/huozai/shipin" tag="li"><a style="cursor: not-allowed">视频联动</a></router-link>-->
      <router-link to="/area/areaLink/jiankong/huozai/yuanshidata" tag="li"><a>原始数据</a></router-link>
      <router-link to="/area/areaLink/jiankong/huozai/yongchuan" tag="li"><a>用传状态</a></router-link>
    </ul>
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
    export default {
        name: "huozai"
    }
</script>

<style scoped>

</style>
