/*模块功能映射id{
    "100":"区块浏览",
    "101":"交易浏览",
    "102":"共识节点",
    "103":"数据对象",
    "104":"数据类别",
    "105":"服务浏览",
    "106":"身份ID",
    "107":"Validators",
    "108":"Delegation Txs",
    "109":"Validation Txs",
    "110":"Native Asset",
    "111":"Native Asset Txs",
    "112":"Proposals",
    "113":"Gov Txs",
    "114":"IRIS Rich List",
    "115":"IRIS Stats",
    "1000":"搜索"(排在末尾)
    "1001":"网络切换"(排在末尾)}*/

/*首页指标映射id{
    "200":"最新区块"(排在首位),
    "201":"交易数量",
    "202":"共识节点数",
    "203":"平均出块时间",
    "204":"数据对象数量",
    "205":"数据类别数量",
    "206":"服务数量",
    "207":"身份ID数量",
    "208":"验证人数量",
    "209":"质押率"
  }
*/

/*产品
  Bifrost,STARGATE,Cosmos Hub,NYANCAT,IRISHUB
*/

let config = {
  //国际化 CN / EN 默认CN
  lang:'EN',
  //浏览器标签标题 必填
  title:'Internet of Blockchains Scan - IRIS Hub',
  //主题色 作用于非直接干预的文字、背景、边框颜色(如输入框边框高亮、首页卡片图标等) 优先级较低
  themeColor:'#3264FD',
  //通用背景色
  background: '#F8F8F8',
  logo:{
      //logo标题 必填
      title:'IRISHUB',
      //logo副标题
      subTitle:'',
  },
  product:'IRISHUB',
  nav:{
      //nav导航文字颜色
      color:'',
      //nav导航文字高亮颜色
      activeTextColor:'',
      //nav背景颜色 上半部分
      bgColor:'#3264FD'
  },
  footer:{
      //页脚文字背景颜色
      color:'',
      //页脚背景颜色 上半部分
      bgColor_top:'',
      //页脚背景颜色 下半部分
      bgColor_bottom:'',
      //页脚版权信息   必填
      copyright:'Copyright © IRISplorer 2021 All Rights Reserved.',
      chainIdShow: true,
      versionShow: true,
      //页脚右侧是否显示跳转链接
      linkShow: false
  },
  //导航栏功能列表 详见 导航栏功能映射 注：title为配置文案暂不支持国际化
  navFuncList:[
      { title: 'Blockchain', id: '100' },
      { title: 'Transactions', id: '101' },
      {
        title: 'Staking',
        children: [
          { title: 'Validators', id: '107' },
          { title: 'Delegation Txs', id: '108' },
          { title: 'Validation Txs', id: '109' },
        ],
      },
      {
        title: 'NFT',
        children: [
          { title: 'NFT', id: '103' },
          { title: 'Denom', id: '104' },
        ],
      },
      { title: 'iService', id: '105' },
      {
        title: 'Asset',
        children: [
          { title: 'Native Asset', id: '110' },
          { title: 'Native Asset Txs', id: '111' },
        ],
      },
      {
        title: 'Gov',
        children: [
          { title: 'Proposals', id: '112' },
          { title: 'Gov Txs', id: '113' },
        ],
      },
      {
        title: 'Stats',
        children: [
            //main token
          { title: '${mainToken} Rich List', id: '114' },
          { title: '${mainToken} Stats', id: '115' },
        ],
      },
      '1000',
      '1001',
  ],
  //首页卡片配置
  homeCard:[200,201,203,209,208,204,205,206,211],
  text:{
      //预设字体颜色
      color:{
          //一级文字色
          first: '',
          //二级文字色
          second: '',
          //三级文字色
          third: '',
          //四级文字色
          fourth: '',
          //链接文字色
          link: '#3264FD',
      }
  },
  button:{
      //预设按钮字体颜色
      color:{
          common:'#fff',
      },
      //预设按钮背景颜色
      bgColor:{
          common:'#3264FD',
      }
  },
  // 区块列表页面是否显示 Proposer
  blockList: {
      proposer: true,
  },
  // 切换交易
  txDetail: {
      ibc: false // 交易是否切换成联盟链IBC交易
  },
  // 控制表格中列的显示和隐藏
  table: {
      votingPower: true // Validator List中Voting_Power是否显示
  },
  utcOffset: '+0', // 页面转换时区,默认值为 +0
  isShowUTC: true, // 是否显示时区,默认值为true
  fee: {
    isShowFee: true, // 是否展示fee
    isShowDenom: false, //列表中fee是否展示单位
    decimals: 4 // 列表中fee展示的数值精度
  },
  umeng: {
    umengId: 1279754478,
    umengWebId: 1279754478
  },

  isShowSendAndReceiveTxCount: true, // 控制地址详情页是否展示发送接收交易总数模块
  isShowSendTxCount: true, // 控制发送接收交易总数模块中的发送交易总数展示
  isShowReceiveTxCount: true, // 控制发送接收交易总数模块中的接受交易总数展示
}
module.exports = config;
