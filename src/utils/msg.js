export default {
  msg(info, type){
    this.$message({
      dangerouslyUseHTMLString: true,
      message: `<div>
                   <h4>提示框</h4>
                   <span>${info}</span>
                 </div>`,
      center: true,
      type: type,
      duration: 2000
    })
  },
  alertFrame(obj){ // 确定取消的弹窗
    this.$confirm(obj.title, {
      title: '提示框',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {// 在此处想后端发送数据 在数据库中进行删除
      // this.$refs[formName].resetFields();
      // this.msg(obj.okInfo, 'success')
      obj.clickOkHandle()
    }).catch(() => {
      this.msg(obj.catchInfo, 'info')
    })
  }
}
