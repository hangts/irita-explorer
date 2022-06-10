<template>
    <div class="tx_list_content">
        <el-table class="table columns-fit table_overflow_x" :data="txDataList" :empty-text="$t('ExplorerLang.table.emptyDescription')" ref="listTable" :class="loading ? null : 'visible'">
            <el-table-column class-name="hash_status" align="left" :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                <template slot-scope="scope">
                    <div class="tx_transaction_content_hash">
                        <div class="status">
                            <img class="status_icon"
                                     :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                        </div>
                        <el-tooltip :content="scope.row.txHash"
                                    placement="top"
                                    :disabled="!isValid(scope.row.txHash)">
                            <div>
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </div>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column class-name="tx_type"  :width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')"> -->
            <el-table-column class-name="tx_type"  :min-width="colWidthList[1]" :label="$t('ExplorerLang.table.txType')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.txType.join(',')"
                                placement="top-start"
                                :disabled="scope.row.msgCount <= 1">
                        <div class="ty_type_message">
                            <span>{{TxHelper.getDisplayTxType(scope.row.txType)}}</span>
                            <span class="message_number" v-if="scope.row.msgCount != 1">+{{scope.row.msgCount - 1}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- <el-table-column align="right" class-name="amount" prop="amount" :label="$t('ExplorerLang.table.amount')" :min-width="ColumnMinWidth.amountAndDenom"> -->
            <el-table-column align="center" class-name="amount" prop="amount" :label="$t('ExplorerLang.table.amount')" :width="colWidthList[2]">
                <!-- <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.amount')}}</span>
                  <el-tooltip :content="mainTokenSymbol"
                              placement="top">
                      <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
                </template > -->
                <template slot-scope="scope">
                  <span v-if="scope.row.msgCount == 1 && !scope.row.isShowMore">
                    <span v-if="scope.row.denomTheme.tooltipContent">
                      {{ getAmount(scope.row.amount) }}
                      <el-tooltip  :content="scope.row.denomTheme.tooltipContent" placement="top">
                      <span :style="{ color: scope.row.denomTheme.denomColor }">
                        {{ getAmountUnit(scope.row.amount) }}
                      </span>   
                    </el-tooltip>
                    </span>
                    <span v-else>{{ scope.row.amount }}</span>
                  </span>                 
                  <router-link v-else :to="`/tx?txHash=${scope.row.txHash}`">
                    {{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i>              
                  </router-link>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" :min-width="ColumnMinWidth.message" :label="$t('ExplorerLang.table.message')">
              <template slot-scope="scope">
                <span>{{scope.row.msgCount}} {{$t('ExplorerLang.unit.msgCountUnit')}}</span>
              </template>
            </el-table-column> -->
            <el-table-column :min-width="ColumnMinWidth.address" class-name="from" :label="$t('ExplorerLang.table.from')">
                <template slot-scope="scope">
                    <el-tooltip v-if="isValid(scope.row.from) && Number(scope.row.msgCount) <= 1" :content="scope.row.from"
                                placement="top"
                                :disabled="!isValid(scope.row.from)">
                        <span v-if="isValid(scope.row.from) && address !== scope.row.from "
                              class="address_link"
                              @click="addressRoute(scope.row.from)">
                            {{  formatMoniker(scope.row.fromMonikers,monikerNum.otherTable) || formatAddress(scope.row.from)}}
                        </span>
                        <span v-else>
                            {{ formatMoniker(scope.row.fromMonikers,monikerNum.otherTable) || formatAddress(scope.row.from) }}
                        </span>
                    </el-tooltip>

                    <span v-else-if="scope.row.from === '--' && Number(scope.row.msgCount) <= 1">
                      {{ formatMoniker(scope.row.fromMonikers,monikerNum.otherTable) || formatAddress(scope.row.from) }}
                    </span>

                    <router-link v-else :to="`/tx?txHash=${scope.row.txHash}`">
                        {{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" class-name="to" :label="$t('ExplorerLang.table.to')">
                <template slot-scope="scope">
                    <el-tooltip  v-if="isValid(scope.row.to) && Number(scope.row.msgCount) <= 1" :content="String(scope.row.to)"
                                placement="top"
                                :disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
                        <span v-if="typeof scope.row.to=='string' && isValid(scope.row.to) && address !== scope.row.to"
                              class="address_link"
                              @click="addressRoute(scope.row.to)">
                            {{ formatMoniker(scope.row.toMonikers,monikerNum.otherTable) || formatAddress(scope.row.to)}}
                        </span>
                        <span v-else-if="typeof scope.row.to=='string' && isValid(scope.row.to) && address === scope.row.to">
                            {{ formatMoniker(scope.row.toMonikers,monikerNum.otherTable) || formatAddress(scope.row.to)}}
                        </span>
                        <router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
                            {{ `${scope.row.to.length} ${$t('ExplorerLang.unit.providers')}`}}
                        </router-link>
                    </el-tooltip>
                    <span v-else-if="scope.row.to === '--' && Number(scope.row.msgCount) <= 1">
                      {{ formatMoniker(scope.row.toMonikers,monikerNum.otherTable) || formatAddress(scope.row.to) }}
                    </span>
                    <router-link v-else :to="`/tx?txHash=${scope.row.txHash}`">
                        {{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i>
                    </router-link>
                </template>
            </el-table-column>
            <!-- <el-table-column :min-width="ColumnMinWidth.blockHeight" class-name="block" :label="$t('ExplorerLang.table.block')"> -->
            <el-table-column :min-width="colWidthList[5]" class-name="block" :label="$t('ExplorerLang.table.block')" align="center">
                <template slot-scope="scope">
                    <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                </template>
            </el-table-column>
            <!-- <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.signer')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.signer"
                                placement="top"
                                :disabled="!isValid(scope.row.signer)">
                        <span v-if="isValid(scope.row.signer) && address !== scope.row.signer" class="address_link" @click="addressRoute(scope.row.signer)">{{formatAddress(scope.row.signer)}}
                        </span>
                        <span v-else-if="isValid(scope.row.signer) && address === scope.row.signer">{{formatAddress(scope.row.signer)}}
                        </span>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column> -->
            <el-table-column v-if="isShowFee" align="left" class-name="fee" prop="Tx_Fee" :min-width="ColumnMinWidth.fee">
                <template slot="header">
                    <template v-if="productNameWC === productName">
                        <span>{{ $t('ExplorerLang.table.energy') }}</span>
                    </template>
                    <template v-else>
                        <span>{{ $t('ExplorerLang.table.fee') }}</span>
                        <el-tooltip :content="mainTokenSymbol"
                                    placement="top">
                            <i class="iconfont iconyiwen yiwen_icon" />
                        </el-tooltip>
                    </template>
                  
                </template>
            </el-table-column>
            <!-- <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column> -->
            <el-table-column :width="ColumnMinWidth.blockAge" prop="ageTime" :label="$t('ExplorerLang.table.age')"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Tools from "../../util/Tools";
    import {TxHelper} from "../../helper/TxHelper";
    import { TX_TYPE,TX_STATUS,ColumnMinWidth,monikerNum,decimals, IRIS_ADDRESS_PREFIX, COSMOS_ADDRESS_PREFIX, PRODUCT_WENCHANG} from '../../constant';
    import { addressRoute, formatMoniker, converCoin, getMainToken, getTxType } from '@/helper/IritaHelper';
    import { getAmountByTx, getDenomMap, getDenomTheme } from "../../helper/txListAmoutHelper";
    import prodConfig from '../../productionConfig';
    import parseTimeMixin from '../../mixins/parseTime'
    export default {
        name : "TxList",
        components : {},
        mixins: [parseTimeMixin],
        props:{
            txData:{
                type:Array,
                required:true,
            },
            address:{
                type:String,
                default:'a'
            }
        },
        data(){
            return {
                TX_TYPE_DISPLAY: {},
                tyepWidth: ColumnMinWidth.txType,
                TxHelper,
                isShowFee: prodConfig.fee.isShowFee,
                isShowDenom: prodConfig.fee.isShowDenom,
                productName: prodConfig.product || '',
                productNameWC: PRODUCT_WENCHANG, 
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                Tools,
                addressRoute,
                formatMoniker,
                monikerNum,
                feeDecimals: decimals.fee,
                txDataList: [],
                colWidthList: [],
                loading: false,
                mainTokenSymbol:'',
                IRIS_ADDRESS_PREFIX,
                COSMOS_ADDRESS_PREFIX,
                denomMap: {},
                IBC: 'IBC',
                HashLock: 'Hash Lock'
            }
        },
        watch:{
            txData() {
              this.formatTxData();
            }
        },
        async created(){
            await this.getTxTypeData()
            this.formatTxData()
        },
        mounted(){
            this.setMainToken();
        },
        methods : {
            async getTxTypeData(){
                try {
                    let res = await getTxType()
                    this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
                } catch (error) {
                    console.log(error)
                }
            },
            isValid(value){
                return (!value || !value.length || value == '--') ? false : true;
            },
            async setMainToken(){
                let mainToken = await getMainToken();
                if(mainToken && mainToken.symbol){
                    this.mainTokenSymbol = mainToken.symbol.toUpperCase();
                }
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            getAmount(amount) {
              if (!amount) {
                  return "";
              }
              let denomRule = /[0-9.]+/
              return amount.match(denomRule)[0];
            },
            getAmountUnit(amount) {
              if (!amount) {
                  return "";
              }
              let denomRule = /[A-Za-z\/]+/
              return amount.match(denomRule)[0];
            },
            async formatTxData() {
                try {
                    this.loading = true;
                    this.txDataList = []
                    if(this.txData && this.txData.length) {
                        let fees = []
                        let amounts = []
                        for (const tx of this.txData) {
                            let msg;
                            if(tx.msgs.length > 0){
                                let recvPacketItem = tx.msgs.find((m)=>{
                                    if(m.type === TX_TYPE.recv_packet || m.type === TX_TYPE.transfer || m.type === TX_TYPE.timeout_packet){
                                        return true;
                                    }
                                });
                                if(recvPacketItem){
                                    msg = recvPacketItem;
                                }else{
                                    msg = tx.msgs[0]
                                }
                            }
                            let addrObj = TxHelper.getFromAndToAddressFromMsg(msg);
                            amounts.push(tx.msgs[0] ? getAmountByTx(tx.msgs[0], true) : '--');
                            let from = addrObj.from || '--',
                                to =  addrObj.to || '--';
                            let fromMonikers,toMonikers
                            if((tx.monikers || {}).length) {
                                tx.monikers.map( item => {
                                    toMonikers = toMonikers || item[to] || ''
                                    fromMonikers = fromMonikers || item[from] || ''
                                })
                            }
                            if(this.isShowFee) {
                                fees.push(tx.fee && tx.fee.amount && tx.fee.amount.length > 0 ? await converCoin(tx.fee.amount[0]) :'--')
                            }
                            let isShowMore = false;
                            const type = tx.msgs && tx.msgs[0] && tx.msgs[0].type;
                            if(type && (type === TX_TYPE.add_liquidity || type === TX_TYPE.remove_liquidity)) {
                                isShowMore = true
                            }
                            if(tx.type === TX_TYPE.send) {
                                tx && tx.msgs && tx.msgs[0] && tx.msgs[0].msg && tx.msgs[0].msg.amount && tx.msgs[0].msg.amount.length > 1 ? isShowMore = true : ''
                                let denom = tx?.msgs?.[0]?.msg?.amount?.[0]?.denom
                                if(denom !== undefined && /(lpt|LPT|lpt-|LPT-)/g.test(denom)) {
                                	isShowMore = true
                                }
                            } 
                            this.txDataList.push({
                                    txHash : tx.tx_hash,
                                    blockHeight : tx.height,
                                    txType : (tx.msgs || []).map(item=>this.TX_TYPE_DISPLAY[item.type] || item.type),
                                    from,
                                    fromMonikers,
                                    toMonikers,
                                    to,
                                    signer : tx.signers[0],
                                    status : tx.status,
                                    msgCount : tx.msgs.length,
                                    // time :Tools.getDisplayDate(tx.time),
                                    Tx_Fee: '',
                                    Time: tx.time,
                                    amount: '',
                                    ageTime: Tools.formatAge(Tools.getTimestamp(),tx.time*1000, this.$t('ExplorerLang.table.suffix')),
                                    isShowMore,
                                    denomTheme: {
                                    denomColor: '',
                                    tooltipContent: ''
                                    }
                            })
                            /**
                             * @description: from parseTimeMixin
                             */
                            this.parseTime('txDataList', 'Time', 'ageTime')
                        }
                        if(fees && fees.length > 0 && this.isShowFee) {
                            let fee = await Promise.all(fees);
                            this.txDataList.forEach((item,index) => {
                                    // this.txDataList[index].Tx_Fee = fee[index] && fee[index].amount ?  this.isShowDenom ? `${Tools.toDecimal(fee[index].amount,this.feeDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : '--';
                                    // remove denom
                                    this.txDataList[index].Tx_Fee = fee[index] && fee[index].amount ?  this.isShowDenom ? `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : '--';
                            })
                        }
                        if(amounts && amounts.length > 0) {
                            let amount = await Promise.all(amounts)
                            this.denomMap = await getDenomMap()
                            this.txDataList.forEach((item, index) => {    
                            this.txDataList[index].denomTheme =getDenomTheme(amount[index], this.denomMap)
                            this.txDataList[index].amount = amount[index] 
                            })
                        }
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.colWidthList = this.$adjustColumnWidth(this.$refs['listTable'].$el);
                                this.loading = false;
                            });
                        });
                    }
                } catch (error) {
                    console.log(error)
                }
             
            },
        }
    }
</script>

<style scoped lang="scss">
::v-deep.columns-fit {
    // .el-table__header-wrapper, .el-table__body-wrapper {
    //     visibility: hidden;
    // }

    // &.visible {
    //     .el-table__header-wrapper, .el-table__body-wrapper {
    //         visibility: visible;
    //     }
    // }

    .el-table__body-wrapper {
        overflow: auto;
    }

    td > .cell {
        display: inline-block;
        white-space: nowrap;
        width: auto;
        overflow: auto;
    }
}
a {
    color: $t_link_c !important;
}
::v-deep .hash_status {
    .cell {
        // margin-left: 0.05rem;
    }
}
.tx_list_content {
    .tx_transaction_content_hash {
        display: flex;
        .status {
            .status_icon {
                width: 0.13rem;
                height: 0.13rem;
                margin-right: 0.05rem;
            }
        }
    }
    .pagination_content {
        display: flex;
        justify-content: flex-end;
        margin: 0.1rem 0 0.2rem 0;
    }
    ::v-deep .cell {
        // padding: 0 0.04rem;
    }
}
::v-deep .hash_status .cell {
    padding-left: 20px;
    padding-right: 0px;
}
::v-deep .amount .cell {
    padding-right: 10px;
    padding-left: 0px
}
::v-deep .from .cell {
    padding-left: 40px;
}
::v-deep .fee .cell {
    padding-right: 28px;
}
::v-deep .block .cell {
    padding-left: 0px;
}
</style>
