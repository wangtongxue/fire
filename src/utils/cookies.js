let cookiesFn = {
  //设置cookie<存>
  setCookie: function (cname, cvalue, exdays) {
    let v = JSON.parse(cvalue)
    v.Name = encodeURI(JSON.parse(cvalue).Name)
    v.unit_name = encodeURI(JSON.parse(cvalue).unit_name)
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + JSON.stringify(v) + "; " + expires;
  },
//获取cookie
  getCookie: function (Name) {
    var search = Name + "="//查询检索的值
    var returnvalue = "";//返回值
    var sd, end, r
    if (document.cookie.length > 0) {
      sd = document.cookie.indexOf(search);
      if (sd!= -1) {
        sd += search.length;
        end = document.cookie.indexOf(";", sd);
        if (end == -1){
          end = document.cookie.length;
        }
        returnvalue = JSON.parse(document.cookie.substring(sd, end))
        returnvalue.Name = decodeURI(JSON.parse(document.cookie.substring(sd, end)).Name)
        returnvalue.unit_name = decodeURI(JSON.parse(document.cookie.substring(sd, end)).unit_name)
        r = JSON.stringify(returnvalue)
      }
    }
    return r;
  },
// 删除cookie
  delCookie: function (name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = JSON.parse(this.getCookie(name));
    cval.Name = encodeURI(cval.Name)
    cval.unit_name = encodeURI(cval.unit_name)
    if (cval != null){
      document.cookie = name + "=" + JSON.stringify(cval) + ";expires=" + exp.toGMTString();
    }
  },
  // 忘记密码界面 设置cookie
  passSetCookie(key,val,time){
    var date=new Date(); //获取当前时间
    var expiresDays=time;  //将date设置为n天以后的时间
    date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
    document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
  },
  // 忘记密码界面 取cookie
  passGetCookie(key){
    var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
    var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    var tips;  //声明变量tips
    for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
      var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
      if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
        tips=arr[1];   //将cookie的值赋给变量tips
        break;   //终止for循环遍历
      }
    }
    return tips
  },
  // 忘记密码 删除cookie
  pssDelCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=this.passGetCookie(name);
    if(cval!=null)
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
  }
}

export default cookiesFn
