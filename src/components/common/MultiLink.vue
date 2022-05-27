<template>
    <span :class="`tx_message_content_largeStr ${mode=='cell'?'flex-row':'flex-colum'}`">

        <!-- 这里才是渲染结果，通过text_f控制渲染内容 -->
        <div class="text" ref="text"  :style="`width:${textWidth || 'auto'}`">
            <div v-for="(item,index) in text_f" :key="index" class="mb-10" :class=" !showDesc ? 'width': ''">
                <a v-if="startStr(item)" :href="'http://' + item" target="_blank" class="address_link">{{item}}</a>
                <span v-else-if="item === '--'">{{item}}</span>
                <a v-else :href="item" target="_blank" class="address_link">{{item}}</a>
            </div>
        </div>
        <template>
            <span class="tx_message_content_largeStr_btn" v-if="showDescBtn(text)" @click="btnDidClick">
                {{`${showDesc ? $t('ExplorerLang.common.fewer') : $t('ExplorerLang.common.more')}`}}
            </span>
      
        </template>
    </span>
</template>

<script>
    /**
     * 用于展示多uri场景，
     * 首次用于bsn-ddc 多uri展示
     */
    export default {
        name : "MultiLink",
        components : {},
        props:{
            text:{
                type:Array,
                required:true,
            },
            mode:{//normal or cell
                type:String,
                required:false,
                default:'normal'
            },
            textWidth:{
                type:String,
                required:false,
                default:''
            },

        },
        data(){
            return {
                showDesc:false, // true 为收起 false 为展开     
                maxLength: 8,
                maxHeight: 200,
            }
        },
        computed:{
            text_f(){
                return this.showDesc ? this.text : this.formatMultiList(this.text);
            }
        },
        mounted(){
            setTimeout( () => {
                this.$nextTick(()=>{
                    const height = this.$refs.text.offsetHeight;
                    this.showDesc = this.text.length > 1 && this.text.length <= this.maxLength
                })
            },0)
        },
        methods : {
            btnDidClick(){
                this.showDesc = !this.showDesc;
            },
            formatMultiList(list){
                if (list && list.length > 1) {
                    return list.slice(0,1);
                }
                return list || '';
            },
            showDescBtn(list){
                return list.length > 1
            },
            startStr(url){
			    return url.startsWith('www.')
		    }
        }
    }
</script>

<style scoped lang="scss">
    .tx_message_content_largeStr{
        font-size: $s14;
        font-weight: 400;
        color: $t_first_c;
        word-break: break-all;
        min-width: 0;
        .text {
            overflow-y: auto;
            max-height: 2rem;
        }
        .text::-webkit-scrollbar{
            width: 10px;
            height: 10px;
            border-radius: 10px;
        }
        .text::-webkit-scrollbar-thumb{
            background-color: #C4C5C7;
            border-radius: 10px;
        }
        .width {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }
    .flex-row{
        display:flex;
        flex:1;
    }
    .flex-colum{
        display:flex;
        flex:1;
        flex-direction:column;
    }
    .tx_message_content_largeStr_btn{
            cursor:pointer;
            color:$t_link_c;
            align-self:flex-end;
            font-size: $s14;
            font-weight: 400;
            margin-left: 0rem;
            white-space: nowrap;
    }
    .text.width {
        text-indent: 0;
    }
    pre.text {
        // text-indent: -3em
    }
    pre {
        // overflow-x: hidden;
    }
    .mb-10{
        margin-bottom:0.05rem;
    }
</style>
