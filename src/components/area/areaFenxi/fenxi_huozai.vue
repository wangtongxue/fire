<template>
  <div class="fenxi_body_box clearfix">
    <div class="fenxi_line">
      <div id="lineContainer"></div>
    </div>
    <div class="fenxi_pie">
      <div id="echartContainer"></div>
    </div>
    <div class="fenxi_table">
      <el-table
        class="huozai_box_table"
        :header-cell-style="{ fontFamily: '宋体', fontSize: '0.875em', color: '#fff', background: '#2d5499', textAlign: 'center',border: '0'}"
        :cell-style="{ fontFamily: '宋体', fontSize: '0.75em', color: '#fff', textAlign: 'center', border: '0', background: '#0b308f'}"
        :data="tableData"
        style="width: 90%; border: 0; margin: 10% 7%; "
        >
        <el-table-column :show-overflow-tooltip="true" prop="danwei" label="单位名称" min-width="160"></el-table-column>
        <el-table-column prop="shebeiNum" label="设备总数" min-width="60"></el-table-column>
        <el-table-column prop="zhengchang" label="正常设备数" min-width="60"></el-table-column>
        <el-table-column prop="guzhang" label="故障设备数" min-width="60"></el-table-column>
        <el-table-column prop="baojing" label="报警设备数" min-width="60"></el-table-column>
        <el-table-column prop="lixian" label="离线设备数" min-width="60"></el-table-column>
      </el-table>
      <div class="table_title">部件数据统计表</div>
    </div>
  </div>
</template>

