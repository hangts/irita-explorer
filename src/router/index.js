import Vue from 'vue';
import Router from 'vue-router';
import store from '@/vuex';
import prodConfig from '../productionConfig';
import { product } from '../constant';

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Home.vue'),
    },
    {
      path: '/blocks',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/BlockList.vue'),
    },
    {
      path: '/block/:height',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/BlockDetail.vue'),
    },
    {
      path: '/txs',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/TxList.vue'),
    },
    {
      path: '/txs/:txType',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/TxListPage.vue'),
    },
    {
      path: '/nftAsset',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/NftList.vue'),
    },
    {
      path: '/mts', // mt 列表
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/mt/MtList.vue'),
    },
    {
      path: '/daw',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/NftList.vue'),
    },
    {
      path: '/denoms',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/DenomList.vue'),
    },
    {
      path: '/mt/denoms', // mt类别列表
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/mt/MtDenomList.vue'),
    },
    {
      path: '/identities',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/IdentityList.vue'),
    },
    {
      path: '/identity/:id',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/IdentityDetail.vue'),
    },
    {
      path: '/address/:param',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/OwnerDetail.vue'),
    },
    {
      path: '/service/respond/:serviceName/:provider',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ServiceRespondRecord.vue'),
    },
    {
      path: '/nft/token',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/NftToken.vue'),
    },
    {
      path: '/mt/token', // mt 详情页路由
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/mt/MtDetail.vue'),
    },
    {
      path: '/service',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ServiceInformation.vue'),
    },
    {
      path: '/tx',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/TxDetail.vue'),
    },
    {
      path: '/services',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ServiceList.vue'),
    },
    {
      path: '/validators',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ValidatorList.vue'),
    },
    {
      path: '/searchResult',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/SearchResult.vue'),
    },
    {
      path: '/staking',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Staking/Staking.vue'),
    },
    {
      path: '/staking/:param',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Staking/ValidatorDetail.vue'),
    },
    {
      path: '/assets/ntvassets',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Asset/NativeAssetsList.vue'),
    },
    {
      path: '/assets/ntvassetstxs',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Asset/NativeAssetsTxs.vue'),
    },
    {
      path: '/assets/:param',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Asset/AssetInformation.vue'),
    },
    {
      path: '/gov/proposals',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Gov/ProposalsPage.vue'),
    },
    {
      path: '/ProposalsDetail/:proposal_id',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/Gov/ProposalsDetail.vue'),
    },
    {
      path: '/stats/rich',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/stats/RichList.vue'),
    },
    {
      path: '/stats/stats',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/stats/Stats.vue'),
    },
    {
      path: '/ddc',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ddc/index.vue'),
    },
    {
      path: '/ddc/detail',
      // eslint-disable-next-line import/extensions
      component: () => import('@/components/ddc/detail.vue'),
    },
    {
      path: '/system/maintenance',
      // eslint-disable-next-line import/extensions
      component: () => import('@/system/Maintenance.vue'),
    },
    {
      path: '/system/404',
      // eslint-disable-next-line import/extensions
      component: () => import('@/system/404.vue'),
    },
    {
      path: '*',
      redirect: '/system/404',
    },
  ],
});
router.beforeEach((to, from, next) => {
  store.commit('isFlMaintenance', true);
  sessionStorage.removeItem('currentChoiceMsgType');
  if (to.path !== '/txs') {
    sessionStorage.removeItem('lastChoiceMsgModelIndex');
    sessionStorage.removeItem('txTimeRange');
    sessionStorage.removeItem('currentChoiceMsgType');
    sessionStorage.removeItem('currentTxModelIndex');
    sessionStorage.removeItem('lastChoiceMsgModelIndex');
  }
  if (to.path !== '/txs/delegations') {
    sessionStorage.removeItem('selectMsgTypeIndex');
  }
  if (to.path !== '/txs/delegations') {
    sessionStorage.removeItem('selectMsgTypeIndex');
  }
  if (to.path === '/system/maintenance' || to.path.includes('/system/404')) {
    store.commit('isFlMaintenance', false);
  }
  if (prodConfig.product === product.datangchain && to.path.includes('/nftAsset')) {
    const fullPath = to.fullPath.replace(/nftAsset/g, 'daw');
    next(fullPath);
  }
  next();
});
export default router;
