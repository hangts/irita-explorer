import i18n from '@/i18n';

export default [
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
    label: i18n.t('ExplorerLang.table.mtNumber'),
    displayValue: 'mtCount',
    nativeValue: 'mtCount',
    isNeedSort: true,
  },
];
