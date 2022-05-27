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
        label:i18n.t('ExplorerLang.table.txHash'),
        displayValue:'txHash',
        nativeValue:'txHash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        isNeedShowTxStatus:true,
        linkRoute:'/tx?txHash=',
        isShowMoniker:false,
        isShowTxStatusIcon:true
    },
    {
        label: i18n.t('ExplorerLang.table.txType'),
        displayValue:'txType',
        nativeValue:'txType',
        isShowTag:true,
     
    },
    {
        label: i18n.t('ExplorerLang.table.contractMethod'),
        displayValue: 'contractMethod',
        nativeValue: 'contractMethod',
        isShowTag: true
    },
    {
        label: i18n.t('ExplorerLang.table.signer'),
        displayValue: 'signer',
        nativeValue: 'signer',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address/',
    },
    {
        label: i18n.t('ExplorerLang.table.block'),
        displayValue:'blockHeight',
        nativeValue:'blockHeight',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block/',
        isShowMoniker:false
    },
    {
        label: i18n.t('ExplorerLang.table.fee'),
        displayValue:'fee',
        nativeValue:'fee',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        isShowTokenSymbol:true
    },
    {
        label: i18n.t('ExplorerLang.table.time'),
        displayValue:'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    },
]