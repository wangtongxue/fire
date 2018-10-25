<template>
    <div id="yongchuan">
      <div class="unitManagement_data fireData">
        <el-table
          stripe
          style="width: 100%;"
          :data="tableData"
        >
          <el-table-column :show-overflow-tooltip="true" prop="NO" label="NO." min-width="35"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="ID" label="用传ID" min-width="98"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="state" label="正常监视状态" min-width="90"></el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="runState" label="运行状态" min-width="90"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="fireAlarm" label="火警" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="breakdown" label="故障" min-width="90"></el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="shield" label="屏蔽" min-width="90"></el-table-column>-->
          <!--<el-table-column :show-overflow-tooltip="true" prop="supervise" label="监管" min-width="90"></el-table-column>-->
          <!--<el-table-column :show-overflow-tooltip="true" prop="using" label="启用" min-width="90"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="feedback" label="主电" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="delayed" label="备电" min-width="90"></el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="bus" label="总线" min-width="90"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="communicateFailure" label="通信信道" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="monitorFailure" label="监测连接线路" min-width="90"></el-table-column>
        </el-table>
      </div>
      <!--<div class="unitManagement_paging publicPaging">-->
        <!--<span>当前一共存在 <i style="color: #6bc3e4;">{{Num}}</i> 条部件状态</span>-->
        <!--<el-pagination-->
          <!--v-if="Num"-->
          <!--background-->
          <!--:page-size="10"-->
          <!--@current-change="currentPageHandle"-->
          <!--@prev-click="prevPageHandle"-->
          <!--@next-click="nextPageHandle"-->
          <!--:pager-count="7"-->
          <!--:current-page="curNum"-->
          <!--layout="prev, pager, next"-->
          <!--:total="Num">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
</template>

<script>
  let tableData = [
    {
      NO: 1,
      ID: '',
      state: '',
      fireAlarm: '',
      breakdown: '',
      feedback: '',
      delayed: '',
      communicateFailure: '',
      monitorFailure:  ''
    }
  ]
  export default {
    name: "yongchuan",
    data() {
      return {
        tableData,
        // curNum: 1,
        // pageLen: 10
      }
    },
    mounted(){
      // 在这个阶段拿到tableData
      this.$http.get(this.url+'/api/Device/getDeviceStatus', {
        params: {
          UnitID: sessionStorage.getItem('areaID')
        }
      })
        .then((response)=> {
          // console.log(response.data)
          if(response.data.status == 1){
            // this.tableData = response.data.data
            // console.log(response)
            this.tableData[0].NO = 1
            this.tableData[0].ID = response.data.data.DeviceID
            this.tableData[0].state =  ''
            this.tableData[0].fireAlarm = response.data.data.fireAlarm == 1 ? '火警' : '无火警'
            this.tableData[0].breakdown = response.data.data.malFunction == 1 ? '故障' : '无故障'
            // this.tableData[0].shield =  ''
            // this.tableData[0].supervise =  ''
            // this.tableData[0].using =  ''
            this.tableData[0].feedback =  response.data.data.mainPowerFailure == 1 ? '故障' : '正常'
            this.tableData[0].delayed =  response.data.data.backupPowerFailure == 1 ? '故障' : '正常'
            this.tableData[0].communicateFailure =  response.data.data.communicateFailure == 1 ? '故障' : '正常'
            this.tableData[0].monitorFailure =  response.data.data.monitorFailure == 1 ? '故障' : '正常'
            // this.tableData[0].bus = ''
          }else {
            this.msg(response.data.msg, 'error')
            this.tableData = []
          }
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    computed: {
      // Num(){
      //   return this.tableData.length
      // },
      // changeUnitPage(){ // 默认显示第一页，当点击翻页的时候传入当前页数，修改当前显示的内容
      //   return function (curNum) {
      //     let curTable = this.tableData.slice((curNum-1)*this.pageLen, curNum*this.pageLen)
      //     if(curTable.length<(this.pageLen-1)){ // 当不满十个时 添加空的进去
      //       for(let i=curTable.length; i<this.pageLen; i++){
      //         curTable.push({
      //           NO: '-',
      //           ID: '',
      //           runState: '',
      //           fireAlarm: '',
      //           breakdown: '',
      //           shield: '',
      //           supervise: '',
      //           using: '',
      //           feedback: '',
      //           delayed: '',
      //           bus: ''
      //         })
      //       }
      //     }
      //     return curTable
      //   }
      // }
    },
    methods: {
      // currentPageHandle(curNum){ // 点击按钮翻页
      //   this.curNum = curNum
      // },
      // prevPageHandle(curNum){ // 向前翻页
      //   this.curNum = curNum
      // },
      // nextPageHandle(curNum){ // 向前翻页
      //   this.curNum = curNum
      // }
    }
  }
</script>

<style scoped>

</style>
