<template>
  <div id="bujian">
    <div class="unitManagement_data fireData">
      <el-table
        stripe
        style="width: 100%;"
        :data="changeUnitPage(curNum)"
      >
        <el-table-column :show-overflow-tooltip="true" prop="date" label="NO." min-width="35"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="systemType" label="系统类型" min-width="98"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="systemAddress" label="系统地址" min-width="98"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="type" label="部件类型" min-width="98"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="address" label="部件地址" min-width="98"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="runState" label="运行状态" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="fireAlarm" label="火警" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="breakdown" label="故障" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="shield" label="屏蔽" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="supervise" label="监管" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="using" label="启动" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="feedback" label="反馈" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="delayed" label="延时" min-width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="powerFailure" label="电源" min-width="90"></el-table-column>
      </el-table>
    </div>
    <div class="unitManagement_paging publicPaging">
      <span>当前一共存在 <i style="color: #6bc3e4;">{{Num}}</i> 条部件状态</span>
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
    <!--<el-table-->
      <!--:data="tableData"-->
      <!--class="huozai_box_table"-->
      <!--border-->
      <!--size="medium"-->
      <!--style="width: 100%;"-->
      <!--resizable-->
      <!--height="99%"-->
      <!--:header-cell-style="{ fontFamily: '宋体', fontSize: '0.875em', color: '#fff', background: 'rgba(14,30,65,1)', textAlign: 'center'}"-->
      <!--:cell-style="{ fontFamily: '宋体', fontSize: '0.75em', color: '#fff', textAlign: 'center', background: 'rgba(14,30,65,1)', padding: '0'}"-->
    <!--&gt;-->
      <!--<el-table-column prop="date" label="NO." min-width="35"></el-table-column>-->
      <!--<el-table-column prop="name" label="设备名称" min-width="98"></el-table-column>-->
      <!--<el-table-column prop="runState" label="运行状态" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="fireAlarm" label="火警" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="breakdown" label="故障" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="shield" label="屏蔽" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="supervise" label="监管" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="using" label="启用" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="feedback" label="反馈" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="delayed" label="延时" min-width="90"></el-table-column>-->
      <!--<el-table-column prop="bus" label="总线" min-width="90"></el-table-column>-->
    <!--</el-table>-->
    <!--<div class="bujian_page">-->
      <!--<span>当前一共存在 <i style="color: #6bc3e4;">{{totalNum}}</i> 条部件状态</span>-->
      <!--<el-pagination-->
        <!--background-->
        <!--small-->
        <!--layout="prev, pager, next"-->
        <!--:page-size="15"-->
        <!--prev-text="上一页"-->
        <!--next-text="下一页"-->
        <!--:total="totalNum">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
  let tableData = [
    // {
    //   date: '1',
    //   name: '火灾报警系统',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '2',
    //   name: '室内消防栓系统',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '3',
    //   name: '自动喷火灭火',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '4',
    //   name: '气体灭火',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '5',
    //   name: '防烟排烟系统',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '6',
    //   name: '防火门及卷帘',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '7',
    //   name: '消防电梯',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '8',
    //   name: '消防应急广播',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '9',
    //   name: '消防应急照明',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // },
    // {
    //   date: '10',
    //   name: '消防电话',
    //   runState: '',
    //   fireAlarm: '',
    //   breakdown: '',
    //   shield: '',
    //   supervise: '',
    //   using: '',
    //   feedback: '',
    //   delayed: '',
    //   bus: ''
    // }
  ]
  export default {
    name: "bujian",
    data() {
      return {
        tableData,
        curNum: 1,
        pageLen: 10
      }
    },
    computed: {
      Num(){
        return this.tableData.length
      },
      changeUnitPage(){ // 默认显示第一页，当点击翻页的时候传入当前页数，修改当前显示的内容
        return function (curNum) {
          let curTable = this.tableData.slice((curNum-1)*this.pageLen, curNum*this.pageLen)
          if(curTable.length<(this.pageLen-1)){ // 当不满十个时 添加空的进去
            for(let i=curTable.length; i<this.pageLen; i++){
              curTable.push({
                date: '-',
                systemType: '',
                systemAddress: '',
                type: '',
                address: '',
                runState: '',
                fireAlarm: '',
                breakdown: '',
                shield: '',
                supervise: '',
                using: '',
                feedback: '',
                delayed: '',
                powerFailure: ''
              })
            }
          }
          return curTable
        }
      }
    },
    mounted(){
      this.$http.get(this.url+'/api/Device/getComponentStates', {
        params: {
          UnitID: sessionStorage.getItem('areaID')
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            response.data.data.forEach((item, index) => {
              item.date = index+1
              item.systemType = item.systemType
              item.systemAddress = item.systemAddress
              item.type = item.type
              item.address = item.address
              item.runState =  item.state == 1?'正常':'测试'
              // item.runState = ''
              item.fireAlarm = item.fireAlarm == 1?'火警':'无火警'
              item.breakdown = item.malFunction == 1?'故障':'无故障'
              item.shield = item.shielding == 1?'屏蔽':'无屏蔽'
              item.supervise = item.monitor == 1?'监管':'无监管'
              item.using = item.operating == 1?'启动':'停止'
              item.feedback = item.feedback == 1?'反馈':'无反馈'
              item.delayed = item.delay == 1?'延时':'未延时'
              item.powerFailure = item.powerFailure == 1?'故障':'正常'
            })
            this.tableData = response.data.data
          }else {
            this.msg(response.data.msg, 'error')
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
