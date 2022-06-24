import {cfg} from "../../config";
import VueI18n from 'vue-i18n';
import prodConfig from "../../productionConfig";

const i18n = new VueI18n({
    locale: prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN": require('../../../lang/CN-Cindy'),
        "EN": require('../../../lang/EN-Cindy')
    }
})
export const needAddColumn = {

    send: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isFormatAddress: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'to',
            nativeValue: 'to',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address/',
        }
    ],
    multisend: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isFormatAddress: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.numberOfTo'),
            displayValue: 'numberOfTo',
            nativeValue: 'txHash',
            isLink: true,
            linkRoute: '/tx?txHash='
        }
    ],
    begin_redelegate: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'toMonikers',
            nativeValue: 'to',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking/',
        }
    ],
    delegate: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'toMonikers',
            nativeValue: 'to',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking/',
        }
    ],
    begin_unbonding: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'to',
            nativeValue: 'to',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address/',
        }
    ],
    withdraw_delegator_reward: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isFormatMoniker: true,
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'to',
            nativeValue: 'to',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address/',
        }
    ],
    withdraw_validator_commission: [
        {
            label: i18n.t('ExplorerLang.table.validator'),
            displayValue: 'validatorMoniker',
            nativeValue: 'validatorAddress',
            isFormatMoniker: true,
            isLink: true,
            isNeedFormat: true,
            linkRoute: '/staking/'
        },

    ],
    fund_community_pool: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.depositor'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    unjail: [
        {
            label: i18n.t('ExplorerLang.table.operatorAddress'),
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
        },
    ],
    create_validator: [
        {
            label: i18n.t('ExplorerLang.table.selfBonded'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.operatorAddress'),
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/staking/',
        },
        {
            label: i18n.t('ExplorerLang.table.ownerAddress'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    edit_validator: [
        {
            label: i18n.t('ExplorerLang.table.name'),
            displayValue: 'validatorMoniker',
            nativeValue: 'validatorAddress',
            isLink: true,
            isFormatMoniker: true,
            linkRoute: '/staking/',
        },
        {
            label: i18n.t('ExplorerLang.table.operatorAddress'),
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/staking/',
        },
    ],
    set_withdraw_address: [
        {
            label: i18n.t('ExplorerLang.table.delegatorAddress'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.withdrawAddress'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        }
    ],
    respond_service: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.respondserviceRequestId'),
            displayValue: 'requestId',
            nativeValue: 'requestId',
            isHref: true,
            href: '',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    'service/set_withdraw_address': [
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.withdrawAddress'),
            value: '',
        },
    ],
    withdraw_earned_fees: [
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    define_service: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.author'),
            displayValue: 'author',
            nativeValue: 'author',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address/',
        }
    ],
    disable_service_binding: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    refund_service_deposit: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    bind_service: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    enable_service_binding: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    update_service_binding: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.provider'),
            displayValue: 'provider',
            nativeValue: 'provider',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    call_service: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.requestContentId'),
            displayValue: 'requestContextId',
            nativeValue: 'requestContextId',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    start_request_context: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.requestContentId'),
            displayValue: 'requestContextId',
            nativeValue: 'requestContextId',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    pause_request_context: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.requestContentId'),
            displayValue: 'requestContextId',
            nativeValue: 'requestContextId',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    update_request_context: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.requestContentId'),
            displayValue: 'requestContextId',
            nativeValue: 'requestContextId',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    kill_request_context: [
        {
            label: i18n.t('ExplorerLang.table.serviceName'),
            displayValue: 'serviceName',
            nativeValue: 'serviceName',
            isLink: true,
            linkRoute: '/service?serviceName='
        },
        {
            label: i18n.t('ExplorerLang.table.requestContentId'),
            displayValue: 'requestContextId',
            nativeValue: 'requestContextId',
            isNeedFormat: true,
            isFormatAddress: true,
            width: 150
        },
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    burn_nft: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.denomId'),
            displayValue: 'denomId',
            nativeValue: 'denomId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    edit_nft: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId=',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.denomId'),
            displayValue: 'denomId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId=',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    mint_nft: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId=',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    transfer_nft: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId=',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.from'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.to'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    issue_denom: [
        {
            label: i18n.t('ExplorerLang.table.denomId'),
            displayValue: 'denomId',
            nativeValue: 'denomId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,

        },
        {
            label: i18n.t('ExplorerLang.table.denomName'),
            displayValue: 'denomName',
            nativeValue: 'denomName',
            isNeedFormat:true,
            isFormatAddress:true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    transfer_denom: [
        {
            label: i18n.t('ExplorerLang.table.denomId'),
            displayValue: 'denomId',
            nativeValue: 'denomId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,

        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'receiver',
            nativeValue: 'receiver',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    swap_order: [
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount1'),
            displayValue: 'swapAmount1',
            isRight: true
        },
        {
            label: ' ',
            displayValue: 'swapAmount1Denom',
            isShowDenomTip: true,
            isDoubleAsset: true, // 用于上色判断双资产
            isLeftAsset: true // 判断第一个资产 两者配合使用
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount2'),
            displayValue: 'swapAmount2',
            isRight: true
        },
        {
            label: '',
            displayValue: 'swapAmount2Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: false
        },
    ],
    add_liquidity: [
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount1'),
            displayValue: 'swapAmount1',
            isRight: true
        },
        {
            label: '',
            displayValue: 'swapAmount1Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: true
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount2'),
            displayValue: 'swapAmount2',
            isRight: true
        },
        {
            label: ' ',
            displayValue: 'swapAmount2Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: false
        },
    ],
    remove_liquidity: [
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount1'),
            displayValue: 'swapAmount1',
            isShowDenomTip: true,
            isRight: true
        },
        {
            label: '',
            displayValue: 'swapAmount1Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: true,
        },
        {
            label: i18n.t('ExplorerLang.table.swapAmount2'),
            displayValue: 'swapAmount2',
            isShowDenomTip: true,
            isRight: true
        },
        {
            label: ' ',
            displayValue: 'swapAmount2Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: false
        },
    ],
    // Farm 各二级标签列名
    stake: [
        {
            label: i18n.t('ExplorerLang.table.poolId'),
            displayValue: 'poolId',
            nativeValue: 'poolId',
            isFormatPoolId: true,
            isNeedFormat: true,
        },
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'farmAmount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'farmAmountDenom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    unstake: [
        {
            label: i18n.t('ExplorerLang.table.poolId'),
            displayValue: 'poolId',
            nativeValue: 'poolId',
            isFormatPoolId: true,
            isNeedFormat: true,
        },
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'farmAmount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'farmAmountDenom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    harvest: [
        {
            label: i18n.t('ExplorerLang.table.poolId'),
            displayValue: 'poolId',
            nativeValue: 'poolId',
            isFormatPoolId: true,
            isNeedFormat: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    create_pool: [
        {
            label: i18n.t('ExplorerLang.table.totalReward1'),
            displayValue: 'totalReward1',
            isRight: true
        },
        {
            label: '',
            displayValue: 'totalReward1Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: true
        },
        {
            label: i18n.t('ExplorerLang.table.totalReward2'),
            displayValue: 'totalReward2',
            isRight: true
        },
        {
            label: ' ',
            displayValue: 'totalReward2Denom',
            isShowDenomTip: true,
            isDoubleAsset: true,
            isLeftAsset: false
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'poolCreator',
            nativeValue: 'poolCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    create_pool_with_community_pool: [
        {
            label: i18n.t('ExplorerLang.table.proposer'),
            displayValue: 'proposer',
            nativeValue: 'proposer',
            isFormatAddress: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.title'),
            displayValue: 'title',
            nativeValue: 'title',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.initialDeposit'),
            displayValue: 'initialDeposit',
            isRight: true,
        },
        {
            label: '',
            displayValue: 'farmAmountDenom',
            isShowDenomTip: true,
        },
    ],
    destroy_pool: [
        {
            label: i18n.t('ExplorerLang.table.poolId'),
            displayValue: 'poolId',
            nativeValue: 'poolId',
            isFormatPoolId: true,
            isNeedFormat: true,
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'poolCreator',
            nativeValue: 'poolCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    adjust_pool: [
        {
            label: i18n.t('ExplorerLang.table.poolId'),
            displayValue: 'poolId',
            nativeValue: 'poolId',
            isFormatPoolId: true,
            isNeedFormat: true,
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'poolCreator',
            nativeValue: 'poolCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],

    transfer: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'to',
            nativeValue: 'to',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        }
    ],
    recv_packet: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'from',
            nativeValue: 'from',
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        }
    ],
    timeout_packet: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'from',
            nativeValue: 'from',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        }
    ],
    create_htlc: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        }
    ],
    claim_htlc: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        }
    ],
    create_feed: [
        {
            label: i18n.t('ExplorerLang.table.feedName'),
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    pause_feed: [
        {
            label: i18n.t('ExplorerLang.table.feedName'),
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    start_feed: [
        {
            label: i18n.t('ExplorerLang.table.feedName'),
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    edit_feed: [
        {
            label: i18n.t('ExplorerLang.table.feedName'),
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: i18n.t('ExplorerLang.table.creator'),
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    request_rand: [
        {
            label: i18n.t('ExplorerLang.table.consumer'),
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.serviceFeeCap'),
            displayValue: 'amount',
            nativeValue: 'amount',
        },
    ],
    create_record: [
        {
            label: i18n.t('ExplorerLang.table.digest'),
            displayValue: 'digest',
            nativeValue: 'digest',
            isNeedFormatHash: true,
            isHref: true,
            href: '',
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: i18n.t('ExplorerLang.table.digestAlgo'),
            displayValue: 'digest_algo',
        }
    ],
    issue_token: [
        {
            label: i18n.t('ExplorerLang.table.symbol'),
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: i18n.t('ExplorerLang.table.minUnit'),
            displayValue: 'minUnit',
            nativeValue: 'minUnit',
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    edit_token: [
        {
            label: i18n.t('ExplorerLang.table.symbol'),
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    transfer_token_owner: [
        {
            label: i18n.t('ExplorerLang.table.assetTokenId'),
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: i18n.t('ExplorerLang.table.originalOwner'),
            displayValue: 'srcOwner',
            nativeValue: 'srcOwner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.newOwner'),
            displayValue: 'dstOwner',
            nativeValue: 'dstOwner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        }
    ],
    mint_token: [
        {
            label: i18n.t('ExplorerLang.table.assetTokenId'),
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            nativeValue: 'amount',
        },
        {
            label: i18n.t('ExplorerLang.table.owner'),
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    burn_token: [
        {
            label: i18n.t('ExplorerLang.table.symbol'),
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            nativeValue: 'amount',
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    submit_proposal: [
        {
            label: i18n.t('ExplorerLang.table.proposer'),
            displayValue: 'from',
            nativeValue: 'from',
            isFormatAddress: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.title'),
            displayValue: 'title',
            nativeValue: 'title',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.initialDeposit'),
            displayValue: 'amount',
            nativeValue: 'amount',
            isShowTokenSymbol: true,
        },
    ],
    deposit: [
        {
            label: i18n.t('ExplorerLang.table.proposalID'),
            displayValue: 'proposalId',
            nativeValue: 'proposalId',
            isLink: true,
            linkRoute: '/ProposalsDetail/'
        },
        {
            label: i18n.t('ExplorerLang.table.depositor'),
            displayValue: 'depositor',
            nativeValue: 'depositor',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.deposit'),
            displayValue: 'amount',
            nativeValue: 'amount',
        },
    ],
    vote: [
        {
            label: i18n.t('ExplorerLang.table.proposalID'),
            displayValue: 'proposalId',
            nativeValue: 'proposalId',
            isLink: true,
            linkRoute: '/ProposalsDetail/'
        },
        {
            label: i18n.t('ExplorerLang.table.voter'),
            displayValue: 'voter',
            nativeValue: 'voter',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.govOption'),
            displayValue: 'option',
            nativeValue: 'option'
        },
    ],
    create_client: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
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
    ],
    update_client: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
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
    ],
    channel_open_confirm: [
        {
            label: i18n.t('ExplorerLang.table.portId'),
            displayValue: 'portId',
        },
        {
            label: i18n.t('ExplorerLang.table.channelId'),
            displayValue: 'channelId',
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
    ],
    channel_open_try: [
        {
            label: i18n.t('ExplorerLang.table.portId'),
            displayValue: 'portId',
        },
        {
            label: i18n.t('ExplorerLang.table.channelId'),
            displayValue: 'channelId',
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
    ],
    channel_open_ack: [
        {
            label: i18n.t('ExplorerLang.table.portId'),
            displayValue: 'portId',
        },
        {
            label: i18n.t('ExplorerLang.table.channelId'),
            displayValue: 'channelId',
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
    ],
    channel_open_init: [
        {
            label: i18n.t('ExplorerLang.table.portId'),
            displayValue: 'portId',

        },
        {
            label: i18n.t('ExplorerLang.table.channelId'),
            displayValue: 'channelId',
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
    ],
    connection_open_confirm: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
        },
        {
            label: i18n.t('ExplorerLang.table.connectionId'),
            displayValue: 'connectionId',
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
    ],
    connection_open_init: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
        },
        {
            label: i18n.t('ExplorerLang.table.connectionId'),
            displayValue: 'connectionId',
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
    ],
    connection_open_try: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
        },
        {
            label: i18n.t('ExplorerLang.table.connectionId'),
            displayValue: 'connectionId',
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
    ],
    connection_open_ack: [
        {
            label: i18n.t('ExplorerLang.table.clientID'),
            displayValue: 'clientId',
        },
        {
            label: i18n.t('ExplorerLang.table.connectionId'),
            displayValue: 'connectionId',
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
    ],
    acknowledge_packet: [
        {
            label: i18n.t('ExplorerLang.table.amount'),
            displayValue: 'amount',
            isRight: true
        },
        {
            label: '',
            displayValue: 'denom',
            isShowDenomTip: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'receiver',
            nativeValue: 'receiver',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        },
    ],
    //新增tibc展示配置字段
    tibc_nft_transfer: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',

        },
        {
            label: i18n.t('ExplorerLang.table.destinationChain'),
            displayValue: 'dest_chain',
            nativeValue: 'dest_chain',
        },
    ],
    tibc_recv_packet: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.receiver'),
            displayValue: 'receiver',
            nativeValue: 'receiver',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
        {
            label: i18n.t('ExplorerLang.table.sourceChain'),
            displayValue: 'source_chain',
            nativeValue: 'source_chain',
        },
    ],
    tibc_acknowledge_packet: [
        {
            label: i18n.t('ExplorerLang.table.nftId'),
            displayValue: 'nftId',
            nativeValue: 'nftId',
            isNeedFormat: true,
            isFormatNftIdAndDenomId: true,
        },
        {
            label: i18n.t('ExplorerLang.table.sender'),
            displayValue: 'sender',
            nativeValue: 'sender',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',

        },
        {
            label: i18n.t('ExplorerLang.table.destinationChain'),
            displayValue: 'dest_chain',
            nativeValue: 'dest_chain',
        },
    ],
    clean_packet: [

        {
            label: i18n.t('ExplorerLang.table.sequence'),
            displayValue: 'sequence',
        },
        {
            label: i18n.t('ExplorerLang.table.sourceChain'),
            displayValue: 'source_chain',
            nativeValue: 'source_chain',
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
    ],
    recv_clean_packet: [
        {
            label: i18n.t('ExplorerLang.table.signer'),
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address/',
        },
    ],
    tibc_update_client: [
        {
            label: i18n.t('ExplorerLang.table.chainName'),
            displayValue: 'chain_name',
            nativeValue: 'chain_name',
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
    ],
    //EVM 智能合约 二级标签
    ethereum_tx: [
        {
            label: i18n.t('ExplorerLang.table.contractMethod'),
            displayValue: 'contractMethod',
            nativeValue: 'contractMethod',
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
    ],
    ddc_721: [
        {
            label: i18n.t('ExplorerLang.table.contractMethod'),
            displayValue: 'contractMethod',
            nativeValue: 'contractMethod',
            isShowTag: true,
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
    ],
    ddc_1155: [
        {
            label: i18n.t('ExplorerLang.table.contractMethod'),
            displayValue: 'contractMethod',
            nativeValue: 'contractMethod',
            isShowTag: true,
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
    ],
    ddc_other: [
        {
            label: i18n.t('ExplorerLang.table.contractMethod'),
            displayValue: 'contractMethod',
            nativeValue: 'contractMethod',
            isShowTag: true,
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
    ]

}