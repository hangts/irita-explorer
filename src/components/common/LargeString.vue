<template>
    <span :class="`tx_message_content_largeStr ${mode=='cell'?'flex-row':'flex-colum'}`">
        <template v-if="isShowPre">
            <pre v-if="isLarge" ref="text" :style="`width:${textWidth || 'auto'}`">{{ !text || text.endsWith("...") ? text : JSON.stringify(JSON.parse(text),null,'\t').replace(/^\s*/g,"")}}</pre>
            <pre v-else class="text" :class=" !showDesc ? 'width': ''" :style="`width:${textWidth || 'auto'}`">{{!text_f || text_f.endsWith("...") ? text_f : JSON.stringify(JSON.parse(text_f),null,'\t').replace(/^\s*/g,"")}}</pre>
        </template>
        <template v-else>
            <span v-if="isLarge" ref="text" :style="`width:${textWidth || 'auto'}`">{{text}}</span>
            <span v-else class="text" :class=" !showDesc ? 'width': ''" :style="`width:${textWidth || 'auto'}`">
                {{text_f}}
            </span>
        </template>
        <template>
            <span class="tx_message_content_largeStr_btn" v-if="showDescBtn(text)" @click="btnDidClick">
                {{`${showDesc ? $t('ExplorerLang.common.fewer') : $t('ExplorerLang.common.more')}`}}
            </span>
            <span class="tx_message_content_largeStr_btn" v-if="isLarge && mode=='cell'" @click="btnDidClick">
                {{$t('ExplorerLang.common.fewer')}}
            </span>
        </template>
    </span>
</template>

<script>
    export default {
        name : "LargeString",
        components : {},
        props:{
            text:{
                type:String,
                required:true,
            },
            maxLength:{
                type:Number,
                required:false,
                default:200,
            },
            mode:{//nomal or cell
                type:String,
                required:false,
                default:'nomal'
            },
            textWidth:{
                type:String,
                required:false,
                default:''
            },
            minHeight:{
                type:Number,
                required:false,
                default: 0
            },
            lineHeight:{
                type:Number,
                default: 0
            },
            isShowPre: {
                type: Boolean,
                default: false
            },
            expand:{
                type:Boolean,
                required:false
            }
        },
        data(){
            return {
                showDesc:false,
                isLarge:true,
                isHeight:false,
            }
        },
        computed:{
            text_f(){
                return this.showDesc ? this.text : this.formatLargeStr(this.text);
            }
        },
        mounted(){
            setTimeout( () => {
                    this.$nextTick(()=>{
                    let height = this.$refs.text.offsetHeight;
                    if(this.expand){
                        this.showDesc = true;
                    }else{
                        this.showDesc = height <= this.minHeight
                    }

                    this.isLarge = false
                    if(this.lineHeight) {
                        this.isHeight  = height > this.lineHeight
                    }
                })
            },0)
        },
        methods : {
            btnDidClick(){
                this.showDesc = !this.showDesc;
            },
            formatLargeStr(str,length){
                length = length || this.maxLength;
                if (str && str.length>this.maxLength) {
                    return `${str.substr(0,this.maxLength)}...`;
                }
                return str || '';
            },
            showDescBtn(str){
                if(this.lineHeight) {
                    return this.isHeight;
                } else {
                    return str && str.length > this.maxLength;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
p span {
	word-break: keep-all !important;
}

.tx_message_content_largeStr {
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
</style>
