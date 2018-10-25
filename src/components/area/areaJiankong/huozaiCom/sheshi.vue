<template>
    <div id="sheshi">
      <!--<table class="huozai_box_table"></table>-->
      <div class="unitManagement_data sheShiData">
        <el-table
          :data="changeUnitPage(curNum)"
          stripe
          style="width: 100%;"
        >
          <el-table-column :show-overflow-tooltip="true" prop="date" label="NO." min-width="40"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="type" label="系统类型" min-width="114"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="address" label="系统地址" min-width="114"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="runState" label="运行状态" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="fireAlarm" label="火警" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="breakdown" label="故障" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="shield" label="屏蔽" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="supervise" label="监管" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="using" label="启动" min-width="75"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="feedback" label="反馈" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="delayed" label="延时状态" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="mainPower" label="主电" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="powerReservation" label="备电" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="bus" label="总线" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="manual" label="手动/自动" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="configurationChange" label="配置" min-width="80"></el-table-column>

          <el-table-column :show-overflow-tooltip="true" prop="operatingStatus" label="复位" min-width="80"></el-table-column>
        </el-table>
      </div>
      <div class="unitManagement_paging sheShiPaging">
        <span>当前一共存在 <i style="color: #6bc3e4;">{{Num}}</i> 条设施状态</span>
        <el-pagination
          v-if="Num"
          background
          :page-size="10"
          @current-change="currentPageHandle"
          @prev-click="prevPageHandle"
          @next-click="nextPageHandle"
          :pager-count="7"
          :current-page="curNum"
          layout="prev, pager, next"
          :total="Num">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  let tableData = [
    // {
    //   date: '1',
    //   type: '',
    //   address: '',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   mainPower: '',
    //   powerReservation: '',
    //   bus: '',
    //   operatingStatus: '',
    //   configurationChange: '',
    //   reset: ''
    // }
  ]
    export default {
      name: "sheshi",
      watch: {

      },
      data() {
        return {
          tableData,
          curNum: 1,
          pageLen: 10
        }
      },
      computed: {
        Num(){
          return this.$store.state.sheShiData.length
        },
        sheShiDataList(){
          let d = this.$store.state.sheShiData
          // console.log(d)
          d.forEach((item, index) => {
            item.date = index+1
            item.type = item.type
            item.address = item.address
            item.runState = item.state == 1?'正常':'测试'
            // item.runState = ''
            item.fireAlarm = item.fireAlarm == 1?'火警':'无火警'
            item.breakdown = item.malFunction == 1?'故障':'无故障'
            item.shield = item.shielding == 1?'屏蔽':'无屏蔽'
            item.supervise = item.monitor == 1?'监管':'无监管'
            item.using = item.operating == 1?'启动':'停止'
            item.feedback = item.feedback == 1?'反馈':'无反馈'
            item.delayed = item.delay == 1?'延时':'未延时'
            item.mainPower = item.mainPowerFailure == 1?'故障':'正常'
            item.powerReservation = item.backupPowerFailure == 1?'故障':'正常'
            item.bus = item.busFailure == 1?'故障':'正常'
            item.manual = item.manual == 1?'手动':'自动'
            item.configurationChange = item.configChanging == 1?'配置改变':'正常'
            item.operatingStatus = item.reset == 1?'是':'否'
          })
          // for(let i=d.length; i<10; i++){
          //   d.push({
          //     date: '-'
          //   })
          // }
          return d
        },
        changeUnitPage(){ // 默认显示第一页，当点击翻页的时候传入当前页数，修改当前显示的内容
          return function (curNum) {
            let curTable = this.sheShiDataList.slice((curNum-1)*this.pageLen, curNum*this.pageLen)
            if(curTable.length<(this.pageLen-1)){ // 当不满十个时 添加空的进去
              for(let i=curTable.length; i<this.pageLen; i++){
                curTable.push({
                  date: '-'
                })
              }
            }
            return curTable
          }
        }
      },
      mounted(){
        if(this.$route.query.UnitID){ // 点击首页地图的图标进入此页面的时候获取到的当前单位ID
          // console.log(this.$route.query.UnitID)
        }
        this.$http.get(this.url + '/api/Device/getSystemStates', {
          params: {
            UnitID: sessionStorage.getItem('areaID')
          }
        })
          .then((response) => {
            if(response.data.status == 1){
              this.$store.commit('getSheShiData', response.data.data)
            }else {
              this.msg(response.data.msg, 'error')
              this.tableData = []
              this.$store.commit('getSheShiData', [])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      methods: {
        currentPageHandle(curNum){ // 点击按钮翻页
          this.curNum = curNum
        },
        prevPageHandle(curNum){ // 向前翻页
          this.curNum = curNum
        },
        nextPageHandle(curNum){ // 向前翻页
          this.curNum = curNum
        }
      }
    }
</script>

<style scoped>

</style>
