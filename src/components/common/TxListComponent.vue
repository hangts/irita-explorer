<template>
    <div class="tx_list_content">
        <el-table class="table" :data="formatTxData" :empty-text="$t('ExplorerLang.table.emptyDescription')">
            <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                <template slot-scope="scope">
                    <div class="tx_transaction_content_hash">
                        <img class="status_icon"
                                     :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
                        <el-tooltip :content="scope.row.txHash"
                                    placement="top"
                                    :disabled="!isValid(scope.row.txHash)">
                            <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                <template slot-scope="scope">
                    <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.txType.join(',')"
                                placement="top"
                                :disabled="scope.row.txType.length <= 1">
                        <span>{{getDisplayTxType(scope.row.txType) }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.message" :label="$t('ExplorerLang.table.message')">
                <template slot-scope="scope">
                    <span>{{scope.row.msgCount}} {{$t('ExplorerLang.unit.msgCountUnit')}}</span>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.from')">
                <template slot-scope="scope">
                    <el-tooltip v-show="Number(scope.row.msgCount) <= 1" :content="scope.row.from"
                                placement="top"
                                :disabled="!isValid(scope.row.from)">
                        <router-link v-if="isValid(scope.row.from)" :to="Tools.addressRoute(scope.row.from)">
                            {{  formatMoniker(scope.row.fromMonikers) || formatAddress(scope.row.from)}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                    <span v-show="Number(scope.row.msgCount) > 1">--</span>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.to')">
                <template slot-scope="scope">
                    <el-tooltip v-show="Number(scope.row.msgCount) <= 1" :content="String(scope.row.to)"
                                placement="top"
                                :key="Math.random()"
                                :disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
                        <router-link v-if="typeof scope.row.to=='string' && isValid(scope.row.to)" :to="Tools.addressRoute(scope.row.to)">
                            {{ formatMoniker(scope.row.toMonikers) || formatAddress(scope.row.to)}}
                        </router-link>
                        <router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
                            {{ `${scope.row.to.length} ${$t('ExplorerLang.unit.providers')}`}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                    <span v-show="Number(scope.row.msgCount) > 1"> --</span>
                </template>
            </el-table-column>
            <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.signer')">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.signer"
                                placement="top"
                                :disabled="!isValid(scope.row.signer)">
                        <router-link v-if="isValid(scope.row.signer)" :to="Tools.addressRoute(scope.row.signer)">{{formatAddress(scope.row.signer)}}
                        </router-link>
                        <span v-else>{{'--'}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Tools from "../../util/Tools"
    import {TxHelper} from "../../helper/TxHelper";
    import { TX_TYPE,TX_STATUS,ColumnMinWidth } from '../../constant';
    export default {
        name : "TxList",
        components : {},
        props:{
            txData:{
                type:Array,
                required:true,
            },
        },
        data(){
            return {
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                Tools
            }
        },
        computed:{
            formatTxData(){
                let result = this.txData.map((tx)=>{
                    if(tx) {
                        let addrObj = TxHelper.getFromAndToAddressFromMsg((tx.msgs || [])[0]);
                        let from = addrObj.from || '--',
                            to =  addrObj.to || '--';
                        let fromMonikers,toMonikers
                        if(tx.monikers.length) {
                            tx.monikers.map( item => {
                                toMonikers = toMonikers || item[to] || ''
                                fromMonikers = fromMonikers || item[from] || ''
                            })
                        }
                        return {
                            txHash : tx.tx_hash,
                            blockHeight : tx.height,
                            txType :(tx.msgs || []).map(item=>item.type),
                            from,
                            fromMonikers,
                            toMonikers,
                            to,
                            signer : tx.signers[0],
                            status : tx.status,
                            msgCount : tx.msgs.length,
                            time :Tools.getDisplayDate(tx.time),
                        }
                    }
                });
                return result;
            }
        },
        mounted(){
        },
        methods : {
            isValid(value){
                return (!value || !value.length || value == '--') ? false : true;
            },
            getDisplayTxType(types=[]){
                let type = types[0] || '';
                if (type && types.length > 1) {
                    type += this.$t('ExplorerLang.unit.ellipsis');
                }
                return type;
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            formatMoniker (moniker) {
				if (!moniker) {
					return ''
				}
				return Tools.formatString(moniker, 15, '...')
			},
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }
    .tx_list_content{
        .tx_transaction_content_hash{
            display: flex;
            align-items: center;
        }
        .status_icon{
            width:0.13rem;
            height:0.13rem;
            margin-right:0.05rem;
        }
        .pagination_content {
            display: flex;
            justify-content: flex-end;
            margin: 0.1rem 0 0.2rem 0;
        }
    }
</style>
