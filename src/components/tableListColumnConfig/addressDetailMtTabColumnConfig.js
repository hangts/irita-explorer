/*
 * 地址详情页数据对象列表配置项
 * */
import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.mtId'),
    displayValue: 'mtId',
    nativeValue: 'mtId',
    isNeedFormat: true,
    isFormatAddress: true,
    nftRouterParamsValue: 'mtDenomId',
    isLink: true,
    isNft: true,
    linkRoute: '/mt/token?denom=',
    denomRouter: '&tokenId=',
  },
  {
    label: i18n.t('ExplorerLang.table.denomName'),
    displayValue: 'mtDenomName',
    nativeValue: 'mtDenomName',
    isNeedFormat: true,
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.denomId'),
    displayValue: 'mtDenomId',
    nativeValue: 'mtDenomId',
    isNeedFormat: true,
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.mtNumber'),
    displayValue: 'mtNumber',
  },
  {
    label: i18n.t('ExplorerLang.table.publisher'),
    displayValue: 'publisher',
    nativeValue: 'publisher',
    isLink: true,
    isNeedFormat: true,
    isFormatAddress: true,
    linkRoute: '/address/',
  },
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'time',
    nativeValue: 'time',
    width: 160,
  },
];
