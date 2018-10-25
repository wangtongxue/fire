<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > 业务管理</div>
    <div class="public_box">
      <div class="bus_select_head">
        <el-form class="owner_form" :model="ownerForm" label-width="100px">
          <el-form-item class="owner_form_box" label="业主单位：" prop="unit">
            <el-select v-model="ownerForm.unit" placeholder="请选择业主单位" @change="selectUnitHandle">
              <el-option v-for="item in unitTableData" :key="item.ID" :label="item.UnitName" :value="item.ID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="outPort">
            <el-button class="outPortBtn" type="primary" @click="exportExcel">导出表格</el-button>
            <el-button class="addBtn" type="primary" @click="addHandle">+添加</el-button>
          </el-form-item>
          <!--<el-form-item class="add">-->
            <!---->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <div class="unitManagement_data yewuguanli">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          empty-text="当前单位暂无业务"
        >
          <el-table-column :show-overflow-tooltip="true" prop="no" label="NO." min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="BusinessType" label="业务类型" min-width="94"></el-table-column>
          <el-table-column  :show-overflow-tooltip="true"prop="StartDate" label="开始日期" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="EndDate" label="结束日期" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="DevicesQuantity" label="可连接设备数" min-width="90"></el-table-column>
          <!--<el-table-column :show-overflow-tooltip="true" prop="feilv" label="费率" min-width="90"></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="Amount" label="金额" min-width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="Note" label="备注" min-width="90"></el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <!--:style="{cursor: (scope.row['UnitID'] ?'pointer': 'default')}"     :style="{cursor: (scope.row['UnitID'] ?'pointer': 'default')}"        {{scope.row["UnitID"]? '编辑': ''}}-->
              <el-button @click="editHandleClick(scope.row)" class="unitManagement_data_bj" type="text" size="small" v-if="scope.row['BusinessType']" ><router-link style="cursor: pointer" to="javascript:;">编辑</router-link></el-button>
              <el-button type="text" size="small"  v-if="scope.row['BusinessType']" @click="deleteUserHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="addManagement" v-show="addShow">
        <div  class="addManagement_header">添加业务>></div>
        <div  class="addManagement_body">
          <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="95px" class="demo-ruleForm">
            <el-form-item label="业务类型：" prop="type">
              <el-select v-model="addRuleForm.type" disabled @change="selectTypeHandle">
                <el-option label="火灾自动报警系统" value="1"></el-option>
                <el-option label="电气火灾报警系统" value="2"></el-option>
                <el-option label="NB-IOT烟感" value="3"></el-option>
                <el-option label="室外消防栓" value="4"></el-option>
                <el-option label="视频" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备数量：" prop="connectNum">
              <el-select v-model="addRuleForm.connectNum" placeholder="请选择可连接设备数">
                <el-option label="1-100" value="1-100"></el-option>
                <el-option label="100-200" value="100-200"></el-option>
                <el-option label="200以上" value="200以上"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间设置：" prop="server" class="serverTime">
              <el-date-picker class="serverStart" v-model="addRuleForm.server.dateStart" type="date" placeholder="选择开始日期"></el-date-picker>
              <el-select class="serverLen" v-model="addRuleForm.server.serverTime" placeholder="请选择服务时长">
                <el-option label="一个月" value="1"></el-option>
                <el-option label="三个月" value="3"></el-option>
                <el-option label="六个月" value="6"></el-option>
                <el-option label="一 年" value="12"></el-option>
                <el-option label="两 年" value="24"></el-option>
                <el-option label="三 年" value="36"></el-option>
              </el-select>
              <el-input class="serverEnd" v-model="addRuleForm.server.dateEnd" disabled placeholder="结束日期"></el-input>
            </el-form-item>
            <el-form-item label="金额：" prop="money" id="addMoney">
              <el-input v-model="addRuleForm.money" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="备注：" class="beizhu" prop="beizhu">
              <el-input v-model="addRuleForm.beizhu" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormAdd('addRuleForm')">确认</el-button>
              <el-button @click="cancelAddHandle('addRuleForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="addManagement" v-show="editShow">
        <div  class="addManagement_header">编辑业务>></div>
        <div  class="addManagement_body">
          <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="95px" class="demo-ruleForm">
            <el-form-item label="业务类型：" prop="type">
              <el-select v-model="editRuleForm.type" disabled @change="selectTypeHandle">
                <el-option label="火灾自动报警系统" value="1"></el-option>
                <el-option label="电气火灾报警系统" value="2"></el-option>
                <el-option label="NB-IOT烟感" value="3"></el-option>
                <el-option label="室外消防栓" value="4"></el-option>
                <el-option label="视频" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备数量：" prop="connectNum">
              <el-select v-model="editRuleForm.connectNum" placeholder="请选择可连接设备数">
                <el-option label="1-100" value="1-100"></el-option>
                <el-option label="100-200" value="100-200"></el-option>
                <el-option label="200以上" value="200以上"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间设置：" prop="server" class="serverTime">
              <el-date-picker class="serverStart" v-model="editRuleForm.server.dateStart" type="date" placeholder="选择开始日期"></el-date-picker>
              <el-select class="serverLen" style="top: 1px;" v-model="editRuleForm.server.serverTime" placeholder="请选择服务时长">
                <el-option label="一个月" value="1"></el-option>
                <el-option label="三个月" value="3"></el-option>
                <el-option label="六个月" value="6"></el-option>
                <el-option label="一 年" value="12"></el-option>
                <el-option label="两 年" value="24"></el-option>
                <el-option label="三 年" value="36"></el-option>
              </el-select>
              <el-input class="serverEnd" v-model="editRuleForm.server.dateEnd" disabled placeholder="结束日期"></el-input>
            </el-form-item>
            <el-form-item label="金额：" prop="money" id="editMoney">
              <el-input v-model="editRuleForm.money" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="备注：" class="beizhu" prop="beizhu">
              <el-input v-model="editRuleForm.beizhu" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormEdit('editRuleForm')">确认</el-button>
              <el-button @click="cancelEditHandle('editRuleForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div :class="{addShowMask: addShow || editShow}"></div>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: "businessBill",
    watch: {
      addRuleForm: {
        handler(curVal,oldVal){ // 时间
          if(curVal.server.dateStart && curVal.server.serverTime){ // 火灾下
            let d = new Date(curVal.server.dateStart)
            curVal.server.dateEnd = this.getEndMonth(Number(curVal.server.serverTime.slice(0,2)), '-', d.getDate(), curVal.server.dateStart)
          }else if( !curVal.server.dateStart ){
            curVal.server.dateEnd = ''
          }
        },
        deep:true
      },
      editRuleForm: {
        handler(curVal,oldVal){ // 时间
          if(curVal.server.dateStart && curVal.server.serverTime){ // 火灾下
            let d = new Date(curVal.server.dateStart)
            curVal.server.dateEnd = this.getEndMonth(Number(curVal.server.serverTime.slice(0,2)), '-', d.getDate(), curVal.server.dateStart)
          }else if( !curVal.server.dateStart ){
            curVal.server.dateEnd = ''
          }
        },
        deep:true
      }
    },
    data(){
      return {
        ownerForm: {
          unit: ''
        },
        unitTableData: [],
        addRuleForm: {
          type: '1',
          connectNum: '1-100',
          server: {
            dateStart: '',
            serverTime: '',
            dateEnd: ''
          },
          beizhu: '',
          money: ''
        },
        editRuleForm: {
          type: '1',
          connectNum: '1-100',
          server: {
            dateStart: '',
            serverTime: '',
            dateEnd: ''
          },
          beizhu: '',
          money: ''
        },
        addRules: {
          money: [
            { required: true, message: '请输入数字金额', trigger: 'change' },
            { pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '只能输入数字金额'}
          ]
        },
        editRules: {
          money: [
            { required: true, message: '只能输入数字金额', trigger: 'change' },
            { pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '只能输入数字金额'}
          ]
        },
        tableData: [],
        addShow: false,
        editShow: false, // 以上数值 为编辑添加内容块的数据
      }
    },
    methods: {
      getEndMonth(num, format, day, startTime){ // 解决加月份的问题
        function getMonthBeforeFormatAndDay(num, format, day, startTime) {
          var date = new Date(startTime);
          date.setMonth(date.getMonth() + (num * 1), 1);
          //读取日期自动会减一，所以要加一
          var mo = date.getMonth() + 1;
          //小月
          if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
            if (day > 30) {
              day = 30
            }
          }
          //2月
          else if (mo == 2) {
            if (isLeapYear(date.getFullYear())) {
              if (day > 29) {
                day = 29
              } else {
                day = 28
              }
            }
            if (day > 28) {
              day = 28
            }
          }
          //大月
          else {
            if (day > 31) {
              day = 31
            }
          }
          var retureValue = date.format('yyyy' + format + 'MM' + format + day);
          return retureValue;
        }
        //JS判断闰年代码
        function isLeapYear(Year) {
          if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
            return (true);
          } else {
            return (false);
          }
        }
        //日期格式化
        Date.prototype.format = function (format) {
          var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
            // millisecond
          }
          if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
          return format;
        }
        return getMonthBeforeFormatAndDay(num, format, day, startTime)
      },
      addHandle() { // 点击添加账号按钮的时候，让弹窗出现
        this.addShow=!this.addShow
      },
      submitFormAdd(formName){ // 点击添加的提交的时候
        this.$refs[formName].validate((valid) => {
          if(valid && this.addRuleForm.server.dateStart && this.addRuleForm.server.serverTime){ // 这里是全部存在
            // 在此处发送请求
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/Order/addOrder',
              data: {
                UnitID: this.ownerForm.unit,
                UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
                PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
                BusinessType: this.addRuleForm.type,
                DevicesQuantity: this.addRuleForm.connectNum,
                StartDate: this.format(this.addRuleForm.server.dateStart, 'yyyy-MM-dd'),
                Duration: this.addRuleForm.server.serverTime,
                EndDate: this.addRuleForm.server.dateEnd,
                Amount: this.addRuleForm.money,
                Note: this.addRuleForm.beizhu
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                if(JSON.parse(response).status == 1){
                  that.msg(JSON.parse(response).msg, 'success')
                  that.cancelAddHandle(formName) // 成功之后清空内容
                  that.getOrderInfo(that.ownerForm.unit)
                }else {
                  that.msg(JSON.parse(response).msg, 'error')
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
            // this.$http({
            //   method: 'post',
            //   url: this.url+'/api/Order/addOrder',
            //   params: {
            //     UnitID: this.ownerForm.unit,
            //     UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
            //     PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
            //     BusinessType: this.addRuleForm.type,
            //     DevicesQuantity: this.addRuleForm.connectNum,
            //     StartDate: this.format(this.addRuleForm.server.dateStart, 'yyyy-MM-dd'),
            //     Duration: this.addRuleForm.server.serverTime,
            //     EndDate: this.addRuleForm.server.dateEnd,
            //     Amount: this.addRuleForm.money,
            //     Note: this.addRuleForm.beizhu
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     console.log(response)
            //     if(response.data.status == 1){
            //       this.msg(response.data.msg, 'success')
            //       this.cancelAddHandle(formName) // 成功之后清空内容
            //       this.getOrderInfo(this.ownerForm.unit)
            //     }else {
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          }else if(!this.addRuleForm.server.dateStart || !this.addRuleForm.server.serverTime){
            this.msg('请手动选择时间并输入金额', 'error')
          }else if(!valid){
            return this.msg('金额必须为正整数', 'error')
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancelAddHandle(formName){ // 点击添加界面的取消
        this.addShow=!this.addShow
        this.addRuleForm.server.dateStart = ''
        this.addRuleForm.server.serverTime = ''
        this.addRuleForm.server.dateEnd = ''
        this.$refs[formName].resetFields()
      },
      editHandleClick(row){ // 点击编辑显示弹窗
        this.editShow=!this.editShow
        console.log(row)
        this.editRuleForm.server.dateStart = row.StartDate
        this.editRuleForm.server.serverTime = row.Duration + ''
        this.editRuleForm.connectNum = row.DevicesQuantity
        this.editRuleForm.money = row.Amount
        this.editRuleForm.beizhu = row.Note
      },
      submitFormEdit(formName){ // 确定编辑触发的函数
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/Order/editOrder',
              data: {
                OrderNo: this.tableData[0].OrderNo,
                UnitID: this.ownerForm.unit,
                UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
                PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
                BusinessType: this.editRuleForm.type,
                DevicesQuantity: this.editRuleForm.connectNum,
                StartDate: this.editRuleForm.server.dateStart,
                Duration: this.editRuleForm.server.serverTime,
                EndDate: this.editRuleForm.server.dateEnd,
                Amount: this.editRuleForm.money,
                Note: this.editRuleForm.beizhu
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                console.log(response)
                if(JSON.parse(response).status == 1){
                  that.editShow=!that.editShow
                  that.msg('编辑成功', 'success')
                  that.getOrderInfo(that.ownerForm.unit)
                }else {
                  that.msg(JSON.parse(response).msg, 'error')
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
            // this.$http({
            //   method: 'post',
            //   url: this.url+'/api/Order/editOrder',
            //   params: {
            //     OrderNo: this.tableData[0].OrderNo,
            //     UnitID: this.ownerForm.unit,
            //     UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID,
            //     PhoneNumber: JSON.parse(this.cookiesFn.getCookie('UserInfo')).PhoneNumber,
            //     BusinessType: this.editRuleForm.type,
            //     DevicesQuantity: this.editRuleForm.connectNum,
            //     StartDate: this.editRuleForm.server.dateStart,
            //     Duration: this.editRuleForm.server.serverTime,
            //     EndDate: this.editRuleForm.server.dateEnd,
            //     Amount: this.editRuleForm.money,
            //     Note: this.editRuleForm.beizhu
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     console.log(response)
            //     if(response.data.status == 1){
            //       this.editShow=!this.editShow
            //       this.msg('编辑成功', 'success')
            //       this.getOrderInfo(this.ownerForm.unit)
            //     }else {
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancelEditHandle(formName){ // 取消编辑触发的函数
        this.editShow=!this.editShow
        this.editRuleForm.server.dateStart = ''
        this.editRuleForm.server.serverTime = ''
        this.editRuleForm.server.dateEnd = ''
        this.$refs[formName].resetFields()
      },
      deleteUserHandle(row){
        const that = this
        this.alertFrame({
          title: '是否确定删除当前业务？',
          clickOkHandle () {
            $.ajax({
              type: 'post',
              url: that.url+'/api/Order/deleteOrder',
              data: {
                OrderNo: that.tableData[0].OrderNo
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                if(JSON.parse(response).status == 1){
                  that.msg(JSON.parse(response).msg, 'success')
                  that.getOrderInfo(that.ownerForm.unit)
                }else {
                  that.msg(JSON.parse(response).msg, 'error')
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
            // that.$http({
            //   method: 'post',
            //   url: that.url+'/api/Order/deleteOrder',
            //   params: {
            //     OrderNo: that.tableData[0].OrderNo
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     if(response.data.status == 1){
            //       that.msg(response.data.msg, 'success')
            //       that.getOrderInfo(that.ownerForm.unit)
            //     }else {
            //       that.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          },
          catchInfo: '已取消删除'
        })
      },
      selectTypeHandle(){

      },
      selectUnitHandle(){ // 选中业主单位的时候触发的函数
        this.getOrderInfo(this.ownerForm.unit)
      },
      exportExcel () {
        var wb = XLSX.utils.table_to_book(document.querySelector('.el-table'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '业务账单.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      format(time, format){ //  处理时间格式
        let t = new Date(time);
        let tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
          switch(a){
            case 'yyyy':
              return tf(t.getFullYear());
              break;
            case 'MM':
              return tf(t.getMonth() + 1);
              break;
            case 'mm':
              return tf(t.getMinutes());
              break;
            case 'dd':
              return tf(t.getDate());
              break;
            case 'HH':
              return tf(t.getHours());
              break;
            case 'ss':
              return tf(t.getSeconds());
              break;
          }
        })
      },
      getOrderInfo(unit){ // 获取业务的table数据
        this.$http.get(this.url+ '/api/Order/getOrderInfo', { // 这里是进入界面发送请求拿到table数据
          params: {
            UnitID: unit
          }
        })
          .then((response) => {
            if(response.data.status == 1){
              this.tableData = response.data.data
              this.tableData.forEach((item)=> {
                if(item.BusinessType == 1){
                  item.BusinessType = '火灾自动报警系统'
                  item.no = 1
                }
              })
              if(this.tableData.length<11){
                for (let i=this.tableData.length; i< 12; i++){
                  this.tableData[i] = {
                    no: '-'
                  }
                }
              }
            }else {
              // this.msg(response.data.msg, 'error')
              console.log(this.tableData)
              this.tableData = []

            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    created(){
      this.$http.get(this.url+'/api/Related_unit/getOwnerUnits', { // 获取业主单位的数据
        params: {
          id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
        }
      })
        .then((response) => {
          this.unitTableData = response.data.data
          this.ownerForm.unit = this.unitTableData[0].ID // 默认给他一个值
          this.getOrderInfo(this.ownerForm.unit)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
</script>

<style scoped>

</style>
