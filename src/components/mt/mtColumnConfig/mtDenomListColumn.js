import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.denomName'),
    displayValue: 'denomName',
    nativeValue: 'denomName',
  },
  {
    label: i18n.t('ExplorerLang.table.denomId'),
    displayValue: 'denomId',
    nativeValue: 'denomId',
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
    isShowTxStatusIcon: true,
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
  },
  {
    label: i18n.t('ExplorerLang.table.owner'),
    displayValue: 'mtID',
    nativeValue: 'mtID',
  },
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'time',
    nativeValue: 'time',
    width: 160,
  },
];
