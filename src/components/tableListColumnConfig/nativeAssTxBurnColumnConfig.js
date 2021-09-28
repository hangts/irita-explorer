export default [
    {
        label:'TxHash',
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
        label: 'Amount',
        displayValue: 'amount',
        nativeValue: 'amount'
    },
    {
        label: 'Token',
        displayValue: 'token',
        nativeValue: 'token',
        isLink: true,
        linkRoute: '/assets'
    },
    {
        label: 'Sender',
        displayValue: 'sender',
        nativeValue: 'sender',
        isNeedFormat: 'sender',
        isNeedFormatHash: 'sender',
        isLink: true,
        linkRoute: '/address'
    },

    {
        label: 'Block',
        displayValue: 'block',
        nativeValue: 'block',
        isLink:true,
        linkRoute:'/block'
    },
    {
        label: 'Fee',
        displayValue: 'fee',
        nativeValue: 'fee',
        isShowTokenSymbol:true,
    },
    {
        label:'Time',
        displayValue:'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    },




]