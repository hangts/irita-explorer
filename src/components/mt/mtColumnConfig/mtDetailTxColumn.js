import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.txHash'),
    displayValue: 'txHash',
    nativeValue: 'txHash',
    isLink: true,
    isNeedFormat: true,
    isNeedFormatHash: true,
    isNeedShowTxStatus: true,
    linkRoute: '/tx?txHash=',
    isShowMoniker: false,
    isShowTxStatusIcon: true,
  },
  {
    label: i18n.t('ExplorerLang.table.txType'),
    displayValue: 'txType',
    nativeValue: 'txType',
    isNeedFormat: true,
    isShowTag: true,
    isLink: false,
    isShowMoniker: false,
  },
  {
    label: i18n.t('ExplorerLang.table.mtNumber'),
    displayValue: 'mtNumber',
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
    displayValue: 'blockHeight',
    nativeValue: 'blockHeight',
    isLink: true,
    linkRoute: '/block/',
  },
  {
    label: i18n.t('ExplorerLang.table.fee'),
    displayValue: 'fee',
    nativeValue: 'fee',
    isShowTokenSymbol: true,
  },
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'time',
    nativeValue: 'time',
    width: 150,
  },
];
