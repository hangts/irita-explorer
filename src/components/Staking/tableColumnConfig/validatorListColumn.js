export default {
    active:[
        {
            label:'#',
            isShowIndex: true,
            isAdjustStyle: true,
        },
        {
            label:'Moniker',
            displayValue: 'moniker',
            nativeValue: 'moniker',
            isShowMonikerImg:true,
            isDisplayIconValue:'validatorIconSrc',
            imgUrlValue:'url',
            isNeedSort:true,
            sortName:'moniker'
        },
        {
            label: 'Operator',
            displayValue: 'operatorAddress',
            nativeValue: 'operatorAddress',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: 'Commission',
            displayValue: 'commission',
            isNeedSort:true,
            sortName:'commissionSort'
        },
        {
            label: 'Bonded Tokens',
            displayValue: 'bondedToken',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'bondedTokenSort',
            width: 200
        },
        {
            label: 'Voting Power',
            displayValue: 'votingPower',
            isNeedSort:true,
            sortName:'votingPowerSort'
        },
        {
            label: 'Uptime',
            displayValue: 'uptime',
            isNeedSort:true,
            sortName:'uptimeSort'
        },
        {
            label: 'Self Bonded',
            displayValue: 'selfBond',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'selfBondSort'
        }
    ],
    candidate:[
        {
            label:'#',
            isShowIndex: true,
            isAdjustStyle: true,
            width: 40
        },
        {
            label:'Moniker',
            displayValue: 'moniker',
            nativeValue: 'moniker',
            isShowMonikerImg:true,
            isDisplayIconValue:'validatorIconSrc',
            imgUrlValue:'url',
            isNeedSort:true,
            sortName:'moniker'
        },
        {
            label: 'Operator',
            displayValue: 'operatorAddress',
            nativeValue: 'operatorAddress',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: 'Commission',
            displayValue: 'commission',
            isNeedSort:true,
            sortName:'commissionSort'
        },
        {
            label: 'Bonded Tokens',
            displayValue: 'bondedToken',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'bondedTokenSort',
            width: 200
        },
        {
            label: 'Self Bonded',
            displayValue: 'selfBond',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'selfBondSort'
        },
        {
            label: 'Unbonding Height',
            displayValue:'unbondingHeight',
            nativeValue:'unbondingHeight',
            isLink:true,
            isNeedFormatHash:false,
            linkRoute:'/block/',
            isShowMoniker:false,
            isNeedSort:true,
            sortName:'unbondingHeight'
        }
    ],
    jailed:[
        {
            label:'#',
            isShowIndex: true,
            isAdjustStyle: true,
        },
        {
            label:'Moniker',
            displayValue: 'moniker',
            nativeValue: 'moniker',
            isShowMonikerImg:true,
            isDisplayIconValue:'validatorIconSrc',
            imgUrlValue:'url',
            isNeedSort:true,
            sortName:'moniker'

        },
        {
            label: 'Operator',
            displayValue: 'operatorAddress',
            nativeValue: 'operatorAddress',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: 'Commission',
            displayValue: 'commission',
            isNeedSort:true,
            sortName:'commissionSort'
        },
        {
            label: 'Bonded Tokens',
            displayValue: 'bondedToken',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'bondedTokenSort',
            width: 200
        },
        {
            label: 'Self Bonded',
            displayValue: 'selfBond',
            isShowTokenSymbol:true,
            isNeedSort:true,
            sortName:'selfBondSort'
        },
        {
            label: 'Unbonding Height',
            displayValue:'unbondingHeight',
            nativeValue:'unbondingHeight',
            isLink:true,
            isNeedFormatHash:false,
            linkRoute:'/block/',
            isShowMoniker:false,
            isNeedSort:true,
            sortName:'unbondingHeight'
        }
    ]
}