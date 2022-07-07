import prodConfig from "../../productionConfig";
import VueI18n from 'vue-i18n';
const i18n = new VueI18n({
    locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN" : require('../../../lang/CN-Cindy'),
        "EN" : require('../../../lang/EN-Cindy')
    }
})
export default [
    {
        label: i18n.t('ExplorerLang.table.denom'),
        displayValue: 'denomName',
        nativeValue: 'denomName',
        isNeedFormat: true,
        isFormatAddress: true
    },
    {
        label: i18n.t('ExplorerLang.table.denomId'),
        displayValue: 'denomId',
        nativeValue: 'denomId',
        isNeedFormat:true,
        isFormatAddress: true
    },


    {
        label: i18n.t('ExplorerLang.table.txHash'),
        displayValue: 'hash',
        nativeValue: 'hash',
        linkRoute: '/tx?txHash=',
        isLink: true,
        isNeedFormat: true,
        isNeedFormatHash: true,
    },
    // {
    //     label: i18n.t('ExplorerLang.table.nftCount'),
    //     displayValue: 'nftCount',
    //     nativeValue: 'denomId',
    //     linkRoute: '/nftAsset?denomId=',
    //     isLink: true,
    // },

    {
        label: i18n.t('ExplorerLang.table.creatorName'),
        displayValue: 'sender',
        nativeValue: 'sender',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address/',
    },

    {
        label: i18n.t('ExplorerLang.table.time'),
        displayValue: 'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150,


    }
]
