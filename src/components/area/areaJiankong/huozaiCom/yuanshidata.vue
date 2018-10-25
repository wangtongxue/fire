<template>
    <div id="oldData">
      <happy-scroll>
        <ul v-if="list.length">
          <li v-for="(item,index) in list">
            <span>{{index+1}}.&nbsp</span> 日志ID: &nbsp<span>{{item.id}}</span>,&nbsp 单位ID:&nbsp <span>{{item.UnitID}}</span>,&nbsp 设备编码:&nbsp <span>{{item.DeviceSn}}</span>,&nbsp 记录时间:&nbsp <span>{{item.addTime}}</span>, &nbsp 设备类型:&nbsp <span>{{item.type}}</span>,&nbsp notes:&nbsp <span>{{item.notes}}</span>
          </li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
          <li><br></li>
        </ul>
        <ul v-if="!list.length">
          <li>当前暂无原始数据</li>
        </ul>
      </happy-scroll>
    </div>
</template>

<script>
  export default {
    name: "yuanshidata",
    data(){
      return {
        list: []
      }
    },
    mounted(){
      this.$http.get(this.url + '/api/Msglog/getlog', {
        params: {
          UnitID: sessionStorage.getItem('areaID')
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            // console.log(response.data.data)
            response.data.data.forEach((item) => {
              if(item.type == 1){
                item.type = '用户传输装置'
              }else if(item.type == 2){
                item.type = '设施'
              }else if(item.type == 3){
                item.type = '部件'
              }
            })
            this.list = response.data.data
            // console.log(this.list)
          }else {
            this.list = []
              this.msg(response.data.msg, 'error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
</script>

<style scoped>

</style>
