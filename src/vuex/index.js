import Vue from 'vue';
import Vuex from 'vuex';
import config from '../productionConfig';

Vue.use(Vuex);
const store = new Vuex.Store({
    state : {
        tempDenomId : '',
        token: {
            minUnit:'',
            symbol:'',
            isMobile:false,
        },
        mainToken:'',
        currentTxModelIndex:sessionStorage.getItem('lastChoiceMsgModelIndex') ? sessionStorage.getItem('lastChoiceMsgModelIndex') : 0,
        isShowMsgChildrenType :false,
        isFlMaintenance: true
    },
    mutations : {
        SET_TEMP_DENOM_ID(state, data){
            state.tempDenomId = data
        },
        isFlMaintenance(state, data){
            state.isFlMaintenance = data;
        },
        SET_TOKEN(state, data){
            state.token = data;
        },
        isMobile(state, data){
            state.isMobile = data;
        },
        setMainToken(state, data){
            state.mainToken = data || '';
        },
        currentTxModelIndex(state, data){
            state.currentTxModelIndex = data;
        },
        isShowMsgChildrenType(state, data){
            state.isShowMsgChildrenType = data;
        }
    }
});
export default store
