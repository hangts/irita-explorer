import Vue from 'vue';
import Router from 'vue-router';
import prodConfig from '../productionConfig';
import {product} from '../constant';
import store from "@/vuex";
Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
	routes:[
		{
			path:'/',
			redirect:'/home',
		},
		{
			path:'/home',
			component: () => import('@/components/Home.vue')
		},
		{
			path:'/blocks',
			component: () => import('@/components/BlockList.vue')
		},
		{
			path:'/block/:height',
			component: () => import('@/components/BlockDetail.vue')
		},
		{
			path:'/txs',
			component: () => import('@/components/TxList.vue')
		},
		{
			path: '/txs/:txType', component: () => import('@/components/TxListPage.vue'),
		},
		{
			path:'/nftAsset',
			component: () => import('@/components/NftList.vue')
		},
		{
			path:'/daw',
			component: () => import('@/components/NftList.vue')
		},
        {
			path:'/denoms',
			component: () => import('@/components/DenomList.vue')
		},
		{
			path:'/identities',
			component: () => import('@/components/IdentityList.vue')
		},
		{
			path:'/identity/:id',
			component: () => import('@/components/IdentityDetail.vue')
		},
		{
			path:'/address/:param',
			component: () => import('@/components/OwnerDetail.vue')
		},
        {
			path:'/service/respond/:serviceName/:provider',
			component: () => import('@/components/ServiceRespondRecord.vue')
		},
		{
			path:'/nft/token',
			component: () => import('@/components/NftToken.vue')
		},
		{
			path:'/service',
			component: () => import('@/components/ServiceInformation.vue')
		},
		{
			path:'/tx',
			component: () => import('@/components/TxDetail.vue')
		},
		{
			path:'/services',
			component: () => import('@/components/ServiceList.vue')
		},
		{
			path:'/validators',
			component: () => import('@/components/ValidatorList.vue')
		},
		{
			path: '/searchResult', component: () => import('@/components/SearchResult.vue'),
		},
		{
			path: '/staking', component: () => import('@/components/Staking/Staking.vue'),
		},
		{
			path: '/staking/:param',
			component: () => import('@/components/Staking/ValidatorDetail.vue'),
		},
		{
			path: '/assets/ntvassets',
			component: () => import('@/components/Asset/NativeAssetsList.vue'),
		},
		{
			path: '/assets/ntvassetstxs',
			component: () => import('@/components/Asset/NativeAssetsTxs.vue'),
		},
		{
			path: '/assets/:param',
			component: () => import('@/components/Asset/AssetInformation.vue'),
		},
		{
			path: '/gov/proposals',
			component: () => import('@/components/Gov/ProposalsPage.vue')
		},
		{
			path: '/ProposalsDetail/:proposal_id',
			component: () => import('@/components/Gov/ProposalsDetail.vue')
		},
		{
			path: '/stats/rich',
			component: () => import('@/components/stats/RichList.vue')
		},
		{
			path: '/stats/stats',
			component: () => import('@/components/stats/Stats.vue')
		},
		{
			path: '/ddc',
			component: () => import('@/components/ddc/index.vue')
		},
		{
			path: '/ddc/detail',
			component: () => import('@/components/ddc/detail.vue')
		},
		{
			path: '/system/maintenance',
			component: () => import('@/system/Maintenance.vue')
		},
		{
			path: '/system/404',
			component: () => import('@/system/404.vue')
		},
		{
			path: '*',
			redirect: '/system/404'
		}
	]
})
router.beforeEach((to,from,next) => {
	store.commit('isFlMaintenance',true)
	sessionStorage.removeItem('currentChoiceMsgType')
	if(to.path !== '/txs'){
		sessionStorage.removeItem('lastChoiceMsgModelIndex')
		sessionStorage.removeItem('txTimeRange')
		sessionStorage.removeItem('currentChoiceMsgType')
		sessionStorage.removeItem('currentTxModelIndex')
		sessionStorage.removeItem('lastChoiceMsgModelIndex')
	}
	if(to.path !== '/txs/delegations'){
		sessionStorage.removeItem('selectMsgTypeIndex')
	}
	if(to.path !== '/txs/delegations'){
		sessionStorage.removeItem('selectMsgTypeIndex')
	}
	if(to.path === '/system/maintenance' || to.path.includes('/system/404')){
		store.commit('isFlMaintenance',false)
	}
    if(prodConfig.product === product.datangchain && to.path.includes('/nftAsset')) {
        let fullPath = to.fullPath.replace(/nftAsset/g, 'daw');
        next(fullPath)
    }
	next()
})
export default router
