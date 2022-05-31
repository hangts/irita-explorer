import VueI18n from 'vue-i18n';
import prodConfig from "../../productionConfig";
const i18n = new VueI18n({
    locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN" : require('../../../lang/CN-Cindy'),
        "EN" : require('../../../lang/EN-Cindy')
    }
})
export default  [
    {
        label:i18n.t('ExplorerLang.table.block'),
        displayValue:'height',
        nativeValue:'height',
        isLink:true,
        linkRoute:'/block/',
        isShowMoniker:false
    },
    {
        label: i18n.t('ExplorerLang.table.proposer'),
        displayValue: 'proposerValue',//页面展示用到的取值字段 （例:页面展示 moniker 使用这个字段取值）
        nativeValue:'proposerAddress',// 原始数据用到的取值字段（例:页面 moniker 跳转需要地址，使用这个字段取值）
        isLink: true,
        linkRoute:'/staking/',
        isShowMoniker: true,
    },
    {
        label: i18n.t('ExplorerLang.table.transactions'),
        displayValue: 'numTxs',
        nativeValue:'numTxs',
        isLink: false,
        isShowMoniker: false
    },
    {
        label: i18n.t('ExplorerLang.table.createTime'),
        displayValue:'time',
        nativeValue:'time',
        isLink: false,
        isShowMoniker: false
    },
    {
        label: i18n.t('ExplorerLang.table.age'),
        displayValue: 'ageTime',
        isLink: false,
        isShowMoniker: false
    }
]