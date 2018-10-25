<template>
  <div id="baojing">
    <div class="unitManagement_data fireData">
      <el-table
        :data="changeUnitPage(curNum)"
        stripe
        style="width: 100%;"
      >
        <el-table-column :show-overflow-tooltip="true" prop="NO" label="NO." min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="type" label="设备类型" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="systemType" label="系统类型" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="systemAddress" label="系统地址" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="ownType" label="类型" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="address" label="地址" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="typeOfWarn" label="报警和故障类型" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="TimeStamp" label="时间" min-width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="note" label="备注" min-width="150"></el-table-column>
      </el-table>
    </div>
    <div class="unitManagement_paging publicPaging">
      <span>当前一共存在 <i style="color: #6bc3e4;">{{Num}}</i> 条报警故障记录</span>
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
  let tableData = []
  export default {
    name: "baojingguzhang",
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
                NO: '-',
                type: '',
                systemType: '',
                systemAddress: '',
                ownType: '',
                address: '',
                typeOfWarn: '',
                TimeStamp: '',
                note: ''
              })
            }
          }
          return curTable
        }
      }
    },
    mounted(){
      this.$http.get(this.url + '/api/Alarm/getAlarms', { // 请求当前单位的报警故障数据
        params: {
          UnitID: sessionStorage.getItem('areaID')
        }
      })
        .then((response) => {
          // console.log(response)
          if(response.data.status == 1){
            response.data.data.forEach((item, index) => {
              item.NO = response.data.data.length - index
              if(item.type == 1){
                item.type = '用户传输装置'
              }else if(item.type == 2){
                item.type = '设施'
              }else if(item.type == 3){
                item.type = '部件'
              }
              if(item.fireAlarm == 1){ // 火警
                item.typeOfWarn = '火警'
              }
              if(item.malFunction == 1){
                item.typeOfWarn = '故障'
              }
            })
            this.tableData = response.data.data.reverse()

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
