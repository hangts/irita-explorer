import i18n from '@/i18n';

export default [
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
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.txHash'),
    displayValue: 'txHash',
    nativeValue: 'txHash',
    isLink: true,
    isNeedFormat: true,
    isNeedFormatHash: true,
    isNeedShowTxStatus: true,
    linkRoute: '/tx?txHash=',
    width: 140,
  },
  {
    label: i18n.t('ExplorerLang.table.listMtNumber'),
    displayValue: 'mtNumber',
    nativeValue: 'denomId', // todo zhangjinbiao 需要新增跳转链接
    linkRoute: '/mts?denomId=',
    isLink: true,
  },
  {
    label: i18n.t('ExplorerLang.table.creator'),
    displayValue: 'creator',
    nativeValue: 'creator',
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
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'time',
    nativeValue: 'time',
    width: 160,
  },
];
