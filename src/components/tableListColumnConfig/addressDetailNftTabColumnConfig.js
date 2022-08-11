/*
 * 地址详情页数据对象列表配置项
 * */
import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.tokenName'),
    displayValue: 'nftName',
    nativeValue: 'id',
    nftRouterParamsValue: 'denomId',
    isLink: true,
    isNft: true,
    linkRoute: '/nft/token?denom=',
    denomRouter: '&tokenId=',
    isNeedFormat: true,
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.nftId'),
    displayValue: 'id',
    nativeValue: 'id',
    nftRouterParamsValue: 'denomId',
    isNeedFormat: true,
    isFormatAddress: true,
    isLink: true,
    isNft: true,
    linkRoute: '/nft/token?denom=',
    denomRouter: '&tokenId=',
  },
  {
    label: i18n.t('ExplorerLang.table.denomName'),
    displayValue: 'denomName',
    nativeValue: 'denomName',
    isNeedFormat: true,
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.denomId'),
    displayValue: 'denomId',
    nativeValue: 'denomId',
    isNeedFormat: true,
    isFormatNftIdAndDenomId: true,
  },

 /* {
    label: i18n.t('ExplorerLang.table.data'),
    displayValue: 'tokenData',
    isLargeString: true,
  },*/
 /* {
    label: i18n.t('ExplorerLang.table.uri'),
    displayValue: 'tokenUri',
    nativeValue: 'tokenUri',
    isNftHref: true,
    isNeedFormat: true,
  },*/
];
