<template>
    <!-- 
      用法：
        detailInfo: {object[]} 配置项
        格式要求：[
          {
            label:'名称',  // 必传
            value:'名称对应的值', // 必传
            // 注意：以下为可选项，只能任选一个，不可都配置
            isService: true, // 可选 可跳转到 /servcie
            isAddress: true, // 可选 可跳转到 /address
            isSchema: true // 可选 使用 LargeString 渲染内容
            isAsset: true // 可选 跳转到 /asset
            isArray: true // 可选 渲染多个
            isIdentity: true // 可选 跳转到 /identity
            isProposal: true // 跳转到/ProposalsDetail
            isComplexAddr: true // 需要代码判断跳转路径
             isMultiLink: true // 针对多链接地址

            // 需要配合使用的配置
            isMulti: true // 可选 配合isAddress 使用，针对具有多个值的情况
           
        }]
     -->
  	<div>
			<p v-for="(info, key) in detailInfo" :key="key" v-if="info.label">
          <span>{{ info.label }}：</span>
          
          <!-- isService 为 true 跳转到/service -->
          <template v-if="info.isService">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <router-link v-else :to="`/service?serviceName=${ info.value }`">
              {{ info.value }}
            </router-link>
          </template>
          
          <!-- isAddress 为 true 跳转到/address -->
          <template v-else-if="info.isAddress">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <span v-else-if="judgeCosmos(info.value)">{{ info.value }}</span>
            <template v-else>
              <span v-if="info.isMulti" class="verticalShow">
                <router-link v-for="(item, index) in info.value" :key="index" class="address_link" :to="`/address/${item}`">{{ item }}</router-link>
              </span> 
              <span v-else>
                <router-link  class="address_link" :to="`/address/${info.value}`">{{ info.value }}</router-link>
              </span>
            </template>
          </template>  

          <!-- isSchema 为 true  显示长字符串 -->
          <template v-else-if="info.isSchema">
            <LargeString :isShowPre="Tools.isJSON(info.value)" v-if="info.value" :text="info.value" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
          </template>

          <!-- isUri 为true 处理uri -->
          <template v-else-if="info.isUri">
            <div class="wrap" v-if="info.value && info.value !== '[do-not-modify]'">
                  <a class="text" v-if="Tools.testUrl(info.value)" :href="info.value" target="_blank">{{info.value}}</a>
                  <a class="text" v-else-if="startStr(info.value)" :href="'http://' + info.value" target="_blank">{{info.value}}</a>
                  <span class="text" v-else>{{info.value}}</span>
            </div>
            <span v-else-if=" info.value === '[do-not-modify]'">{{info.value}}</span>
            <span v-else>--</span>
          </template>
          
          <!-- isAsset 为true 可跳转 /assets -->
          <template v-else-if="info.isAsset">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <router-link v-else :to="`/assets/${ info.value }`">
              {{ info.value }}
            </router-link>
          </template>
          
          <!-- isArray 为true 渲染多个 -->
          <template v-else-if="info.isArray">
              <span>
                  <p class="mb-5" v-for="item in info.value" :key="item">{{item}}</p>
              </span>
          </template>
          
          <!-- isIdentity 为true 跳转到/identity -->
          <template v-else-if="info.isIdentity">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <router-link v-else :to="`/identity/${ info.value }`">
              {{ info.value }}
            </router-link>
          </template>

          <!-- isLink 为true 渲染成a标签，可以跳转 -->
          <template v-else-if="info.isLink">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <a v-else :href="info.value" target="_blank">
              {{ info.value }}
            </a>
          </template>

          <!-- isProposal 为true 跳转到/ProposalsDetail -->
          <template v-else-if="info.isProposal">
          <span v-if="!info.value || info.value === '--'"> -- </span>
            <router-link v-else :to="`/ProposalsDetail/${ info.value }`">
              {{ info.value }}
            </router-link>
          </template>
          
          <!-- isComplexAddr 为true  需要通过代码判断跳转地址 -->
          <template v-else-if="info.isComplexAddr">
            <span v-if="!info.value || info.value === '--'"> -- </span>
            <span v-else-if="judgeCosmos(info.value)">{{ info.value }}</span>
            <span v-else @click="addressRoute(info.value)"
              :class="(info.value.startsWith(COSMOS_ADDRESS_PREFIX) || info.value.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
            >{{ info.value }}</span>
          </template>

          <!--  isMultiLink  true 对多链接地址 -->
          <template v-else-if="info.isMultiLink">
             <MultiLink v-if="info.value" :text="info.value"/>
          </template>
          
          <template v-else>
            <span :style="{color: info.value === $t('ExplorerLang.common.failed') ? '#fa8593' : ''}">{{ formatValue(info.value) }}</span>
          </template>
          
          <!-- isTip 合约执行结果 -->
          <template v-if="info.isTip">
            <el-tooltip popper-class="tooltip" placement="top" :style="{color: info.value === $t('ExplorerLang.common.failed') ? '#fa8593' : ''}">
                <div slot="content" style="max-width: 7rem;">
	                {{ info.log }}
                </div>
                <i class="iconfont iconyiwen"></i>
            </el-tooltip>
          </template>
			</p>
		</div>
</template>
<script>
import { COSMOS_ADDRESS_PREFIX,IRIS_ADDRESS_PREFIX } from '@/constant';
import Tools from '@/util/Tools'
import LargeString from './LargeString';
import MultiLink from './MultiLink.vue';
import { addressRoute } from "@/helper/IritaHelper"

export default {
  name: "TxDetailComponent",
  components:{LargeString, MultiLink},
  props: {
    detailInfo:{
      type: Array,
      required:true,
    },
    isShowFee:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      LargeStringMinHeight: 100,
      LargeStringLineHeight: 20,
      Tools,
      COSMOS_ADDRESS_PREFIX,
      IRIS_ADDRESS_PREFIX,
      addressRoute
    }
  },
  methods:{
    judgeCosmos(addr){
      if(typeof addr !== 'string'){
        return false
      }
			return addr.startsWith(COSMOS_ADDRESS_PREFIX)
		},
    formatValue(val){
      if(val || val === 0 || typeof val ==='boolean'){
        return val
      }else if(!val){
        return '--'
      }
    },
    startStr(url){
			return url.startsWith('www.')
		}
  }
}
</script>
<style scoped lang="scss">
	p {
			display: flex;
			margin-bottom: 0.26rem;

			span:nth-of-type(1) {
				margin-right: 0.15rem;
				color: $t_second_c;
				// min-width: 1.52rem;
				min-width: 1.64rem;
				text-align: left;
				font-size: $s14;
				font-weight: 600;
                @media(max-width: 768px) {
                    min-width: 1.4rem;
                }
			}

			span:nth-of-type(2) {
				text-align: left;
				font-size: $s14;
				color: $t_first_c;
				word-break: break-all;
				line-height: 0.20rem;
			}
            ::v-deep .el-tooltip {
                display: flex;
                align-items: center;
                margin-left: 0.04rem;
            }
			.wrap {
				.text {
					flex: 1;
					text-align: left;
					font-size: $s14;
					color: $t_first_c;
					word-break: break-all;
					line-height: 0.20rem;
					font-weight: normal;
				}
        a.text{
          color: $t_link_c;
        }
			}
			a{
				word-break: break-all;
	  	  color: $t_link_c;
			}
		}

  p:last-child {
    margin-bottom: 0;
  }
  .verticalShow{
    display: flex;
    flex-direction: column;
  }
  .mb-5{
    margin-bottom: 0.05rem;
  }
</style>