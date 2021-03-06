<template>
    <div class="identity_list_container">
        <div class="identity_list_content_wrap">
            <h3 class="identity_list_header_title">{{count}} {{$t('ExplorerLang.identityList.title')}}</h3>
            <div class="nef_list_table_container">
                <div class="identity_list_header_content">
                    <el-input v-model="input"
                              @change="handleSearchClick"
                              :placeholder="$t('ExplorerLang.identityList.placeHolder')"></el-input>
                    <div class="tx_type_mobile_content">
                        <div class="search_btn" @click="handleSearchClick">
                            {{$t('ExplorerLang.identityList.search')}}
                        </div>
                        <div class="reset_btn" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>
                        </div>
                    </div>
                </div>
                <el-table class="table" :data="identityList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.identity" :label="$t('ExplorerLang.table.identity')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.id"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.id)">
                                <router-link :to="`/identity/${scope.row.id}`">{{formatStr20(scope.row.id)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.address"
                                     :label="$t('ExplorerLang.table.owner')" >
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.owner"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.owner)">
                                <router-link :to="`/address/${scope.row.owner}`">
                                    {{formatAddress(scope.row.owner)}}
                                </router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        placement="top"
                                        :disabled="!Tools.isValid(scope.row.txHash)">
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.updateTime')" prop="time">
                        <template slot-scope="scope">
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content">
                    <keep-alive>
                        <m-pagination :page-size="pageSize"
                                      :total="count"
                                      :page="pageNum"
                                      :page-change="pageChange">
                        </m-pagination>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getIdentities } from "../service/api"
    import Tools from "../util/Tools";
    import MPagination from "./common/MPagination";
    import { ColumnMinWidth } from '../constant';
    export default {
        name: "identityList",
        components: {MPagination},
        data () {
            return {
                Tools,
                ColumnMinWidth,
                identityList:[],
                pageNum: 1,
                pageSize: 20,
                input:'',
                count:0
            }
        },
        mounted(){
            this.identities();
        },
        methods:{
            reset(){
                this.input = '';
                this.pageNum = 1;
                this.identities()
            },
            pageChange(pageNum){
                this.pageNum = pageNum;
                this.identities()
            },
            handleSearchClick(){
                this.pageNum = 1;
                this.identities();
            },
            async identities(){
                try {
                    const res = await getIdentities(this.input, this.pageNum, this.pageSize);
                    if(res && res.data && Array.isArray(res.data) && res.data.length > 0){
                        this.identityList = res.data.map((item)=>{
                            let pubkey = (item.pubkeys || [])[0] || {};
                            return {
                                id : item.identities_id || '--',
                                owner : item.owner || '--',
                                pubkeys : pubkey.pubkey || '--',
                                certificates : (item.certificates || [])[0] || '--',
                                credentials : (item.credentials && item.credentials!='[do-not-modify]') ? item.credentials : '--',
                                algorithm: pubkey.algorithm || '--',
                                txHash: item.update_tx_hash || '--',
                                time: Tools.getDisplayDate(item.update_block_time) || '--'
                            }
                        });
                        this.count = res.count;
                        this.pageSize = res.pageSize;
                        this.pageNum = res.pageNum;
                    }else{
                        this.count = 0;
                        this.identityList = [];
                    }
                }catch (e) {
                    this.count = 0;
                    this.identityList = [];
                    console.error(e)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatStr20(str){
                if (str && str.length > 20) {
                    return `${str.substr(0,20)}...`;
                }
                return str || '';
            },
            formatUrl(url){
                if (!(/^http:\/\/|^https:\/\//).test(url)) {
                    return `http://${url}`;
                }
                return url;
            }

        }
    }
</script>

<style scoped lang="scss">
    a{
        color: $t_link_c !important;
    }
    .identity_list_container{
        @media screen and (min-width: 910px){
            .identity_list_content_wrap{
                max-width: 12rem;
                .identity_list_header_content{
                    display: flex;
                    align-items: center;
                    /deep/ .el-input{
                        max-width: 3.5rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            font-size: $s14 !important;
                            line-height: 0.32rem;
                        }
                    }
                    .tx_type_mobile_content{
                        align-items: center;
                    }
                }
            }

        }
        @media screen and (max-width: 910px){
            .identity_list_content_wrap{
                width:100%;
                padding:0 0.15rem;
                box-sizing: border-box;
                .identity_list_header_content{
                    display: flex;
                    flex-direction:column;
                    justify-content: flex-start;
                    /deep/ .el-input{
                        margin-bottom:0.1rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            font-size: $s14 !important;
                            line-height: 0.32rem;
                        }
                    }
                    .tx_type_mobile_content{
                        justify-content: flex-end;
                        margin-bottom:0.1rem;
                    }
                }
            }

        }
        .identity_list_content_wrap{
            margin: 0 auto;
            padding:0 0.15rem;
            .identity_list_header_title{
                margin: 0.3rem 0 0.1rem 0.27rem;
                font-size: $s18;
                color: $t_first_c;
                line-height: 0.21rem;
                text-align: left;
            }
            .identity_list_header_content{
                width: 100%;
                margin: 0rem 0 0.1rem 0;
                /deep/ .el-input{
                    .el-input__inner{
                        font-size: $s14 !important;
                        &::-webkit-input-placeholder{
                            font-size: $s14 !important;
                        }
                    }
                }
                .tx_type_mobile_content{
                    display: flex;
                    .joint_mark{
                        margin: 0 0.08rem;
                    }
                    .reset_btn{
                        background: $bg_button_c;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        margin-left: 0.1rem;
                        cursor: pointer;
                        i{
                            padding: 0.08rem;
                            font-size: $s14;
                            line-height: 1;
                            display: inline-block;
                        }
                    }
                    .search_btn{
                        cursor: pointer;
                        background: $bg_button_c;
                        margin-left: 0.1rem;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: $s14;
                        line-height: 0.2rem;
                    }
                }
            }
            /deep/ .nef_list_table_container{
                background: $bg_white_c;
                border-radius: 0.05rem;
                border: 0.01rem solid $bd_first_c;
                margin: 0.2rem 0;
                padding: 0.24rem 0.28rem 0.36rem 0.28rem;
                a{
                    cursor:pointer;
                }
                .pagination_content{
                    display: flex;
                    justify-content: flex-end;
                    margin: 0.1rem 0 0.2rem 0;
                }
                .el-table{
                    .el-table__header-wrapper{
                        .el-table__header{
                            .has-gutter{
                                tr{
                                    th:first-child{
                                        .cell{
                                            padding-left: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .el-table__body-wrapper{
                        .el-table__body{
                            tbody{
                                .el-table__row{
                                    td:first-child{
                                        .cell{
                                            padding-left: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
