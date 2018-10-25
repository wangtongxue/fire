<template>
  <div class="public_css">
    <div class="unitManagement_nav" >系统设置 > 账号管理</div>
    <div class="unitManagement_box">
      <div class="unitManagement_search">
        <el-autocomplete
          v-model="state4"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入要查找的账号联系人"
          @select="handleSelect"
          clearable
          class="unitManagement_search_input">
        </el-autocomplete>
        <el-button class="unitManagement_search_button" @click="searchUnitHandle">搜索</el-button>
        <el-button v-show="currentUnitName.Permission == 3? false : true" class="accountBtn" @click="addAccount"><router-link style="cursor: pointer" to="" tag="a">+添加</router-link></el-button>
      </div>
      <div class="unitManagement_data">
        <el-table
          :data="changeUnitPage(curNum)"
          stripe
          style="width: 100%">
          <el-table-column :show-overflow-tooltip="true" prop="UserID" label="用户ID" min-width="40"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="Name" label="用户名" min-width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="PhoneNumber" label="联系电话" min-width="60"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="unit_name" label="单位名称" min-width="180"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="Permission" label="角色权限" min-width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="TimeOfCreation" label="创建时间" min-width="80"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="LastAccessIP" label="登陆IP" min-width="80"></el-table-column>
          <el-table-column  label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" class="unitManagement_data_bj" :style="{cursor: (scope.row['UnitID'] ?'pointer': 'default')}" type="text" size="small"><router-link style="cursor: pointer" to="">{{scope.row["UnitID"]? '编辑': ''}}</router-link></el-button>
              <el-button type="text" size="small" @click="deleteUserHandle(scope.row)" :style="{cursor: (scope.row['UnitID'] ?'pointer': 'default')}">{{scope.row["UnitID"]? '删除': '&nbsp'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="unitManagement_paging">
        <span>当前一共存在 <i style="color: #6bc3e4;">{{Num}}</i> 条单位信息</span>
        <el-pagination
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

      <div class="addManagement" v-show="addShow">
        <div  class="addManagement_header">添加账号>></div>
        <div  class="addManagement_body">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="95px" class="demo-ruleForm">
            <el-form-item label="手机：" prop="PhoneNumber">
              <el-input v-model="ruleForm.PhoneNumber" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="管理员：" prop="Name">
              <el-input v-model="ruleForm.Name" placeholder="请输入管理员姓名"></el-input>
            </el-form-item>
            <el-form-item label="单位名称：" >
              <el-input v-model="currentUnitName.UnitName" disabled ></el-input>
            </el-form-item>
            <el-form-item label="角色权限：" prop="Permission">
              <el-select v-model="ruleForm.Permission" placeholder="角色权限" @change="selectPerHandle">
                <el-option label="管理员" value="2" v-show="currentUnitName.Permission == 1 ? true : false"></el-option>
                <el-option label="用户" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="初始密码：" prop="Password">
              <el-input type="password" v-model="ruleForm.Password" placeholder="请输入6-18位，以字母开头的密码（不包含特殊字符）"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormAdd('ruleForm')">确认</el-button>
              <el-button @click="cancelAddHandle('ruleForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="addManagement" v-show="newShow">
        <div  class="addManagement_header">编辑账号>></div>
        <div  class="addManagement_body">
          <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="95px" class="demo-ruleForm">
            <el-form-item label="手机：" prop="PhoneNumber">
              <el-input disabled v-model="editRuleForm.PhoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="管理员：" prop="Name">
              <el-input v-model="editRuleForm.Name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="单位名称：" >
              <el-input v-model="currentUnitName.UnitName" disabled ></el-input>
            </el-form-item>
            <el-form-item label="角色权限：" prop="Permission">
              <el-select :disabled="editCurPermission" v-model="editRuleForm.Permission" placeholder="" @change="selectPerHandle">
                <el-option label="管理员" value="2" v-show="currentUnitName.Permission == 1 ? true : false"></el-option>
                <el-option label="用户" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="初始密码：" prop="Password">
              <el-input type="password" v-model="editRuleForm.Password" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormEdit('editRuleForm')">确认</el-button>
              <el-button @click="cancelEditHandle('editRuleForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div :class="{addShowMask: addShow || newShow}"></div>
  </div>
</template>

<script>
  export default {
    name: "accountManagement",
    watch: {
      state4(cur, old){
        if(!cur && old){ // 监控搜索框，当输入被清空触发
          this.$store.dispatch('getUserList', {
            that: this,
            UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
          })
        }
      }
    },
    computed: {
      queryUnitList(){ // 拿到所有可以查询的账号名称
        let userListArr = this.$store.state.userList
        let userNameList = []
        // console.log(unitListArr)
        for(let i=0; i<userListArr.length; i++){
          userNameList[i] = {}
          userNameList[i].value = userListArr[i].Name
        }
        return userNameList
      },
      Num(){ // 计算总共多少条账号数据
        return this.tableData.length
      },
      changeUnitPage(){ // 默认显示第一页，当点击翻页的时候传入当前页数，修改当前显示的内容
        return function (curNum) {
          let curTable = this.tableData.slice((curNum-1)*this.pageLen, curNum*this.pageLen)
          if(curTable.length<(this.pageLen-1)){ // 当不满十个时 添加空的进去
            for(let i=curTable.length; i<this.pageLen; i++){
              curTable.push({
                UnitID: '',
                Name: '',
                PhoneNumber: '',
                Contact: '',
                Permission: '',
                TimeOfCreation: '',
                LastAccessIP: ''
              })
            }
          }
          return curTable
        }
      },
      currentUnitName(){ // 获取到当前登陆账号的单位名称
        return {
          UnitName: JSON.parse(this.cookiesFn.getCookie('UserInfo')).unit_name,
          Permission: JSON.parse(this.cookiesFn.getCookie('UserInfo')).Permission,
          UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
          UserID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID
        }
      }
    },
    data() {
      return {
        editCurPermission: false,
        ruleForm: {
          Name: '',
          PhoneNumber: '',
          Permission:'',
          Password:''
        },
        rules: {
          PhoneNumber: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号' }
          ],
          Name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 11, message: '长度在至少2个字符', trigger: 'blur' }
          ],
          Permission: [
            { required: true, message: '请选择管理权限', trigger: 'change' }
          ],
          Password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入正确格式的密码', trigger: 'change' }
          ]
        },
        editRuleForm: {
          Name: '',
          PhoneNumber: '',
          Permission:'',
          Password:'',
          UserID: ''
        },
        editRules: {
          Name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 11, message: '长度在至少2个字符', trigger: 'blur' }
          ],
          Permission: [
            { required: true, message: '请选择管理权限', trigger: 'change' }
          ],
          Password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '请输入正确格式的密码', trigger: 'change' }
          ]
        },
        addShow:false,
        newShow:false, // 以上数值 为编辑添加内容块的数据
        curNum: 1, // 默认显示第一页的数据
        pageLen: 10,
        restaurants: [],
        state4: '',
        address:'',
        timeout:  null,
        tableData: []
      }
    },
    created(){
      this.$store.dispatch('getUserList', {
        that: this,
        UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
      })
    },
    methods: {
      selectPerHandle(item){ // 选中权限时触发
        // console.log(this.ruleForm.Permission)
      },
      addAccount() { // 点击添加账号按钮的时候，让弹窗出现
        this.addShow=!this.addShow
      },
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/User/addUser',
              data: {
                UnitID: this.currentUnitName.UnitID,
                UserID: this.currentUnitName.UserID,
                PhoneNumber: this.ruleForm.PhoneNumber,
                Name: this.ruleForm.Name,
                Permission: this.ruleForm.Permission,
                Password: this.ruleForm.Password
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                console.log(response)
                if(JSON.parse(response).status == 1){
                  that.msg(JSON.parse(response).msg, 'success') // 成功提示
                  that.addShow=!that.addShow // 让弹窗消失
                  that.$store.dispatch('getUserList', { // 添加成功重新刷新页面
                    that: that,
                    UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
                  })
                  that.$refs[formName].resetFields() // 清空添加信息
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
            //   url: this.url+'/api/User/addUser',
            //   params: {
            //     UnitID: this.currentUnitName.UnitID,
            //     UserID: this.currentUnitName.UserID,
            //     PhoneNumber: this.ruleForm.PhoneNumber,
            //     Name: this.ruleForm.Name,
            //     Permission: this.ruleForm.Permission,
            //     Password: this.ruleForm.Password
            //   },
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     console.log(response)
            //     if(response.data.status == 1){
            //       this.msg(response.data.msg, 'success') // 成功提示
            //       this.addShow=!this.addShow // 让弹窗消失
            //       this.$store.dispatch('getUserList', { // 添加成功重新刷新页面
            //         that: this,
            //         UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
            //       })
            //       this.$refs[formName].resetFields() // 清空添加信息
            //     }else {
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelAddHandle (formName) { // 点击 添加账号的取消按钮
        this.addShow=!this.addShow
        this.$refs[formName].resetFields()
      },
      submitFormEdit(formName) { // 编辑账号
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(this.editRuleForm)
            let obj = null
            if(this.editRuleForm.Password == 'admin123'){ // 当前没有修改密码
              obj = {
                UserID: this.editRuleForm.UserID,
                PhoneNumber: this.editRuleForm.PhoneNumber,
                Name: this.editRuleForm.Name,
                Permission: this.editRuleForm.Permission
              }
            }else { // 修改了密码
              obj = {
                UserID: this.editRuleForm.UserID,
                PhoneNumber: this.editRuleForm.PhoneNumber,
                Name: this.editRuleForm.Name,
                Permission: this.editRuleForm.Permission,
                Password: this.editRuleForm.Password
              }
            }

            // console.log(obj.Permission)
            // if(obj.Permission == '超级管理员'){
            //   obj.Permission = 1
            // }else if(obj.Permission == '管理员'){
            //   obj.Permission = 2
            // }else{
            //   obj.Permission = 3
            // }
            // console.log(obj)
            const that = this
            $.ajax({
              type: 'post',
              url: this.url+'/api/User/editUesr',
              data: obj,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              success: function (response) {
                // console.log(response)
                if(JSON.parse(response).status == 1){ // 编辑成功
                  that.msg(JSON.parse(response).msg, 'success')
                  that.newShow=!that.newShow // 弹窗消失
                  that.$store.dispatch('getUserList', { // 重新获取列表
                    that: that,
                    UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
                  })
                }else { // 编辑失败
                  that.msg(JSON.parse(response).msg, 'error')
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
            // this.$http({
            //   method: 'post',
            //   url: this.url+'/api/User/editUesr',
            //   params: obj,
            //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            // })
            //   .then((response) => {
            //     // console.log(response)
            //     if(response.data.status == 1){ // 编辑成功
            //       this.msg(response.data.msg, 'success')
            //       this.newShow=!this.newShow // 弹窗消失
            //       this.$store.dispatch('getUserList', { // 重新获取列表
            //         that: this,
            //         UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
            //       })
            //     }else { // 编辑失败
            //       this.msg(response.data.msg, 'error')
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error)
            //   })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelEditHandle (formName) { // 点击编辑的取消按钮
        this.newShow=!this.newShow
        this.$refs[formName].resetFields()
      },
      handleClick(row) { // 点击编辑时触发的按钮, 进行判断权限是否弹出编辑的弹窗
        this.editRuleForm.UserID = row.UserID
        // console.log(this.editRuleForm.UserID)
        let permission = '' // 存储当前编辑的这条账号的权限
        this.editCurPermission = false // 一进来权限下拉框都不禁用，根据下边的判断是否禁用
        // console.log(this.currentUnitName.Permission)
        // console.log(row.UserID)
        if(row.Permission == '超级管理员'){ // 拿到当前点击的这条账号的权限
          permission = 1
        }else if(row.Permission == '管理员'){
          permission = 2
        }else {
          permission = 3
        }
        if(row.UserID == JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID){ // 编辑的是本身  则不能修改权限
          this.editCurPermission = true
        }
        if(this.currentUnitName.Permission == 1){ // 超级管理员, 让每一个都能进行编辑
          this.newShow=true
          this.editRuleForm.Name = row.Name
          this.editRuleForm.PhoneNumber = row.PhoneNumber
          this.editRuleForm.Permission = row.Permission
          // console.log(row.Permission)
          this.editRuleForm.Password = 'admin123'
        }else if (this.currentUnitName.Permission == 2){ // 管理员账号， 只能编辑他本身和用户
          if(row.UserID == JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID || permission == 3){ // 当前点击的是管理员本身 或者用户 可以进行编辑
            this.newShow=true
            this.editRuleForm.Name = row.Name
            this.editRuleForm.PhoneNumber = row.PhoneNumber
            this.editRuleForm.Permission = row.Permission
            this.editRuleForm.Password = 'admin123'
          }else {
            this.msg('不能越权限编辑账号', 'error')
          }
        }else if(this.currentUnitName.Permission == 3){ // 用户， 只能编辑用户本身
          if(row.UserID == JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID){ // 当对本身进行编辑的时候
            this.newShow=true
            this.editRuleForm.Name = row.Name
            this.editRuleForm.PhoneNumber = row.PhoneNumber
            this.editRuleForm.Permission = row.Permission
            this.editRuleForm.Password = 'admin123'
          }else {
            this.msg('不能越权限编辑账号', 'error')
          }
        }
      },
      deleteUserHandle(row){
        if(row.UserID == JSON.parse(this.cookiesFn.getCookie('UserInfo')).UserID){ // 编辑的是本身  则不能修改权限
          return this.msg('没有权限删除', 'error')
        }else {
          const that = this
          this.alertFrame({
            title: '是否确定删除当前账号？',
            clickOkHandle () {
              $.ajax({
                type: 'post',
                url: that.url+'/api/User/deleteUser',
                data: {
                  UserID: row.UserID
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                success: function (response) {
                  console.log(response)
                  if(JSON.parse(response).status == 1){
                    that.msg(JSON.parse(response).msg, 'success')
                    // 点击删除之后 重新获取账号列表
                    that.$store.dispatch('getUserList', {
                      that: that,
                      UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
                    })
                    that.curNum = 1
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
              //   url: that.url+'/api/User/deleteUser',
              //   params: {
              //     UserID: row.UserID
              //   },
              //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              // })
              //   .then((response) => {
              //     console.log(response)
              //     if(response.data.status == 1){
              //       that.msg(response.data.msg, 'success')
              //       // 点击删除之后 重新获取账号列表
              //       that.$store.dispatch('getUserList', {
              //         that: that,
              //         UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
              //       })
              //       that.curNum = 1
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
        }
      },
      loadAll() { // 在mounted阶段加载全部的 可以查询的名称
        return this.queryUnitList
      },
      querySearchAsync(queryString, cb) { // 鼠标点击搜索框
        setTimeout(()=> {// 每次点击搜索框 会动态的去重新请求最新的名称
          this.restaurants = this.loadAll()
          let restaurants = this.restaurants
          if (restaurants.length > 0) { // 当有单位的时候，，把数据根据检索放在下拉框
            let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
            cb(results)
          } else { // 当没有单位时，显示暂无数据
            // this.msg('当前没有单位', 'error')
            cb([{value: '暂无单位'}])
          }
        },500)
      },
      createStateFilter(queryString) { /// 模糊匹配
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        }
      },
      handleSelect(item) {// 选中联系人请求数据
        const that = this
        this.$http.get(this.url+'/api/User/getUserList', {
          params: {
            UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
            Name: item.value
          }
        })
          .then((response) => {
            if(response.data.data){
              that.tableData = response.data.data
              for (let i=0; i<that.tableData.length; i++){
                if(that.tableData[i].Permission == 1){
                  that.tableData[i].Permission = "超级管理员"
                }else if (that.tableData[i].Permission == 2){
                  that.tableData[i].Permission = "管理员"
                }else {
                  that.tableData[i].Permission = "用户"
                }
              }
              this.curNum = 1
            }else {
              this.state4 = ''
              return this.msg('您查询的联系人不存在', 'error')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      searchUnitHandle(){ // 点击搜索
        if(!this.state4){
          this.msg('请输入要搜索的单位', 'error')
        }else {
          this.handleSelect({value: this.state4})
        }
      },
      currentPageHandle(curNum){ // 点击按钮翻页
        this.curNum = curNum
      },
      prevPageHandle(curNum){ // 向前翻页
        this.curNum = curNum
      },
      nextPageHandle(curNum){ // 向前翻页
        this.curNum = curNum
      }
    },
    mounted() {
      setTimeout(()=> {
        this.restaurants = this.loadAll()
      },1000)
    },
  }
</script>

<style scoped>

</style>
