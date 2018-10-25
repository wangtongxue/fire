<template>
    <div class="public_css">
      <div class="unitManagement_nav" >系统设置 > 单位管理</div>
      <div class="unitManagement_box">
        <div class="unitManagement_search">
          <el-autocomplete
            v-model="state4"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入要查找的单位"
            @select="handleSelect"
            clearable
            class="unitManagement_search_input">
          </el-autocomplete>
          <el-button class="unitManagement_search_button" @click="searchUnitHandle">搜索</el-button>
          <router-link  class="unitManagement_add_button unitAddBtn" v-show="getTypeOfUnit" style="cursor: pointer" to="/system/unitManagement/addDanwei" tag="a">+添加</router-link>
        </div>
        <div class="unitManagement_data">
          <el-table
            :data="changeUnitPage(curNum)"
            stripe
            style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="NO" label="NO." min-width="40"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="TypeOfUnit" label="单位类型" min-width="50"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="UnitName" label="名称" min-width="130"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="dizhi" label="单位地址" min-width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="Contact" label="联系人" min-width="40"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="PhoneNumber" label="电话" min-width="55"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="TimeOfCreation" label="创建时间" min-width="80"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" min-width="60">
              <template slot-scope="scope">
                <span @click="handleClick(scope.row)"><router-link   class="unitManagement_data_bj unitEditBtn" :style="{cursor: (scope.row['ID'] ?'pointer': 'default')}"  style="cursor: pointer" :to="{path: '/system/unitManagement/editorDanwei', query: { row: scope.row }}" tag="a">{{scope.row["ID"]? '编辑': ''}}</router-link></span>
                <el-button type="text" size="small" @click="deleteUnitHandle(scope.row)" :style="{cursor: (scope.row['ID'] ?'pointer': 'default')}">{{scope.row["ID"]? '删除': '&nbsp'}}</el-button>
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
      </div>
    </div>
</template>

<script>
  export default {
    name: "unitManagement",
    watch: {
      state4(cur, old){
        if(!cur && old){ // 监控搜索框，当输入被清空触发
          this.$store.dispatch('getUnitList', {
            that: this,
            UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
          })
        }
      }
    },
    data() {
      return {
        restaurants: [],
        state4: '',
        address:'',
        timeout:  null,
        unitData: null,
        tableData: [],
        curNum: 1,
        pageLen: 10
      }
    },
    computed: {
      queryUnitList(){ // 拿到所有可以查询的单位名称
        let unitListArr = JSON.parse(sessionStorage.getItem('UnitList'))
        let unitNameList = []
        // console.log(unitListArr)
        for(let i=0; i<unitListArr.length; i++){
          unitNameList[i] = {}
          unitNameList[i].value = unitListArr[i].UnitName
        }
        return unitNameList
      },
      getTypeOfUnit(){
        if(JSON.parse(this.cookiesFn.getCookie('UserInfo')).TypeOfUnit == 0 || JSON.parse(this.cookiesFn.getCookie('UserInfo')).TypeOfUnit == 1){
          return true
        }else if (JSON.parse(this.cookiesFn.getCookie('UserInfo')).TypeOfUnit == 2){
          return false
        }
      },
      Num(){
        return this.tableData.length
      },
      changeUnitPage(){ // 默认显示第一页，当点击翻页的时候传入当前页数，修改当前显示的内容
        return function (curNum) {
          let curTable = this.tableData.slice((curNum-1)*this.pageLen, curNum*this.pageLen)
          if(curTable.length<(this.pageLen-1)){ // 当不满十个时 添加空的进去
            for(let i=curTable.length; i<this.pageLen; i++){
              curTable.push({
                NO: '',
                TypeOfUnit: '',
                UnitName: '',
                dizhi: '',
                Contact: '',
                PhoneNumber: '',
                TimeOfCreation: ''
              })
            }
          }
          return curTable
        }
      }
    },
    methods: {
      handleClick(row) {
        sessionStorage.setItem('currentUnitRow', JSON.stringify(row))
      },
      loadAll() {
        return this.queryUnitList
      },
      querySearchAsync(queryString, cb) { // 每次点击搜索框 会动态的去重新请求最新的名称
        setTimeout(()=> {
          this.restaurants = this.queryUnitList
          console.log(this.restaurants)
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
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        }
      },
      handleSelect(item) { // 选中单位请求数据
        const that = this
        this.$http.get(this.url+'/api/Unit/getUnitList', {
          params: {
            id: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID,
            UnitName: item.value
          }
        })
          .then((response) => {
            if(response.data.data){
              that.tableData = response.data.data
              for (let i=0; i<that.tableData.length; i++){
                that.tableData[i].NO = i+1
                if(that.tableData[i].TypeOfUnit == 0){
                  that.tableData[i].TypeOfUnit = "超级单位"
                }else if (that.tableData[i].TypeOfUnit == 1){
                  that.tableData[i].TypeOfUnit = "经营单位"
                }else {
                  that.tableData[i].TypeOfUnit = "业主单位"
                }
                that.tableData[i].dizhi = that.tableData[i].province+that.tableData[i].city+that.tableData[i].district+that.tableData[i].town+that.tableData[i].AddOther
              }
              this.curNum = 1
            }else {
              this.state4 = ''
              return this.msg('您查询的单位不存在', 'error')
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
      deleteUnitHandle(row){ // 删除某条单位
        console.log(row.ID)
        if(row.ID == JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID){
          return this.msg('没有权限删除', 'error')
        }else {
          const that = this
          this.alertFrame({
            title: '是否确定删除当前单位？',
            clickOkHandle () {
              $.ajax({
                type: 'post',
                url: that.url+'/api/Unit/delUnit',
                data: {
                  UnitID: row.ID
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                success: function (response) {
                  console.log(response)
                  if(JSON.parse(response).status == 1){
                    that.msg(JSON.parse(response).msg, 'success')
                    // 点击删除之后 重新获取单位列表
                    that.$store.dispatch('getUnitList', {
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
              //   url: that.url+'/api/Unit/delUnit',
              //   params: {
              //     UnitID: row.ID
              //   },
              //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              // })
              //   .then((response) => {
              //     console.log(response)
              //     if(response.data.status == 1){
              //       that.msg(response.data.msg, 'success')
              //       // 点击删除之后 重新获取单位列表
              //       that.$store.dispatch('getUnitList', {
              //         that: that,
              //         UnitID: JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID
              //       })
              //       that.curNum = 1
              //       // console.log(JSON.parse(that.cookiesFn.getCookie('UserInfo')).UnitID)
              //       // console.log(that.queryUnitList)
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
    created(){
      this.$store.dispatch('getUnitList', {
        that: this,
        UnitID: JSON.parse(this.cookiesFn.getCookie('UserInfo')).UnitID
      })
    },
    mounted() {
      setTimeout(()=> {
        this.restaurants = this.loadAll()
      },1000)
    }
  }
</script>

<style scoped>

</style>
