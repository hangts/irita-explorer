// 通用信息的后半部分
import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.block'),
    displayValue: 'blockHeight',
    nativeValue: 'blockHeight',
    isLink: true,
    isNeedFormatHash: false,
    linkRoute: '/block/',
    isShowMoniker: false,
  },
  {
    label: i18n.t('ExplorerLang.table.fee'),
    displayValue: 'Tx_Fee',
    nativeValue: 'Tx_Fee',
    isLink: false,
    linkRoute: '',
    isShowMoniker: false,
    isShowTokenSymbol: true, // fee右上显示单位
  },
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'Time',
    nativeValue: 'Time',
    isLink: false,
    linkRoute: '',
    isShowMoniker: false,
    width: 160,
  },
];
