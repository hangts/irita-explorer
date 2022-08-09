import i18n from '@/i18n';

export default [
  {
    label: i18n.t('ExplorerLang.table.mtId'),
    displayValue: 'mtID',
    nativeValue: 'mtID',
  },
  {
    label: i18n.t('ExplorerLang.table.mtName'),
    displayValue: 'denomName',
    nativeValue: 'denomName',
  },
  {
    label: i18n.t('ExplorerLang.table.mtDenom'),
    displayValue: 'denomId',
    nativeValue: 'denomId',
  },
  {
    label: i18n.t('ExplorerLang.table.mtNumber'),
    displayValue: 'mtNumber',
    nativeValue: 'mtNumber',
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
    label: i18n.t('ExplorerLang.table.ownerNumber'),
    displayValue: 'ownerCount',
    nativeValue: '',
    isLink: true,
  },
  {
    label: i18n.t('ExplorerLang.table.time'),
    displayValue: 'time',
    nativeValue: 'time',
    width: 160,
  },
];
