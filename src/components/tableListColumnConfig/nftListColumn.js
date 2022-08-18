import VueI18n from 'vue-i18n';
// import { cfg } from '../../config';
import prodConfig from '../../productionConfig';

const cn = require('../../../lang/CN-Cindy');
const en = require('../../../lang/EN-Cindy');

const i18n = new VueI18n({
  locale: prodConfig.lang === 'EN' ? 'EN' : 'CN',
  messages: {
    CN: cn,
    EN: en,
  },
});
export default [
  {
    label: i18n.t('ExplorerLang.table.nftId'),
    displayValue: 'nft_id',
    nativeValue: 'nft_id',
    nftRouterParamsValue: 'denom_id',
    isNeedFormat: true,
    isFormatAddress: true,
    isLink: true,
    isNft: true,
    linkRoute: '/nft/token?denom=',
    denomRouter: '&tokenId=',
    width: 158,
  },
  {
    label: i18n.t('ExplorerLang.table.tokenName'),
    displayValue: 'nft_name',
    nativeValue: 'nft_id',
    nftRouterParamsValue: 'denom_id',
    isNeedFormat: true,
    isFormatAddress: true,
    isLink: true,
    isNft: true,
    linkRoute: '/nft/token?denom=',
    denomRouter: '&tokenId=',
    width: 138,
  },
  {
    label: i18n.t('ExplorerLang.table.denom'),
    displayValue: 'denom_id',
    nativeValue: 'denom_id',
    isNeedFormat: true,
    isFormatAddress: true,
  },
  {
    label: i18n.t('ExplorerLang.table.denomName'),
    displayValue: 'denom_name',
    nativeValue: 'denom_name',
    isNeedFormat: true,
    isFormatAddress: true,
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
    displayValue: 'last_block_time',
    width: 150,
  },
];
