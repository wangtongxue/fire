<template>
  <div class="public_css">
    <div class="public_nav">系统设置 > 系统消息</div>
    <div class="public_box">
      <div id="system_msg_tab">
        <el-tabs tab-position="top" style="height: 200px;">
          <el-tab-pane label="功能介绍">
            <h5>1、区域单位选择</h5>
            <span>该功能模块操作简单、便捷，鼠标悬浮即可选择目标单位</span> <br>
            <h5>2、实时监控 </h5>
            <span>该功能模块集合地图、数据统计分析、实时监测设备最新动态，更直观、更准确的进行实时监控</span>  <br>
            <h5>3、设备管理 </h5>
            <span>设备管理存储设备基本信息：设备型号、设备生产厂家、设备传输方式等</span>  <br>
            <h5>4、数据分析 </h5>
            <span>采用扇形图的数据统计形式将设备的状态：正常、故障、报警、离线，展示出来,并有最近30天的报警统计折线图，将数据可视化。</span>  <br>
            <h5>5、账号管理</h5>
            <span>考虑到用户会进行多账号登录，账号管理可以实现账号的增、删、改、查功能。</span>  <br>
            <h5>6、单位管理</h5>
            <span>单位类型分为：业主单位、物业单位、维保单位、主管单位、经营单位、消防部门，管理者可以在单位类型中进行选择添加目标单位的基本信息，并保存。选择消防部门类型的管理者，可以将本平台的数据接口和与之相关的消防部门平台进行数据对接 </span> <br>
            <h5>7、业务设置与业务账单</h5>
            <span>用户可以在业务设置里根据自己的需求任意选择所需要的业务、使用时长，确定好开始时间后，系统自动计算结束时长。完成设置后，可以手动导出Excel业务账单进行核对。</span>
          </el-tab-pane>
          <el-tab-pane label="系统版本">
            <h5>版本号：</h5>
            <h5>版本名称：</h5>
          </el-tab-pane>
          <el-tab-pane label="隐私协议">
            <happy-scroll>
              <h3>中云消隐私声明</h3>
              <span>中云消非常重视用户的隐私，本《隐私声明》系对访问者隐私保护的许诺，以下文字公开了中云消对信息收集和使用的情况。本《隐私声明》还在不断调整和补充中，随着中云消服务范围的扩大，我们会随时对其进行更新。</span> <br>
              <h4>一、我们可能收集的信息</h4>
            　<span>我们提供服务时，可能会收集、储存和使用下列与您有关的信息。如果您无法提供相关信息，可能无法成为我们的用户或无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。</span> <br>
            　<span>1、单位信息</span> <br>
              <i>当您已经使用该平台时，我们会要求您提供真实的单位信息，以及单位详细地址，以及贵公司的简介，以便我们有针对性的为您提供新的服务和机会。我们会通过您给的地址以及联系方式通知您这些新的服务和机会。</i> <br>
            　<span>2、设备信息</span> <br>
              <i>当您已经使用该平台并将设备信息录入了平台数据库中，就已经默认同意将设备信息向我们公开，同时我们也会严格遵守保密协议，不外泄设备信息。</i> <br>
        　　  <span>3、信息自动收集</span> <br>
              <i>中云消可能自动接收并记录您的浏览器和计算机上的信息，其中包括您的IP地址，中云消cookie中的信息、软硬件特征信息、以及您需求的网页记录。</i> <br>
              <h4>二、我们可能如何使用信息</h4>
          　　<span>1、Cookie的使用</span> <br>
              <i>我们使用cookie来使我们的网站对用户更友好。它可以帮您省去为使用我们的服务而重复输入注册信息和跟踪您的浏览器的麻烦。cookies是少量的数据，在您未拒绝接受cookies的情况下，cookies将被发送到您的浏览器，并储 存在您的计算机硬盘。您有权选择接受或拒绝接受cookies。您可以通过修改浏览器的设置以拒绝接受cookies，但是我们需要提醒您，若您拒绝接受cookies，您可能无法使用依赖于cookies的部分网站功能。</i> <br>
              <span>2、信息的披露和使用</span> <br>
        　　  <i>1）我们不会向任何无关第三方提供、出售、出租、分享和交易用户有关的个人信息，但为方便您使用中云消服务及中云消关联公司或其他组织的服务（以下称其他服务），您将同意并授权中云消将您的个人信息传递给您同时接受其他 服务的中云消关联公司或其他组织，或从为您提供其他服务的中云消关联公司或其他组织获取您的个人信息。</i> <br>
        　　  <i>2）我们会对您及（或）您的公司的身份和交易数据进行综合统计。但是，我们不会向任何机构披露任何可能用以识别用户的个人身份的资料。但从用户的用户名或其它可披露资料分析得出的资料不受此限。</i> <br>
        　　  <i>3）您同意我们可批露或使用您的个人信息以用于识别和（或）确认您的身份，或解决争议，或有助于确保网站安全、限制欺诈、非法或其他刑事犯罪活动，以执行我们之间的协议。</i> <br>
        　　  <i>4）您同意我们可批露或使用您的个人信息以保护您的生命、财产之安全或为防止严重侵害他人之合法权益或为公共利益之需要。您同意我们可批露或使用您的个人信息以改进我们的服务，并使我们的服务更能符合您的要求，从而使您在使用我们服务时得到更好的使用体验。您同意我们利用您的个人信息与您联络，并向您提供您可能感兴趣的信息，如：介绍、推销产品、服务、促销优惠或者商业投资机会的商业性短信息等。</i> <br>
            　<h4>三、您如何访问和控制个人信息</h4>
          　　<span>用户名和密码</span> <br>
          　　<i>当您成为我们的用户后，我们会分配给您一个用户名和密码，您只能通过您的密码来使用您的帐号。如果您泄漏了密码，则可能导致丢失您的个人识别信息，并且可能出现对您不利的行为。因此，无论因为何种原因危及您的密码安全，您应该立即和我们取得联系。</i>
              <h4>四、信息安全</h4>
              <span>1、信息的存储和交换</span> <br>
              <i>您的用户信息和资料被收集和存储在于我们的服务器上。</i> <br>
              <span>2、外部链接</span> <br>
              <i>本站含有到其他网站的链接。中云消对那些网站的隐私保护措施不负任何责任。我们可能在任何需要的时候增加商业伙伴或共用品牌的网站，但是提供给他们的将仅仅是综合信息，我们将不会公开您的身份。</i> <br>
              <span>3、安全措施</span> <br>
              <i>我们网站有相应的安全措施来确保我们掌握的信息不丢失，不被滥用和变造。这些安全措施包括向其它服务器备份数据和对用户密码加密。尽管我们有这些安全措施，但请注意在因特网上不存在“完善的安全措施”。</i>
              <h4>五、未成年人的特别注意事项</h4>
              <span>如果您未满18周岁，您无权独自使用本公司服务，因此我们希望您不要向我们提供任何个人信息。如果您未满18周岁，您只能在父母或监护人的陪同下才可以使用本公司服务。</span> <br>
              <h4>六、联系我们</h4>
              <span>如果您对本《隐私声明》或中云消的隐私保护措施以及您在使用中的问题有任何意见和建议请和我们联系。</span> <br>
              <br>
              <br>
              <br><br>
              <br>
              <br>
              <br>
              <br>
              <br>
            </happy-scroll>
          </el-tab-pane>
          <el-tab-pane label="软件许可及服务协议">
            <happy-scroll>
              <h3>《中云消软件许可使用协议》</h3>
              <span>本《软件许可使用协议》（以下简称《协议》）是您与杭州中云消科技有限公司（下称“我们”）之间相关软件的法律协议。</span> <br>
              <span>本《协议》描述我们与您之间关于“软件”许可使用及相关方面的权利义务。“用户”或“您”是指通过我们提供的网络云服务或下载安装桌面及移动客户端途径而获得软件授权许可和软件产品的个人或单位。请您仔细阅读本《协议》中 的各项条款，包括免除或者限制我们责任的免责条款及对用户的权利限制。请您审阅并接受或不接受本《协议》（未成年人应在法定监护人陪同下审阅）。</span> <br>
              <span>除非您接受本《协议》条款，否则您无权下载、安装或使用本“软件”及其相关服务。您的安装、使用行为将视为对本《协议》的接受，并同意接受本《协议》各项条款的约束。</span> <br>
              <span>未经我们授权，任何拷贝、销售、转让、出租、修改本“软件”的行为均被认为是侵权行为。</span> <br>
              <h4>一、知识产权声明</h4>
              <span>本“软件”是由我们独立开发。“软件”的一切版权等知识产权，以及与“软件”相关的所有信息内容，包括但不限于：文字表述及其组合、商标、图标图饰、界面设计、版面框架、有关数据、印刷材料、电子文档等均受著作权法 和国际著作权条约以及其他知识产权法律法规的保护。除了任何我们授权许可协议所提供的明确书面许可外，拥有本“软件”并不赋予您任何有关这些专利、商标、版权或其它知识产权的许可。</span> <br>
              <h4>二、“软件”授权范围</h4>
              <span>1.   我们将授权软件提供给授权用户，授权用户依法享有该软件的使用权。</span> <br>
              <span>2.   授权用户拥有其系统内相关会员资料、商品（服务）资料、及相关信息的所有权，并独立承担与其的相关法律义务。</span> <br>
              <span>3.   保留权利：未明示授权的其他一切权利仍归我们所有，用户使用其他权利时须另外取得我们的书面同意。</span> <br>
              <span>4.   除本《协议》有明确规定外，本《协议》并未对本“软件”以外的我们的其他服务的服务条款作出规定。对于这些服务，可能有单独的服务条款加以规范，请用户在使用有关服务时另行了解与确认。如用户使用该服务，视为 对相关服务条款的接受。</span> <br>
              <h4>三、用户使用须知</h4>
              <span>1.   用户应保证使用软件时提供的资料真实无误。</span> <br>
              <span>2.   用户在遵守法律及本协议的前提下可依据本《协议》使用本“软件”。用户无权实施包括但不限于下列行为：</span> <br>
              <i>1)   不得删除本“软件”及其他副本上所有关于版权的信息、内容；</i> <br>
              <i>2)   不得对本“软件”进行反向工程、反向汇编、反向编译等；</i> <br>
              <i>3)   对于本“软件”的图像、文字等相关信息，未经我们书面同意，用户不得擅自实施包括但不限于下列行为：使用、复制、修改、链接、转载、汇编、发表、出版，建立镜像站点、擅自借助“软件”发展与之有关的衍生产 品、作品、服务等。</i> <br>
              <span>3.   使用本“软件”必须遵守国家有关法律和政策，维护国家利益，保护国家安全，对于用户违法或违反本协议的使用而引起的一切责任由用户负全部责任，一概与我们无关，导致我们损失的，我们有权要求用户赔偿，并有权立即 停止提供服务并保留相关记录，以配合司法机关追究法律责任的权利。</span> <br>
              <span>4.   利用本授权软件发生的商业行为均由授权用户自行负责，因利用本软件进行商业行为所产生的一切纠纷均与我们无关。</span> <br>
              <span>5.   授权用户可免费获得并使用最新的软件；且通过指定的方式获得指定范围内的技术支持。被授权用户享有反映和提出意见的权力，相关意见将被作为首要考虑，但没有一定被采纳的承诺或保证。</span> <br>
              <span>6.   我们不对因授权软件使用错误等问题所引起的授权用户损失而承担任何责任，但我们将尽量避免此类情况的发生且对付费授权用户在出现此类问题的情况下提供必要的支持服务。</span> <br>
              <span>7.   用户自行下载、安装、使用非经我们开发并正式发布的其它任何由本“软件”衍生的软件将可能导致不可预知的风险，建议用户不要轻易下载、安装、使用，由此产生的一切法律责任与纠纷一概与我们无关。</span> <br>
              <span>8.   我们保留在任何时候为您提供本“软件”的修改、升级版本的权利，以及为修改或升级服务收取费用的权利。</span> <br>
              <h4>四、法律责任与免责</h4>
              <span>1.   我们特别提醒用户注意，我们为了保障公司业务发展和调整的自主权，我们拥有随时自行修改软件而不需通知用户的权利，如有必要，修改会以通告形式公布于我们网站重要页面上。</span> <br>
              <span>2.   用户违反本协议或相关的服务条款的规定，我们有权视用户的行为性质采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。同时，我们会视司法部门的要求，协助调查。</span> <br>
              <span>3.   使用本“软件”涉及到互联网服务因素，可能会受到各个环节不稳定因素的影响，存在因不可抗力、计算机病毒、黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何网络、技术、通信线路等原因造成的服务中断 或不能满足用户要求的风险，用户须明白并自行承担以上风险。在适用法律允许的最大范围内，我们在任何情况下不就因使用或不能使用本“软件”产品及所发生的特殊的、意外的、非直接或间接的损失承担赔偿责任，即使用 户已事先向我们告知该损害发生的可能性。</span> <br>
              <span>4.   用户因第三方如电信部门的通讯线路故障、技术问题、网络、电脑或手机故障、系统不稳定性及其他各种不可抗力原因而遭受的经济损失，我们不承担责任。</span> <br>
              <span>5.   因不可抗事件影响到服务的正常运行的，我们承诺在第一时间内与相关单位配合及时处理进行修复，但用户因此而遭受的经济损失，我们不承担责任。</span> <br>
              <span>6.   您必须充分了解使用本软件的用途和风险。十分必要时，我们所承担的责任仅限于软件版本的升级。</span>
              <h4>五、其他条款</h4>
              <span>1.   电子文本形式的授权协议如同双方书面签署的协议一样，具有完全的和等同的法律效力。您一旦开始使用软件，即被视为完全理解并接受本协议的各项条款，在享有上述条款授予的权力的同时，受到相关的约束和限制。协议许 可范围以外的行为，将直接违反本授权协议并构成侵权，我们有权随时终止授权，责令停止损害，并保留追究相关责任的权力。</span> <br>
              <span>2.   本协议所规定的任何条款的部分或全部无效者，不影响其它条款的效力。</span> <br>
              <span>3.   本协议的解释、效力及纠纷的解决，适用于中华人民共和国法律。若用户和我们之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户在此完全同意将纠纷或争议提交我们所在地法院管辖。</span> <br>
              <span>4.   我们保留对本协议的最终解释权。</span> <br>
              <br>
              <br>
              <br><br>
              <br>
              <br>
              <br>
              <br>
              <br>
            </happy-scroll>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "systemMessage"
    }
</script>

<style scoped>

</style>