<script>
  let tableData = [
    {
      danwei: '杭州极英信息科技有限公司',
      shebeiNum: 10,
      zhengchang: 7,
      guzhang: 1,
      baojing: 1,
      lixian: 1
    }
  ]
  // 引入基本模板
  let echarts = require('echarts/lib/echarts');
  // 引入饼图组件
  require('echarts/lib/chart/pie');
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/line');
  // 引入提示框和图例组件
  require('echarts/lib/component/title');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/legend');
  require("echarts/lib/component/legendScroll");
  export default {
    name: "fenxi_huozai",
    data() {
      return {
        myChart: null,
        lineChart: null,
        tableData,
        addDateArr: [],
        resData: ''
      }
    },
    created(){

    },
    mounted() {
      this.$http.get(this.url + '/api/Alarm/getAlarms', {
        params: {
          UnitID: sessionStorage.getItem('areaID')
        }
      })
        .then((response) => {
          if(response.data.status == 1){
            this.addDateArr = []
            let list = response.data.data
            this.resData = list
            let curTimeW = list[0].TimeStamp.slice(0,10)
            let curTimeD = list[0].TimeStamp.slice(0,10)
            let warnArr = [], defaultArr = [], n = 0, i = 0

            list.forEach((item) => {
              /*
              * 拿到所有的故障报警数据列表
              * 1. 判断类型
              * 2. 判断当前日期和上一个的日期是否相同，
              *     若相同：日期则作为数组对应的下标，并附上对应的数值或者数值+1
              *     不相同：日期作为数组对应的下标，赋上对应的值，并将当前日期更换为现在这一日期
              * 3. 最终得到两个数组：故障报警分别对应的数组（里边的值：下标是对应的日期， 值为对应下标日期的故障报警次数）
              * */
              if(item.fireAlarm == 1){ // 当前是火警
                if(item.TimeStamp.slice(0,10) == curTimeW){ // 看看当前项和上一个时间是不是相同
                  warnArr.length == 0 ? warnArr[Number(item.TimeStamp.slice(8,10))] = 1 : warnArr[Number(item.TimeStamp.slice(8,10))]++
                }else {
                  warnArr[Number(item.TimeStamp.slice(8,10))] = 1
                  curTimeW = item.TimeStamp.slice(0,10)
                }
              }else if(item.malFunction == 1){ // 当前是故障
                if(item.TimeStamp.slice(0,10) == curTimeD){ // 看看当前项和上一个时间是不是相同
                  defaultArr.length == 0 ? defaultArr[Number(item.TimeStamp.slice(8,10))] = 1 : defaultArr[Number(item.TimeStamp.slice(8,10))]++
                }else {
                  defaultArr[Number(item.TimeStamp.slice(8,10))] = 1
                  curTimeD = item.TimeStamp.slice(0,10)
                }
              }
            })
            let addDate = this.getNextDay(this.getDate())
            this.addDateArr.push(addDate) // 拿到当前日期对应的前一个月的日期的后一天
            /*
            * 当前日期和循环向后加一天的日期进行比对，最终得到当前日期向前一个月的数组
            * */
            while(this.getNowFormatDate().slice(8,10) != addDate.slice(addDate.length-2, addDate.length)){
              addDate = this.getNextDay(addDate)
              this.addDateArr.push(addDate)
            }
            /*
            * 对日期数组进行处理，将xxxx-xx-xx的日期截取拿到最后xx存到数组中
            * */
            this.addDateArr.forEach((item, index)=> {
              this.addDateArr[index] = item.slice(item.length-2, item.length)
            })
            /*
            * 将日期数组最后一项改成xx-xx的带月份的日期
            * */
            this.addDateArr.splice(this.addDateArr.length-1, 1, this.getNowFormatDate().slice(5,10))
            this.lineChart = echarts.init(document.getElementById('lineContainer')) // 绘制线性表
            let aa = [], bb = [] // 用来存放根据日期数组和报警故障数组生成的对应的当天报警数的数组
            this.addDateArr.forEach((item,index)=> {
              item = item.length == 2?item:item.slice(3, 5) // 这是判断日期数组的最后一个值进行截取成xx的格式
              if(warnArr[Number(item)] == undefined){
                aa[index] = 0
              }else {
                aa[index] = warnArr[Number(item)]
              }
              if(defaultArr[Number(item)] == undefined){
                bb[index] = 0
              }else {
                bb[index] = defaultArr[Number(item)]
              }
            })

            let option = {
              title: {
                text: '最近30天报警、故障趋势图',
                left: 'center',
                bottom: '0',
                textStyle: {
                  color: '#fff',
                  fontWeight: 'normal',
                  fontFamily: '宋体',
                  fontSize: '20px'
                }
              },
              tooltip : {
                trigger: 'axis',
                formatter: function (params) {
                  let res = '<div style="padding: 10px;"><p>日期：<span style="color: #71c7d5; font-size: 17px;">' + params[0].name + '日</span></p></div>'
                  for(let i=0; i<params.length; i++){
                    if(params[i].seriesName == '报警'){
                      res += '<p style="padding: 10px;">' + params[i].seriesName + '：<span style="color: red; font-size: 18px;">' + params[i].data + '次</span></p>'
                    }else {
                      res += '<p style="padding: 10px;">' + params[i].seriesName + '：<span style="color: yellow; font-size: 18px;">' + params[i].data + '次</span></p>'
                    }

                  }
                  return res
                }
              },
              legend: {
                icon: 'line',
                type: 'scroll',
                orient: 'vertical',
                left: 60,
                top: 60,
                bottom: 0,
                data:[
                  {
                    name: '报警',
                    textStyle: {
                      color: 'red'
                    }
                  },
                  {
                    name: '故障',
                    textStyle: {
                      color: 'yellow'
                    }
                  }
                ]
              },
              toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              xAxis: {
                type: 'category',
                name: '单位：(日)',
                nameTextStyle: {
                  color: ['#66c4f0']
                },
                boundaryGap : false,
                show: true,
                data: this.addDateArr.concat([]),
                axisLine: {
                  lineStyle: {
                    color: '#fff'
                  }
                },
                axisLabel:{
                  interval:0
                }
              },
              yAxis: {
                type: 'value',
                name: '单位：(次)',
                splitLine: {
                  lineStyle: {
                    color: 'rgba(0,0,0,0.4)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#fff'
                  }
                },
                nameTextStyle: {
                  color: ['#66c4f0']
                }
              },
              series : [
                {
                  name:'故障',
                  type:'line',
                  smooth:true,
                  // itemStyle: {normal: {areaStyle: {color: 'yellow'}}},
                  itemStyle: {normal: {color: 'yellow'}},
                  data: bb
                },
                {
                  name:'报警',
                  type:'line',
                  smooth:true,
                  // itemStyle: {normal: {areaStyle: {color: 'red'}}},
                  itemStyle: {normal:{color:'red'}},
                  data:aa
                }
              ]
            }
            this.lineChart.setOption(option)
          }else {
            this.addDateArr = []
            let addDate = this.getNextDay(this.getDate())
            this.addDateArr.push(addDate)
            while(this.getNowFormatDate().slice(8,10) != addDate.slice(addDate.length-2, addDate.length)){
              addDate = this.getNextDay(addDate)
              this.addDateArr.push(addDate)
              // console.log(addDate)
            }
            this.addDateArr.forEach((item, index)=> {
              this.addDateArr[index] = item.slice(item.length-2, item.length)
            })
            this.addDateArr.splice(this.addDateArr.length-1, 1, this.getNowFormatDate().slice(5,10))
            let aa = [], bb = []
            this.addDateArr.forEach((item, index)=> {
              aa[index] = 0
              bb[index] = 0
            })
            this.lineChart = echarts.init(document.getElementById('lineContainer')) // 绘制线性表
            let option = {
              title: {
                text: '最近30天报警、故障趋势图',
                left: 'center',
                bottom: '0',
                textStyle: {
                  color: '#fff',
                  fontWeight: 'normal',
                  fontFamily: '宋体',
                  fontSize: '20px'
                }
              },
              tooltip : {
                trigger: 'axis',
                formatter: function (params) {
                  let res = '<div style="padding: 10px;"><p>日期：<span style="color: #71c7d5; font-size: 17px;">' + params[0].name + '日</span></p></div>'
                  for(let i=0; i<params.length; i++){
                    if(params[i].seriesName == '报警'){
                      res += '<p style="padding: 10px;">' + params[i].seriesName + '：<span style="color: red; font-size: 18px;">' + params[i].data + '次</span></p>'
                    }else {
                      res += '<p style="padding: 10px;">' + params[i].seriesName + '：<span style="color: yellow; font-size: 18px;">' + params[i].data + '次</span></p>'
                    }

                  }
                  return res
                }
              },
              legend: {
                icon: 'line',
                type: 'scroll',
                orient: 'vertical',
                left: 60,
                top: 60,
                bottom: 0,
                data:[
                  {
                    name: '报警',
                    textStyle: {
                      color: 'red'
                    }
                  },
                  {
                    name: '故障',
                    textStyle: {
                      color: 'yellow'
                    }
                  }
                ]
              },
              toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              xAxis: {
                type: 'category',
                name: '单位：(日)',
                nameTextStyle: {
                  color: ['#66c4f0']
                },
                boundaryGap : false,
                show: true,
                data: this.addDateArr.concat([]),
                axisLine: {
                  lineStyle: {
                    color: '#fff'
                  }
                },
                axisLabel:{
                  interval:0
                }
              },
              yAxis: {
                type: 'value',
                name: '单位：(次)',
                splitLine: {
                  lineStyle: {
                    color: 'rgba(0,0,0,0.4)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#fff'
                  }
                },
                nameTextStyle: {
                  color: ['#66c4f0']
                }
              },
              series : [
                {
                  name:'故障',
                  type:'line',
                  smooth:true,
                  // itemStyle: {normal: {areaStyle: {color: 'yellow'}}},
                  itemStyle: {normal: {color: 'yellow'}},
                  data: aa
                },
                {
                  name:'报警',
                  type:'line',
                  smooth:true,
                  // itemStyle: {normal: {areaStyle: {color: 'red'}}},
                  itemStyle: {normal:{color:'red'}},
                  data: bb
                }
              ]
            }
            this.lineChart.setOption(option)
          }

        })
        .catch((error) => {
          console.log(error)
        })

      this.myChart = echarts.init(document.getElementById('echartContainer')) // 绘制图表
      this.myChart.setOption({
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          text: '部件状态扇形统计图',
          left: 'center',
          bottom: '0',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: '20px',
            fontFamily: '宋体'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          icon: 'rect',
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          top: 20,
          bottom: 0,
          data: [
            {
              name: '正常',
              textStyle: {
                color: 'green'
              }
            },
            {
              name: '故障',
              textStyle: {
                color: 'yellow'
              }
            },
            {
              name: '离线',
              textStyle: {
                color: 'gray'
              }
            },
            {
              name: '报警',
              textStyle: {
                color: 'red'
              }
            }
          ],
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: 'NUM',
            type: 'pie',
            data: [
              {value:10, name:'正常', itemStyle: {color: 'green'}},
              {value:5, name:'故障', itemStyle: {color: 'yellow'}},
              {value:2, name:'离线', itemStyle: {color: 'grey'}},
              {value:1, name:'报警', itemStyle: {color: 'red'}}
            ].sort(function (a, b) { return a.value - b.value; })
          }
        ]
      })
      this.changeChartWH()
    },
    methods: {
      changeChartWH(){
        const that = this
        window.addEventListener('resize', function () {
          that.myChart.resize()
          that.lineChart.resize()
        })
      },
      getDate(){
        var now=new Date();
        var year = now.getFullYear();//getYear()+1900=getFullYear()
        var month = now.getMonth() +1;//0-11表示1-12月
        var day = now.getDate();
        if(parseInt(month)<10){
          month="0"+month;
        }
        if(parseInt(day)<10){
          day="0"+day;
        }

        now =year + '-'+ month + '-' + day;

        if (parseInt(month) ==1) {//如果是1月份，则取上一年的12月份
          return (parseInt(year) - 1) + '-12-' + day;
        }

        var  preSize= new Date(year, parseInt(month)-1, 0).getDate();//上月总天数
        if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
          return year + '-' + month + '-01';
        }

        if(parseInt(month) <=10){
          return year + '-0' + (parseInt(month)-1) + '-' + day;
        }else{
          return year + '-' + (parseInt(month)-1) + '-' + day;
        }

      },
      getNextDay(d){
        d = new Date(d);
        d = +d + 1000*60*60*24;
        d = new Date(d);
        // console.log((d.getMonth()+1))
        if((d.getMonth()+1) < 10){
          return d.getFullYear()+"-"+'0'+(d.getMonth()+1)+"-"+d.getDate();
        }else if( (d.getDate()) < 10 ){
          return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+'0'+d.getDate();
        }else if( (d.getMonth()+1) <10 && (d.getDate()) <10 ) {
          return d.getFullYear()+"-"+'0'+(d.getMonth()+1)+"-"+'0'+d.getDate();
        }else {
          return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        }

      },
      getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      }
    }
  }
</script>

<style scoped>

</style>
