<template>
	<div class="tx_message_content" v-if="hide">
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.txType')}}：</span>
			<span>{{TX_TYPE_DISPLAY[txType] || txType}}</span>
		</p>


		<TxDetailComponent :detailInfo="detailInfo" />
		<!-- <div v-if="txType === TX_TYPE.define_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.description')}}：</span>
				<span>{{description}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.author')}}：</span>
				<template>
					<span v-if="author == '--' || this.judgeCosmos(author)">{{author}}</span>
					<router-link v-else class="address_link" :to="`/address/${author}`">{{author}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.authorDescription')}}：</span>
				<span>{{authorDescription}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.tags')}}：</span>
				<span>{{tags}}</span>
			</p>
		</div> -->
	
		<!-- <div v-if="txType === TX_TYPE.bind_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="defineName != '--'" :to="`/service?serviceName=${defineName}`">
					{{defineName}}
				</router-link>
				<span v-if="defineName == '--'"> -- </span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				<span>{{pricing}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span>
					<router-link class="address_link" :to="`/address/${provider}`">{{provider}}</router-link>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.bindService.options')}}：</span>
				<span>{{options}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link v-else class="address_link" :to="`/address/${owner}`">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<div v-if="txType === TX_TYPE.create_record" class="record_container">
			<div class="record_content">
				<p class="record_name">{{$t('ExplorerLang.transactionInformation.createRecord.contents')}}：</p>
				<div class="record_list_content">
					<el-table class="table" :data="recordArray"
					          :empty-text="$t('ExplorerLang.table.emptyDescription')">
						<el-table-column width="300px" label="digest" prop="digest"></el-table-column>
						<el-table-column width="150px" label="digest algo"
						                 prop="digest_algo"></el-table-column>
						<el-table-column label="uri" prop="uri">
							<template slot-scope="scope">
								<a v-if="scope.row.uri && scope.row.uri !== '--'"
								   :download="scope.row.uri" :href="scope.row.uri" target="_blank">{{scope.row.uri}}</a>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column width="200px" label="meta" prop="meta"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!-- <div v-if="txType === TX_TYPE.burn_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.mint_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="recipient === '--' || this.judgeCosmos(recipient)">{{recipient}}</span>
					<router-link v-else class="address_link" :to="`/address/${recipient}`">{{recipient}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>

		</div>  -->
		<!-- <div v-if="txType === TX_TYPE.transfer_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="recipient === '--' || this.judgeCosmos(recipient)">{{recipient}}</span>
					<router-link v-else class="address_link" :to="`/address/${recipient}`">{{recipient}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.edit_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.issue_denom">
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.denomId')}}</span>
			<span>{{denomId}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.denomName')}}</span>
			<span>{{denomName}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.symbol')}}</span>
			<span>{{symbol}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.schema')}}</span>
			<span>{{schema}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.mintRestricted')}}</span>
			<span>{{mintRestricted}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.updateRestricted')}}</span>
			<span>{{updateRestricted}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.issueDenom.sender')}}：</span>
			<template>
				<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
				<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
			</template>
		</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.send">
			<p>
					<span>{{$t('ExplorerLang.transactionInformation.send.amount')}}：</span>
					<span>
							<p style="margin-bottom: 0.05rem" v-for="item in amountArray" :key="item">{{item}}</p>
					</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="from === '--' || this.judgeCosmos(from)">{{from}}</span>
					<router-link v-else class="address_link" :to="`/address/${from}`">{{from}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="to === '--' || this.judgeCosmos(to)">{{to}}</span>
					<router-link v-else class="address_link" :to="`/address/${to}`">{{to}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.respond_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.requestId')}}：</span>
				<span>{{(requestId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--' || this.judgeCosmos(provider)">{{provider}}</span>
					<router-link v-else class="address_link" :to="`/address/${provider}`">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.result')}}：</span>
				<span>{{result}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.output')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(output)" v-if="output" :text="output"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.call_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '--').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--' || this.judgeCosmos(consumer)">{{consumer}}</span>
					<router-link v-else class="address_link" :to="`/address/${consumer}`">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.input')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(input)" v-if="input" :text="input"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column">
				<router-link v-for="(item,index) in provider"
							 :key="index"
							 class="address_link" :to="`/address/${item}`">{{item}}</router-link>
				</span>
				
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.repeated')}}：</span>
				<span>{{repeated}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.superMode')}}：</span>
				<span>{{superMode}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.pause_request_context ||
                   txType === TX_TYPE.start_request_context ||
                   txType === TX_TYPE.kill_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--' || this.judgeCosmos(consumer)">{{consumer}}</span>
					<router-link v-else  class="address_link" :to="`/address/${consumer}`">{{consumer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.update_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--'  || this.judgeCosmos(consumer)">{{consumer}}</span>
					<router-link  v-else :to="`/address/${consumer}`" class="address_link">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column" v-if="provider.length > 0">
					<router-link v-for="(item,index) in provider"
								 :key="index"
								 :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.update_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p v-if="isShowFee">
				 <span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				 <span>{{pricing}}</span>
			 </p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'  || this.judgeCosmos(provider)">{{provider}}</span>
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.disable_service_binding || txType === TX_TYPE.refund_service_deposit">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--' || this.judgeCosmos(provider)">{{provider}}</span>
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.enable_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.recv_packet && prodConfig.txDetail && prodConfig.txDetail.ibc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proof')}}：</span>
				<span>{{proof}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofHeight')}}：</span>
				<span>{{proofHeight}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofPath')}}：</span>
				<span>{{proofPath}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofData')}}：</span>
				<LargeString v-if="proofData" :text="proofData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.module')}}：</span>
				<span>{{module}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.recv_packet && !(prodConfig.txDetail && prodConfig.txDetail.ibc)">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.amount')}}</span>
				<span>{{amount.amount}} {{ (amount.denom || '').toUpperCase()}}</span>
			</p>
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.from')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.to')}}：</span>
				<template>
					<span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
					<router-link v-else :to="`/address/${receiver}`" class="address_link">{{receiver}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- MsgTypeIBCTransfer -->
		<!-- <div v-if="txType === TX_TYPE.transfer">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sourcePort')}}：</span>
				<span>{{sourcePort}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sourceChannel')}}：</span>
				<span>{{sourceChannel}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.token')}}：</span>
                <span>{{ token.amount }} {{ (token.denom || '').toUpperCase() }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sender')}}：</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<span v-else @click="addressRoute(sender)"
                          :class="(sender.startsWith(COSMOS_ADDRESS_PREFIX) || sender.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
                    >{{sender}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.receiver')}}：</span>
                <template>
                    <span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
                    <span v-else @click="addressRoute(receiver)"
                          :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
                    >{{receiver}}</span>
                </template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.timeoutHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(timeoutHeight)" v-if="timeoutHeight" :text="timeoutHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.timeoutTimestamp')}}：</span>
				<span>{{timeoutTimestamp}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.create_identity || txType === TX_TYPE.update_identity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.id')}}：</span>
				<template>
					<span v-if="id === '--'">{{id}}</span>
					<router-link v-else :to="`/identity/${id}`">{{id}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubkey')}}：</span>
				<LargeString  v-if="pubkey" :text="pubkey"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubKeyAlgo')}}：</span>
				<span>{{pubKeyAlgo}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.certificate')}}：</span>
				<LargeString v-if="certificate" :text="certificate"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.credentials')}}：</span>
				<span v-if="credentials === '--'">{{credentials}}</span>
                <span v-else><a :href="credentials" target="_blank">{{credentials}}</a></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.create_client && prodConfig.txDetail && prodConfig.txDetail.ibc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.header')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(header)" v-if="header" :text="header"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.create_client && !(prodConfig.txDetail && prodConfig.txDetail.ibc)">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.upgrade_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<span>{{clientState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusState')}}：</span>
				<span>{{consensusState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUpgradeClient')}}：</span>
				<span>{{proofUpgradeClient}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUpgradeConsensusState')}}：</span>
				<span>{{proofUpgradeConsensusState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.submit_misbehaviour">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.misbehaviour')}}：</span>
				<span>{{misbehaviour}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.connection_open_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterparty')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterparty)" v-if="counterparty" :text="counterparty"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.version')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(version)" v-if="version" :text="version"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.delayPeriod')}}：</span>
				<span>{{delayPeriod}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.connection_open_try">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.previousConnectionId')}}：</span>
				<span>{{previousConnectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(clientState)" v-if="clientState" :text="clientState"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterparty')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterparty)" v-if="counterparty" :text="counterparty"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.delayPeriod')}}：</span>
				<span>{{delayPeriod}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersions')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterpartyVersions)" v-if="counterpartyVersions" :text="counterpartyVersions"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)"  v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<LargeString v-if="proofInit" :text="proofInit"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofClient')}}：</span>
				<LargeString v-if="proofClient" :text="proofClient"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofConsensus')}}：</span>
				<LargeString v-if="proofConsensus" :text="proofConsensus"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(consensusHeight)" v-if="consensusHeight" :text="consensusHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.connection_open_ack">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.connectionId')}}：</span>
				<span>{{connectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyConnectionId')}}：</span>
				<span>{{counterpartyConnectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.version')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(version)" v-if="version" :text="version"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(consensusHeight)" v-if="consensusHeight" :text="consensusHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.connection_open_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.connectionId')}}：</span>
				<span>{{connectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofAck')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofAck)" v-if="proofAck" :text="proofAck"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_open_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_open_try">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.previousChannelId')}}：</span>
				<span>{{previousChannelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channel')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(channel)" v-if="channel" :text="channel"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion')}}：</span>
				<span>{{counterpartyVersion}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<span>{{proofInit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)"  v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_open_ack">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyChannelId')}}：</span>
				<span>{{counterpartyChannelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion')}}：</span>
				<span>{{counterpartyVersion}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_open_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofAck')}}：</span>
				<span>{{proofAck}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'  || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_close_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.channel_close_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<span>{{proofInit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.timeout_packet">
			<p>
					<span>{{$t('ExplorerLang.transactionInformation.ibc.amount')}}</span>
					<span>{{amount.amount}} {{ (amount.denom || '').toUpperCase()}}</span>
			</p>
			<p>
							<span>{{$t('ExplorerLang.transactionInformation.ibc.from')}}：</span>
			<router-link  :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
					</p>
					<p>
							<span>{{$t('ExplorerLang.transactionInformation.ibc.to')}}：</span>
			<router-link  :to="`/address/${receiver}`" class="address_link">{{receiver}}</router-link>
			</p>
	
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv')}}：</span>
				<span>{{nextSequenceRecv}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'  || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.timeout_on_close_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)" v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUnreceived')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofUnreceived)" v-if="proofUnreceived" :text="proofUnreceived"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofClose')}}：</span>
				<span>{{proofClose}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv')}}：</span>
				<span>{{nextSequenceRecv}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'  || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.acknowledge_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.acknowledgement')}}：</span>
				<span>{{acknowledgement}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.token')}}：</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'  || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->

		<div v-if="txType === TX_TYPE.begin_redelegate">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<!-- <p>
				 <span>Shares </span>
				 <span>{{from}}</span>
			 </p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
			<!--<p>
				<span>Shares </span>
				<span>{{from}}</span>
			</p>-->
			<!--<p>
				<span>End Time </span>
				<span>{{from}}</span>
			</p>-->
		</div>
		<div v-if="txType === TX_TYPE.create_validator">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'  || this.judgeCosmos(operatorAddress)">{{operatorAddress}}</span>
<!--					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>-->
					<router-link v-else  :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.selfBonded')}}</span>
				<span>{{selfBond}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.ownerAddress')}}</span>
				<template>
					<span v-if="ownerAddress === '--' || this.judgeCosmos(ownerAddress)">{{ownerAddress}}</span>
<!--					<span v-else @click="addressRoute(ownerAddress)" class="address_link">{{ownerAddress}}</span>-->
					<router-link v-else  :to="`/address/${ownerAddress}`" class="address_link">{{ownerAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.consensusPubkey')}}</span>
				<span>{{consensusPubkey}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}}
					<el-tooltip placement="top" v-if="commissionRate">
  						<div slot="content" >
							<p>Max Rate : {{commissionMaxRate || '--'}}</p>
                            <p>Max Change Rate : {{commissionMaxChangeRate || '--'}}</p>
						</div>
						<i class="iconfont icontishi"></i>
					</el-tooltip>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]' " class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.securityContact')}}</span>
				<span>{{securityContact}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_delegator_reward">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_validator_commission">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.validator')}}</span>
				<template>
					<span v-if="moniker === '--' && validatorAddress === '--' ">{{ moniker || validatorAddress }}</span>
					<span v-else @click="addressRoute(validatorAddress)" class="address_link">{{ moniker || validatorAddress}}</span>
				</template>
			</p>
		</div>
		<!-- <div v-if="txType === TX_TYPE.set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.delegatorAddress')}}</span>
				<template>
					<span v-if="delegatorAddress === '--' || this.judgeCosmos(delegatorAddress)">{{delegatorAddress}}</span>
					<router-link v-else  :to="`/address/${delegatorAddress}`" class="address_link">{{delegatorAddress}}</router-link>
					
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--' || this.judgeCosmos(withdrawAddress)">{{withdrawAddress}}</span>
					<router-link v-else  :to="`/address/${withdrawAddress}`" class="address_link">{{withdrawAddress}}</router-link>
				</template>
			</p>
		</div> -->
		<div v-if="txType === TX_TYPE.begin_unbonding">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_validator">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--' || this.judgeCosmos(operatorAddress)">{{operatorAddress}}</span>
<!--					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>-->
					<router-link v-else  :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
				<!-- <template>
					<span v-if="operMoniker === '--' && operatorAddress === '--' ">{{ operMoniker || operatorAddress }}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{ operMoniker || operatorAddress}}</span>
				</template> -->

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]'" class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.securityContact')}}</span>
				<span>{{securityContact}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.delegate">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<!-- <div v-if="txType === TX_TYPE.fund_community_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.depositor')}}</span>
				<template>
					<span v-if="depositor === '--' || this.judgeCosmos(depositor)">{{depositor}}</span>
					<router-link :to="`/address/${depositor}`" class="address_link">{{depositor}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.swap_order">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.isBuyOrder')}}</span>
				<span>{{isBuyOrder}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.inputAddress')}}</span>
				<template>
					<span v-if="inputAddress === '--' || this.judgeCosmos(inputAddress)">{{inputAddress}}</span>
					<router-link v-else :to="`/address/${inputAddress}`" class="address_link">{{inputAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.Input')}}</span>
				<span>{{input}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.outputAddress')}}</span>
				<template>
					<span v-if="outputAddress === '--' || this.judgeCosmos(outputAddress)">{{outputAddress}}</span>
					<router-link v-else :to="`/address/${outputAddress}`" class="address_link">{{outputAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.output')}}</span>
				<span>{{output}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.add_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.exactIrisAmt')}}</span>
				<span>{{exactIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.maxToken')}}</span>
				<span>{{maxToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.amount')}}</span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minLiquidity')}}</span>
				<span>{{minLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.remove_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.withdrawLiquidity')}}</span>
				<span>{{withdrawLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minIrisAmt')}}</span>
				<span>{{minIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minToken')}}</span>
				<span>{{minToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.amount')}}</span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.unjail">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--' || this.judgeCosmos(operatorAddress)">{{operatorAddress}}</span>
					<router-link v-else :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.create_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}: </span>
				<template>
					<span v-if="serviceName == '--'"> -- </span>
					<router-link v-else :to="`/service?serviceName=${serviceName}`">
						{{serviceName}}
					</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--' || this.judgeCosmos(creator)">{{ creator }}</span>
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
					<router-link v-for="(item,index) in providers"
								 :key="index" :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.aggregateFunc')}}: </span>
				<span>{{ aggregateFunc }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.valueJsonPath')}}: </span>
				<span>{{ valueJsonPath }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.start_feed || txType === TX_TYPE.pause_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--' || this.judgeCosmos(creator)">{{ creator }}</span>
					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.edit_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'  || this.judgeCosmos(creator)">{{ creator }}</span>
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
					<router-link  v-for="(item,index) in providers"
								  :key="index" :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.request_rand">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.blockInterval')}}: </span>
				<span>{{ blockInterval }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}: </span>
				<template>
					<span v-if="consumer === '--' || this.judgeCosmos(consumer)">{{consumer}}</span>
					<router-link  v-else :to="`/address/${consumer}`" class="address_link">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.oracle')}}: </span>
				<span>{{ oracle }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.service_set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--' || this.judgeCosmos(withdrawAddress)">{{withdrawAddress}}</span>
					<router-link  v-else :to="`/address/${withdrawAddress}`" class="address_link">{{withdrawAddress}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.withdraw_earned_fees">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}: </span>
				<template>
					<span v-if="provider === '--' || this.judgeCosmos(provider)">{{provider}}</span>
					<router-link  v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->

		<!-- <div v-if="txType === TX_TYPE.issue_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.minUnit')}}: </span>
				<span>{{ minUnit }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.decimal')}}: </span>
				<span>{{ decimal }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.initialSupply')}}: </span>
				<span>{{ initialSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.edit_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.mint_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--' || this.judgeCosmos(owner)">{{owner}}</span>
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.amount')}}: </span>
				<span>{{ amount }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.to')}}: </span>
				<template>
					<span v-if="to === '--' || this.judgeCosmos(to)">{{to}}</span>
					<router-link  v-else :to="`/address/${to}`" class="address_link">{{to}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.transfer_token_owner">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.originalOwner')}}: </span>
				<template>
					<span v-if="originalOwner === '--' || this.judgeCosmos(originalOwner)">{{originalOwner}}</span>
					<router-link  v-else :to="`/address/${originalOwner}`" class="address_link">{{originalOwner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.newOwner')}}: </span>
				<template>
					<span v-if="newOwner === '--' || this.judgeCosmos(newOwner)">{{newOwner}}</span>
					<router-link  v-else :to="`/address/${newOwner}`" class="address_link">{{newOwner}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.burn_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.sender')}}: </span>
				<template>
					<span v-if="sender === '--'  || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link  v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.amount')}}: </span>
				<span>{{ amount }}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.deposit">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.depositor')}}: </span>
				<template>
					<span v-if="depositor === '--' || this.judgeCosmos(depositor)">{{depositor}}</span>
					<router-link  v-else :to="`/address/${depositor}`" class="address_link">{{depositor}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposalID')}}: </span>
				<template>
					<span v-if="proposalID === '--'">{{proposalID}}</span>
					<router-link :to="`/ProposalsDetail/${proposalID}`">{{proposalID}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.deposit')}}: </span>
				<span>{{deposit}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.vote">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.voter')}}: </span>
				<template>
					<span v-if="voter === '--' || this.judgeCosmos(voter)">{{voter}}</span>
					<router-link  v-else :to="`/address/${voter}`" class="address_link">{{voter}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposalID')}}: </span>
				<template>
					<span v-if="proposalID === '--'">{{proposalID}}</span>
					<router-link :to="`/ProposalsDetail/${proposalID}`">{{proposalID}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.option')}}: </span>
				<span>{{option}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.submit_proposal">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposer')}} : </span>
				<template>
					<span v-if="proposer === '--' || this.judgeCosmos(proposer)">{{proposer}}</span>
					<router-link  v-else :to="`/address/${proposer}`" class="address_link">{{proposer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.title')}}: </span>
				<span>{{title}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.initialDeposit')}}: </span>
				<span>{{initialDeposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.description')}} : </span>
				<span>{{description}}</span>
			</p>
			<p v-if="parameter">
				<span>{{$t('ExplorerLang.transactionInformation.gov.parameter')}} : </span>
				<span>{{parameter}}</span>
			</p>
			<p v-if="name">
				<span>{{$t('ExplorerLang.transactionInformation.gov.name')}} : </span>
				<span>{{name}}</span>
			</p>
			<p v-if="time">
				<span>{{$t('ExplorerLang.transactionInformation.gov.time')}} : </span>
				<span>{{time}}</span>
			</p>
			<p v-if="switchHeight">
				<span>{{$t('ExplorerLang.transactionInformation.gov.switchHeight')}} : </span>
				<span>{{switchHeight}}</span>
			</p>
			<p v-if="info">
				<span>{{$t('ExplorerLang.transactionInformation.gov.info')}} : </span>
				<span>{{info}}</span>
			</p>
			<p v-if="switchHeight">
				<span>{{$t('ExplorerLang.transactionInformation.gov.upgradedClientState')}} : </span>
				<span>{{upgradedClientState}}</span>
			</p>
			<p v-if="recipient">
				<span>{{$t('ExplorerLang.transactionInformation.gov.recipient')}} : </span>
				<span>{{recipient}}</span>
			</p>
			<p v-if="amount">
				<span>{{$t('ExplorerLang.transactionInformation.gov.amount')}} : </span>
				<span>{{amount}}</span>
			</p>
		</div> -->
		<div v-if="txType === TX_TYPE.multisend">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.multisend.inputs')}}: </span>
				<span>
					<p v-for="(input,index) in inputs" :key="index" class="address_container">
<!--						<span @click="addressRoute(input.address)" class="address_link">{{input.address}}</span>-->
						<router-link :to="`/address/${input.address}`" class="address_link">{{input.address}}</router-link>
						<span>{{input.amount}}</span>
					</p>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.multisend.outputs')}}: </span>
				<span>
					<p v-for="(output,index) in outputs" :key="index" class="address_container">
<!--						<span @click="addressRoute(output.address)" class="address_link">{{output.address}}</span>-->
						<router-link :to="`/address/${output.address}`" class="address_link">{{output.address}}</router-link>
						<span>{{output.amount}}</span>
					</p>
				</span>
			</p>
		</div>
		<!-- <div v-if="txType === TX_TYPE.create_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.id')}} : </span>
				<span>{{id || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.amount')}} : </span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.to')}} : </span>
				<template>
					<span v-if="to === '--' || this.judgeCosmos(to)">{{to}}</span>
					<router-link v-else :to="`/address/${to}`" class="address_link">{{to}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.receiverOnOtherChain')}} : </span>
				<span>{{receiverOnOtherChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.senderOnOtherChain')}} : </span>
				<span>{{senderOnOtherChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.timestamp')}} : </span>
				<span>{{timestamp}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.timeLock')}} : </span>
				<span>{{timeLock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.transfer')}} : </span>
				<span>{{transfer}}</span>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.claim_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.id')}} : </span>
				<span>{{id}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.amount')}} : </span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.secret')}} : </span>
				<span>{{secret}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.recipient')}} : </span>
				<template>
					<span v-if="recipient === '--' || this.judgeCosmos(recipient)">{{recipient}}</span>
					<router-link v-else :to="`/address/${recipient}`" class="address_link">{{recipient}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.transfer')}} : </span>
				<span>{{transfer}}</span>
			</p>
		</div> -->
		<div v-if="txType === TX_TYPE.refund_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link class="address_link" :to="`/address/${sender}`"></router-link>
				</template>
			</p>
			<p v-if="hashLock">
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock}}</span>
			</p>
		</div>
		<!--新增TIBC NFT Transfer Out-->
		<!-- <div v-if="txType === TX_TYPE.tibc_nft_transfer">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
				<span>{{idTibc}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
				<span>{{classTibc}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>
			<p>
			<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
				<template>
					<span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
						  :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
				</template>
			</p>

			</div> -->
		<!--新增TIBC NFT Transfer In -->
		<!-- <div v-if="txType === TX_TYPE.tibc_recv_packet">
				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
					<span>{{idTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.urlTibc')}}</span>
					<span>{{urlTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
					<span>{{classTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
					<span>{{sequence}}</span>
				</p>

				<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.port')}}</span>
				<span>{{port}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
					<span>{{sourceChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
					<span>{{destChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
					<span>{{realayChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
					<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
					</template>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
					<template>
					<span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
			  		:class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
					</template>
				</p>
				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
					<template>
						<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
						<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
					</template>
				</p>
		</div> -->
		<!--新增TIBC Acknowledge Packet-->
    <!-- <div v-if="txType === TX_TYPE.tibc_acknowledge_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
				<span>{{idTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.urlTibc')}}</span>
				<span>{{urlTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
				<span>{{classTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
				<span>{{sequence}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.port')}}</span>
				<span>{{port}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
				<span>{{sourceChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
				<template>
					<span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
					  	:class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
						>{{receiver}}</span>
				</template>
		</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.nftStatus')}}</span>
				<span>{{nftStatus}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
		<!--TIBC Clean Packet Out-->
		<!-- <div v-if="txType === TX_TYPE.clean_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
				<span>{{sequence}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
				<span>{{sourceChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
        <!--  TIBC Clean Packet In-->
		<!-- <div v-if="txType === TX_TYPE.recv_clean_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.cleanPacket')}}</span>
				<span>{{cleanPacket}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
        <!--TIBC Update Client-->
		<!-- <div v-if="txType === TX_TYPE.tibc_update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.chainName')}}</span>
				<span>{{chainName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--' || this.judgeCosmos(signer)">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div> -->
        <!--新增Transfer Denom (Denom Transfer)-->
		<!-- <div v-if="txType === TX_TYPE.transfer_denom">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.denomId')}}</span>
				<span>{{denomId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.receiver')}}</span>
				<template>
					<span v-if="receiver === '--' || this.judgeCosmos(receiver)">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
						  :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
				</template>

			</p>

		</div> -->
		<!-- Farm stake/unstake -->
		<!-- <div v-if="txType === TX_TYPE.stake || txType === TX_TYPE.unstake">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolId')}}</span>
				<span>{{poolId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.amount')}}</span>
				<span>{{amount || '--'}}</span>

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.reward')}}</span>
				<span>{{reward}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>

		</div> -->
		<!-- <div v-if="txType === TX_TYPE.harvest">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolId')}}</span>
				<span>{{poolId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.reward')}}</span>
				<span>{{reward}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.sender')}}</span>
				<template>
					<span v-if="sender === '--' || this.judgeCosmos(sender)">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>

		</div> -->
	
		<!-- <div v-if="txType === TX_TYPE.create_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolId')}}</span>
				<span>{{poolId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.lptDenom')}}</span>
				<span>{{lptDenom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.totalReward')}}</span>
				<span>{{totalReward}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.rewardPerBlock')}}</span>
				<span>{{rewardPerBlock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.startHeight')}}</span>
				<span>{{startHeight}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.editable')}}</span>
				<span>{{ editable ? 'Yes': 'No' }}</span>
			</p>
			
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.creator')}}</span>
				<template>
					<span v-if="creator === '--' || this.judgeCosmos(creator)">{{creator}}</span>
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.description')}}</span>
				<span>{{description}}</span>
			</p>
			

		</div> -->
			
		<!-- <div v-if="txType === TX_TYPE.create_pool_with_community_pool">    
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.proposalId')}}</span>
				<span>{{proposalID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.proposer')}}</span>
				<template>
					<span v-if="proposer === '--' || this.judgeCosmos(proposer)">{{proposer}}</span>
					<router-link v-else :to="`/address/${proposer}`" class="address_link">{{proposer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.initialDeposit')}}</span>
				<span>{{initialDeposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.proposalTitle')}}</span>
				<span>{{proposalTitle}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.proposalDescription')}}</span>
				<span>{{proposalDescription}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.lptDenom')}}</span>
				<span>{{lptDenom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.rewardPerBlock')}}</span>
				<span>{{rewardPerBlock}}</span>
			</p>
			
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.fundApplied')}}</span>
				<span>{{fundApplied}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.fundSelfBond')}}</span>
				<span>{{fundSelfBond}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolDescription')}}</span>
				<span>{{poolDescription}}</span>
			</p>			

		</div> -->
		
		<!-- <div v-if="txType === TX_TYPE.destroy_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolId')}}</span>
				<span>{{poolId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.refund')}}</span>
				<span>{{refund}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.creator')}}</span>
				<template>
					<span v-if="creator === '--' || this.judgeCosmos(creator)">{{creator}}</span>
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
		</div> -->
		<!-- <div v-if="txType === TX_TYPE.adjust_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.poolId')}}</span>
				<span>{{poolId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.additionalReward')}}</span>
				<span>{{additionalReward}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.rewardPerBlock')}}</span>
				<span>{{rewardPerBlock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.farm.creator')}}</span>
				<template>
					<span v-if="creator === '--' || this.judgeCosmos(creator)">{{creator}}</span>
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
		</div> -->
<!-- exclude UpdateClient -->
		<p v-if="txType !== TX_TYPE.update_client" :style="{marginTop: '0.26rem'}">
			<span>{{$t('ExplorerLang.transactionInformation.recvPacket.viewSource')}}：</span>
			<LargeString :isShowPre="Tools.isJSON(viewSource)"  v-if="viewSource" :text="viewSource"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
		</p>
	</div>
</template>

<script>
	import {TX_TYPE,voteOptions,formatVoteOptions,EVENTS_TYPE, COSMOS_ADDRESS_PREFIX, IRIS_ADDRESS_PREFIX} from '../../constant';
	import Tools from "../../util/Tools";
	import { TxHelper } from '../../helper/TxHelper';
    import LargeString from './LargeString';
	import { converCoin,addressRoute,getTxType } from "../../helper/IritaHelper";
	import prodConfig from "../../productionConfig";
	import axios from '@/axios';
	import {ExplorerLang} from "../../../lang/EN-Cindy";
	const enLang = require( '../../../lang/EN-Cindy')
	const cnLang = require( '../../../lang/CN-Cindy')
	import TxDetailComponent from './TxDetailComponent.vue'
	export default {
		name: "txMessage",
		components: {LargeString, TxDetailComponent},
		props: {
			msg: {
				type: Object,
				required: true,
			},
			msgIndex: {
				type: Number,
				required: true,
			},
			events: {
				type: Array,
				required: true,
			},
			eventsNew: {
				type: Array,
			},
			monikers: {
				type: Array,
				required: true,
			},
		},
		data () {
			return {
				TX_TYPE_DISPLAY: {},
				isShowFee: prodConfig.fee.isShowFee,
				Tools,
				prodConfig,
				addressRoute,
				TX_TYPE,

				// txHash : '',
				// blockHeight : '',
				// status : '',
				// timestamp : '',
				signer: '',
				// memo : '',
				txType: '',
				from: '',
				to: '',
				tokenId: '',
				denom: '',
				// url : '',
				requestId: '',
				// defineChainId : '',
				serviceName: '',
				// bindChainId : '',
				// requestChainId : '',
				// methodId : '',
				provider: '',
				consumer: '',
				input: '',
				// profiling : '',
				output: '',
				// errorMessage : '',
				// chainId : '',
				author: '',
				authorDescription: '',
				// idlContent : '',
				defineName: '',
				// bindingType : '',
				deposit: '',
				// price : '',
				// averageResponseTime : '',
				// usableTime : '',
				recordArray: [],
				amount: '',
				owner: '',
				symbol : '',
				tokenData: '',
				recipient: '',
				tokenUri: '',
				// dstOwner : '',
				// srcOwner : '',
				// minTable : '',
				schema: '',
				initialSupply : '',
				// minUnit : '',
				// scale : '',
				pricing: '',
				qos: '',
				schemas: '',
				requestContextId: '',
				serviceFeeCap: '',
				timeout: '',
				denomName: '',
				nftName: '',
				packet: '',
				proof: '',
				proofHeight: '',
				proofPath: '',
				proofData: '',
				clientID: '',
				module: '',
				id: '',
				pubkey: '',
				certificate: '',
				credentials: '',
				pubKeyAlgo: '',
				header: '',
				pubkeyShow:false,
				endTime: '',
				shares: '',
				operatorAddress: '',
				moniker: '',
				identity: '',
				selfBond: '',
				ownerAddress: '',
				consensusPubkey: '',
				commissionRate: '',
				website: '',
				details: '',
				delegatorAddress:'',
				withdrawAddress:'',
				depositor:'',

				isBuyOrder: '',
				inputAddress:'',
				outputAddress:'',
				deadline:'',
				sender:'',
				exactIrisAmt:'',
				maxToken:'',
				minLiquidity:'',
				withdrawLiquidity:'',
				minIrisAmt:'',
				keyBaseName:'',
				commissionMaxRate:'',
				commissionMaxChangeRate:'',
				validatorAddress:'',
				feedName:'',
				description:'',
				latestHistory:'',
				creator:'',
				providers:'',
				aggregateFunc:'',
				valueJsonPath:'',
				repeatedFrequency:'',
				responseThreshold:'',
				blockInterval:'',
				oracle:'',
				toMoniker:'',
				fromMoniker:'',
				operMoniker:'',
				minToken:'',
				minSelfDelegation:'',
				securityContact:'',
				LargeStringMinHeight: 100,
				LargeStringLineHeight: 20,
				name:'',
				decimal:'',
				maxSupply:'',
				mintable:'',
				originalOwner:'',
				newOwner:'',
				superMode:'',
				proposalID:'',
				option: '',
				voter: '',
				proposer:'',
				title:'',
				initialDeposit: '',
				parameter:'',
				time: '',
				switchHeight: '',
				info: '',
				upgradedClientState:'',
				minUnit:'',
				options: '',
				clientState:'',
				consensusState: '',
				proofUpgradeClient:'',
				proofUpgradeConsensusState :'',
				misbehaviour:'',
				counterparty:'',
				version:'',
				delayPeriod:'',
				previousConnectionId:'',
				counterpartyVersions:'',
				proofInit:'',
				proofClient:'',
				proofConsensus:'',
				consensusHeight:'',
				connectionId:'',
				counterpartyConnectionId:'',
				proofTry:'',
				proofAck:'',
				portId: '',
				channel:'',
				previousChannelId: '',
				counterpartyVersion: '',
				channelId: '',
				counterpartyChannelId: '',
				proofUnreceived: '',
				nextSequenceRecv: '',
				proofClose:'',
				acknowledgement: '',
				proofAcked: '',
				proofCommitment:'',
				sourcePort: '',
				sourceChannel: '',
				token: '',
				receiver: '',
				timeoutHeight: '',
				timeoutTimestamp: '',
				inputs:[],
				outputs:[],
				receiverOnOtherChain:'',
				senderOnOtherChain:'',
				hashLock:'',
				timestamp:'',
				timeLock:'',
				secret:'',
				transfer: '',
				tokenPair: '',
				viewSource: '',
				amountArray:[],
				COSMOS_ADDRESS_PREFIX,
				IRIS_ADDRESS_PREFIX,
				data:'',
				//新增
				classTibc:'',//tibc新增
				destChain:'',
				realayChain:'',
				idTibc:'',
				urlTibc:'',
				sequence:'',
				port:'',
				sourceChain:'',
				nft_status:'',
				cleanPacket:'',
				chainName:'',
				denomId:'',//nft新增
				mintRestricted:'',
				updateRestricted:'',
				// farm 
				poolId:'',
				reward:'',
				lptDenom:'',
				totalReward:'',
				rewardPerBlock:'',
				startHeight:'',
				editable:'',
				proposalTitle:'',
				proposalDescription:'',
				fundApplied:'',
				fundSelfBond:'',
				poolDescription:'',
				refund:'',
				additionalReward:'',
				detailInfo:[]
			}
		},
		computed: {
			hide () {
				let types = [];
				return !types.some((item) => item == this.txType);
			}
		},
		async mounted () {
			await this.getTxTypeData()
			this.getTransactionInformation();
		},
		methods: {
			async getTxTypeData(){
				try {
					let res = await getTxType()
					this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
				} catch (error) {
					console.log(error)
				}
			},
			async getTransactionInformation () {
				try {
					const message = this.msg;
					if (message) {
						let msg = message.msg;
						this.txType = message.type || '--';
						(this.txType !== TX_TYPE.update_client) && (function (that) {
							let copyMsg = JSON.parse(JSON.stringify(that.msg))
							delete copyMsg.msg.ex
							if(that.eventsNew && that.eventsNew.length > 0) {
								that.eventsNew.forEach((item) => {
									if(item.msg_index === that.msgIndex) {
										that.viewSource = JSON.stringify({
											msgs: copyMsg.msg,
											events: item.events
										})
									}
								})
							} else {
								let copyMsg = JSON.parse(JSON.stringify(that.msg))
								delete copyMsg.msg.ex
								// compatible no eventsNew situation
								that.viewSource = JSON.stringify({
									msgs: copyMsg
								})
							}
						}(this))
						switch (this.txType) {
							case TX_TYPE.mint_nft:
								this.buildMintNft(msg)
								// this.denom = msg.denom || '--';
								// this.tokenId = msg.id || '--';
								// this.denomName = msg.denom_name || '--';
								// this.nftName = msg.name || '--';
								// this.recipient = msg.recipient || '--';
								// this.sender = msg.sender || '--';
								// this.tokenData = msg.data || '--';
								// this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.burn_nft:
								this.buildBurnNft(msg)

								// this.sender = msg.sender || '--';
								// this.denom = msg.denom || '--';
								// this.tokenId = msg.id || '--';
								// this.denomName = msg.denom_name || '--';
								// this.nftName = msg.nft_name || '--';
								break;
							case TX_TYPE.create_record:
								this.recordArray = msg.contents.map(item => {
									return {
										digest: item.digest ? item.digest : '--',
										digest_algo: item.digest_algo ? item.digest_algo : '--',
										uri: item.uri ? item.uri : '--',
										meta: item.meta ? item.meta : "--",
									}
								})
								break;
							case TX_TYPE.define_service:
								this.buildDefineService(msg)
								// this.serviceName = msg.name || '--';
								// this.description = msg.description || '--';
								// this.author = msg.author || '--';
								// this.authorDescription = msg.author_description || '--';
								// this.tags = msg.tags.length && msg.tags || '--';
								// this.schemas = msg.schemas || '--';
								// console.log(this.tags, this.detailInfo[4]['value'])
								break;
							case TX_TYPE.bind_service:
								this.buildBindService(msg)
							
								// this.defineName = msg.service_name || '--';
								// this.provider = msg.provider || '--';
								// if (msg.deposit && msg.deposit.length) {
								// 	let amount = await converCoin(msg.deposit[0]);
								// 	this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}` || '--';
								// }
								// this.deposit = this.deposit || '--'
								// this.owner = msg.owner || '--';
								// this.pricing = msg.pricing || '--';
								// this.qos = msg.qos || '--';
								// this.options = msg.options || '--';
								break;
							case TX_TYPE.send:
								this.buildSend(msg)
								// // this.from = msg.fromaddress || '--';
								// // this.to = msg.toaddress || '--';
								// this.from = msg.from_address || '--';
								// this.to = msg.to_address || '--';
								// this.amountArray = [];
								// if (msg.amount && msg.amount.length > 0) {
								// 	for (const item of msg.amount) {
								// 		const amount = await converCoin(item);
								// 		this.amountArray.push(`${amount.amount} ${amount.denom.toUpperCase()}` || '--')
								// 	}
								// }
								// this.amountArray && this.amountArray.length > 0 ? '' : this.amountArray = ['--']
								break;
							case TX_TYPE.call_service:
								this.buildCallService(msg)
								// this.consumer = msg.consumer || '--';
								// this.input = msg.input || '--';
								// this.provider = msg.providers || '--';
								// this.repeated = msg.repeated || '--';
								// this.repeatedFrequency = msg.repeated_frequency || '--';
								// this.repeatedTotal = msg.repeated_total || '--';
								// if (msg.service_fee_cap && msg.service_fee_cap.length) {
								// 	let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
								// 	this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								// }
								// this.serviceFeeCap = this.serviceFeeCap || '--'
								// this.serviceName = msg.service_name || '--';
								// this.superMode = msg.super_mode || '--';
								// this.timeout = msg.timeout || '--';
								// if(this.eventsNew && this.eventsNew.length > 0) {
								// 	(this.eventsNew || []).forEach((item) => {
								// 		if(item.msg_index === this.msgIndex) {
								// 			(item.events || []).forEach((events) => {
								// 				(events.attributes || []).forEach((attr) => {
								// 					if (attr.key == 'request_context_id') {
								// 						this.requestContextId = attr.value || '--';
								// 					}
								// 				});
								// 			})
								// 		}
								// 	});
								// } else {
								// 	(this.events || []).forEach((item) => {
								// 		(item.attributes || []).forEach((attr) => {
								// 			if (attr.key == 'request_context_id') {
								// 				this.requestContextId = attr.value || '--';
								// 			}
								// 		});
								// 	})
								// }
								break;
							case TX_TYPE.transfer_nft:
								this.buildTransferNft(msg)

								// this.denom = msg.denom || '--';
								// this.tokenId = msg.id || '--';
								// this.denomName = msg.denom_name || '--';
								// this.nftName = msg.name || '--';
								// this.recipient = msg.recipient || '--';
								// this.sender = msg.sender || '--';
								// this.tokenData = msg.data || '--';
								// this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.edit_nft:
								this.buildEditNft(msg)

								// this.denom = msg.denom || '--';
								// this.tokenId = msg.id || '--';
								// this.denomName = msg.denom_name || '--';
								// this.nftName = msg.name || '--';
								// this.sender = msg.sender || '--';
								// this.tokenData = msg.data || '--';
								// this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.issue_denom:
								this.buildIssueDenom(msg)
								// this.denomId=msg.id || '--';
								// this.denomName=msg.name || '--';
								// this.symbol=msg.symbol || '--';
								// this.schema=msg.schema || '--';
								// this.mintRestricted=msg.mint_restricted ;
								// this.updateRestricted=msg.update_restricted ;
								// this.sender= msg.sender;
								break;
							case TX_TYPE.respond_service:
								this.buildRespondService(msg)
								// this.output = msg.output || '--';
								// this.provider = msg.provider || '--';
								// this.requestId = msg.request_id || '--';
								// this.requestContextId = (msg.ex || {}).request_context_id || '--';
								// this.result = msg.result || '--';
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								break;
							case TX_TYPE.pause_request_context:
								this.buildPauseRequestContext(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.requestContextId = msg.request_context_id || '--';
								// this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.start_request_context:
								this.buildPauseRequestContext(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name || (msg.ex || {}).service_name  || '--';
								// this.requestContextId = msg.request_context_id || '--';
								// this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.kill_request_context:
								this.buildPauseRequestContext(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.requestContextId = msg.request_context_id || '--';
								// this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.update_request_context:
								this.buildUpdateRequestContext(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.requestContextId = msg.request_context_id || '--';
								// this.consumer = msg.consumer || '--';
								// this.provider = msg.providers || '--';
								// this.repeatedFrequency = msg.repeated_frequency || '--';
								// this.repeatedTotal = msg.repeated_total || '--';
								// if (msg.service_fee_cap && msg.service_fee_cap.length) {
								// 	let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
								// 	this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								// } else {
								// 	this.serviceFeeCap = '--';
								// }
								// this.timeout = (msg.timeout) ? msg.timeout : '--';
								break;
							case TX_TYPE.update_service_binding:
								this.buildUpdateServiceBinding(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.provider = msg.provider || '--';
								// if (msg.deposit && msg.deposit.length) {
								// 	let amount = await converCoin(msg.deposit[0]);
								// 	this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
								// 	// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								// }
								// this.deposit = this.deposit || '--'
								// this.owner = msg.owner || '--';
								// this.pricing = msg.pricing || '--';
								// this.qos = msg.qos || '--';
								break;
							case TX_TYPE.disable_service_binding:
								this.buildDisableServiceBinding(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.provider = msg.provider || '--';
								// this.owner = msg.owner || '--';
								break;
							case TX_TYPE.enable_service_binding:
								this.buildEnableServiceBinding(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.provider = msg.provider || '--';
								// if (msg.deposit && msg.deposit.length) {
								// 	let amount = await converCoin(msg.deposit[0]);
								// 	this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
								// 	// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								// }
								// this.deposit = this.deposit || '--'
								// this.owner = msg.owner || '--';
								break;
							case TX_TYPE.refund_service_deposit:
								this.buildDisableServiceBinding(msg)
								// // this.serviceName = (msg.ex || {}).service_name || '--';
								// this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								// this.provider = msg.provider || '--';
								// this.owner = msg.owner || '--';
								break;
							case TX_TYPE.recv_packet:
								this.buildRecvPacket(msg, message.type)

								// if(prodConfig.txDetail && prodConfig.txDetail.ibc) {
								// 	this.packet = JSON.stringify(msg.packet || {}) || '--';
								// 	this.proof = msg.proof || '--';
								// 	this.proofHeight = msg.proof_height || '--';
								// 	this.proofPath = JSON.stringify(msg.proof_path || []) || '--';
								// 	this.proofData = msg.proof_data || '--';
								// 	this.clientID = msg.client_id || '--';
								// 	this.module = msg.module || '--';
								// 	this.signer = msg.signer || '--';
								// } else {
								// 	this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								// 	this.proofCommitment = msg.proof_commitment || '--';
								// 	this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// 	this.signer = msg.signer || '--';
								// 	let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,message.type);
								// 	if(msg.packet && msg.packet.data){
								// 		this.sender = msg.packet.data.sender;
								// 		this.receiver = msg.packet.data.receiver;
								// 		this.amount = await converCoin({
								// 			denom:originalDenom || msg.packet.data.denom,
								// 			amount:msg.packet.data.amount,
								// 		});
								// 	}
								// }
								break;
							case TX_TYPE.create_identity:
							case TX_TYPE.update_identity:
								this.buildCreateIdentity(msg)
								
								// let pubkey = msg.pubkey || {};
								// this.id = msg.id || '--';
								// this.pubkey = pubkey.pubkey || '--';
								// this.certificate = msg.certificate || '--';
								// this.credentials = msg.credentials && msg.credentials !== '[do-not-modify]' ? msg.credentials : '--';
								// this.pubKeyAlgo = TxHelper.getPubKeyAlgorithm(pubkey.algorithm) || '--';
								// this.owner = msg.owner || '--';
								break;
							case TX_TYPE.create_client:
								this.buildCreateClient(msg)

								if(prodConfig.txDetail && prodConfig.txDetail.ibc) {
									this.clientID = msg.client_id || '--';
									this.header = JSON.stringify(msg.header || {}) || '--';
									this.signer = msg.signer || '--';
								} else {
									this.clientState = msg.client_state || '--';
									this.consensusState = msg.consensus_state || '--';
									this.signer = msg.signer || '--';
								}
								break;
							case TX_TYPE.update_client:
								this.buildUpdateClient(msg)

								// this.clientID = msg.client_id || '--';
								// this.header = msg.header || '--';
								// this.signer = msg.signer || '--';
								break;
							case TX_TYPE.begin_redelegate:
                                let amount = await converCoin(msg.amount);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								this.from = msg.validator_src_address;
								// this.shares = '需要取值';
								this.to = msg.validator_dst_address;
								// this.endTime = Tools.format2UTC(message.time)
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.create_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg && msg.value && msg.value.amount ) {
									let selfBond = await converCoin(msg.value)
									this.selfBond = `${selfBond.amount} ${selfBond.denom.toUpperCase()}` || '--';
								}else {
									this.selfBond = '--'
								}
								this.ownerAddress = msg.delegator_address || '--';
								this.consensusPubkey = msg.pubkey;
								this.commissionRate = `${Tools.formatPercentage(msg.commission.rate)} %`;
								this.commissionMaxRate = `${Tools.formatPercentage(msg.commission.max_rate)} %`
								this.commissionMaxChangeRate = `${Tools.formatPercentage(msg.commission.max_change_rate)} %`
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.minSelfDelegation = msg.min_self_delegation || '--';
								this.securityContact = msg.description && msg.description.security_contact || '--';
								break;
							case TX_TYPE.withdraw_delegator_reward:
								this.from = msg.validator_address;
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if (events.type == 'withdraw_rewards') {
												(events.attributes || []).forEach((attr) => {
													if (attr.key == 'amount') {
														amount = attr.value || '--';
													}
												});
											}
											if(events.type === 'transfer') {
												(events.attributes || []).forEach((attr) => {
													if (attr.key == 'recipient') {
														this.to = attr.value || '--';
													}
												});
											}
										})
									}
								});
								if(!this.to) {
									this.to = '--';
								}
								if( amount && amount !== '--') {
									amount = await converCoin(amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								} else {
									this.amount = '--'
								}
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.withdraw_validator_commission:
								this.validatorAddress = msg.validator_address
								this.moniker = this.getMoniker(this.validatorAddress,this.monikers)
								break;
							case TX_TYPE.set_withdraw_address:
								this.buildSetWithdrawAddress(msg)

								// this.delegatorAddress = msg.delegator_address;
								// this.withdrawAddress = msg.withdraw_address;
								break;
							case TX_TYPE.begin_unbonding:
								if(msg.amount) {
									let amount = await converCoin(msg.amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								}
								this.amount = this.amount || '--'
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.edit_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg.commission_rate) {
									this.commissionRate = `${Tools.formatPercentage(msg.commission_rate)} %`  || '--';
								} else {
									this.commissionRate = '--'
								}
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.operMoniker = this.getMoniker(this.operatorAddress,this.monikers);
								this.minSelfDelegation = msg.min_self_delegation || '--'
								this.securityContact = msg.description && msg.description.security_contact || '--'
								break;
							case TX_TYPE.delegate:
								this.from = msg.delegator_address;
								this.to = msg.validator_address;
								amount = await converCoin(msg.amount);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}` || '--'
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.fund_community_pool:
								this.buildFundCommunityPool(msg)

								// this.depositor = msg.depositor;
								// let poolAmount = await converCoin(msg.amount[0])
								// this.amount =  `${poolAmount.amount} ${poolAmount.denom.toLocaleUpperCase()}`
								break;
							case TX_TYPE.swap_order:
								this.buildSwapOrder(msg);

							// 	(this.eventsNew || []).forEach((item) => {
							// 		if(item.msg_index === this.msgIndex) {
							// 			(item.events || []).forEach((events) => {
							// 				if(events.type === 'swap') {
							// 					(events.attributes || []).forEach(async attribute => {
							// 						if(attribute.key === 'token_pair') {
							// 							let list = attribute.value.split('-');
							// 							if(list.length > 1){
							// 								let token1 = await converCoin({
							// 									denom:list[0],
							// 									amount:0
							// 								})
							// 								let token2 = await converCoin({
							// 									denom:list[1],
							// 									amount:0
							// 								})
							// 								this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
							// 							}

							// 						}
							// 					})
							// 				}
							// 			})
							// 		}
							// 	});
							// 	this.isBuyOrder = msg.is_buy_order;
							// 	this.inputAddress = msg.input.address || '--';
              //                   if(this.eventsNew && this.eventsNew.length > 0){
              //                       let currentEvents = this.eventsNew.find((e)=>e.msg_index === this.msgIndex);
              //                       if(currentEvents && currentEvents.events.length > 0){
              //                           let transferItem = currentEvents.events.find(e=>e.type === TX_TYPE.transfer);
              //                           if(transferItem && transferItem.attributes && transferItem.attributes.length > 0){
              //                               let amountList = transferItem.attributes.filter((t)=>t.key === 'amount');
              //                               if(amountList && amountList.length > 0){
              //                                   let inputItem = amountList[0],
              //                                       outputItem = amountList[amountList.length - 1]
              //                                   let inputAmount = inputItem.value.match(/\d+/g), inputDenom = '',
              //                                       outputAmount = outputItem.value.match(/\d+/g), outputDenom = '';
              //                                   if(inputAmount && inputAmount.length > 0){
              //                                       inputDenom = inputItem.value.substr(inputAmount[0].length);
              //                                   }
              //                                   if(outputAmount && outputAmount.length > 0){
							// 						outputDenom = outputItem.value.substr(outputAmount[0].length);
              //                                   }
              //                                   let input = await converCoin({
              //                                       denom:inputDenom,
              //                                       amount:inputAmount[0]
							// 					})

              //                                   this.input = `${input.amount} ${input.denom.toLocaleUpperCase()}`;
              //                                   let output = await converCoin({
              //                                       denom:outputDenom,
              //                                       amount:outputAmount[0]
              //                                   })
              //                                   this.output = `${output.amount} ${output.denom.toLocaleUpperCase()}`;
              //                               }
              //                           }
              //                       }
              //                   }else{
              //                       let input = await converCoin({
              //                           denom:msg.input.coin.denom,
              //                           amount:msg.input.coin.amount
              //                       })
              //                       this.input = `${input.amount} ${input.denom.toLocaleUpperCase()}`;
              //                       let output = await converCoin({
              //                           denom:msg.output.coin.denom,
              //                           amount:msg.output.coin.amount
              //                       })
              //                       this.output = `${output.amount} ${output.denom.toLocaleUpperCase()}`;
              //                   }


							// 	this.outputAddress = msg.output.address || '--';
							// 	this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
								break;
							case TX_TYPE.add_liquidity:
								this.buildAddLiquidity(msg);
								// (this.eventsNew || []).forEach((item) => {
								// 	if(item.msg_index === this.msgIndex) {
								// 		(item.events || []).forEach((events) => {
								// 			if(events.type === 'transfer') {
								// 				(events.attributes || []).forEach(async attribute => {
								// 					if(attribute.key === 'amount') {
								// 						if(attribute.value && attribute.value.includes(",")) {
								// 							const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
								// 							const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
								// 							const amountItem1 = await converCoin(amount1);
								// 							const amountItem2 = await converCoin(amount2);
								// 							this.amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`

								// 						}
								// 					}
								// 				})
								// 			}
								// 			if(events.type === 'add_liquidity') {
								// 				(events.attributes || []).forEach(async attribute => {
								// 					if(attribute.key === 'token_pair') {
								// 						let list = attribute.value.split('-');
								// 						if(list.length > 1){
								// 							let token1 = await converCoin({
								// 								denom:list[0],
								// 								amount:0
								// 							})
								// 							let token2 = await converCoin({
								// 								denom:list[1],
								// 								amount:0
								// 							})
								// 							this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
								// 						}
								// 					}
								// 				})
								// 			}
								// 		})
								// 	}
								// });
								// this.sender = msg.sender || '--';
								// // let exactIrisAmt = await converCoin({
								// // 	amount: msg.exact_iris_amt,
								// // 	denom: mainToken.denom
								// // })
								// // this.exactIrisAmt = `${exactIrisAmt.amount} ${exactIrisAmt.denom.toLocaleUpperCase()}`;
								// this.exactIrisAmt = msg.exact_iris_amt;
								// let maxToken = await converCoin(msg.max_token);
								// this.maxToken = `${maxToken.amount} ${maxToken.denom.toLocaleUpperCase()}`;
								// this.minLiquidity = msg.min_liquidity || '--';
								// this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
								break;
							case TX_TYPE.remove_liquidity:
								this.buildRemoveLiquidity(msg);
								// (this.eventsNew || []).forEach((item) => {
								// 	if(item.msg_index === this.msgIndex) {
								// 		(item.events || []).forEach((events) => {
								// 			if(events.type === 'transfer') {
								// 				(events.attributes || []).forEach(async attribute => {
								// 					if(attribute.key === 'amount') {
								// 						if(attribute.value && attribute.value.includes(",")) {
								// 							const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
								// 							const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
								// 							const amountItem1 = await converCoin(amount1);
								// 							const amountItem2 = await converCoin(amount2);
								// 							this.amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`
								// 						}
								// 					}
								// 				})
								// 			}
								// 			if(events.type === 'remove_liquidity') {
								// 				(events.attributes || []).forEach(async attribute => {
								// 					if(attribute.key === 'token_pair') {
								// 						let list = attribute.value.split('-');
								// 						if(list.length > 1){
								// 							let token1 = await converCoin({
								// 								denom:list[0],
								// 								amount:0
								// 							})
								// 							let token2 = await converCoin({
								// 								denom:list[1],
								// 								amount:0
								// 							})
								// 							this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
								// 						}
								// 					}
								// 				})
								// 			}
								// 		})
								// 	}
								// });
								// this.sender = msg.sender || '--';
								// let withdrawLiquidity = await converCoin(msg.withdraw_liquidity)
								// this.withdrawLiquidity = `${withdrawLiquidity.amount} ${withdrawLiquidity.denom.toLocaleUpperCase()}` ;
								// // let minIrisAmt = await converCoin({
								// // 	amount: msg.min_iris_amt,
								// // 	denom: mainToken.denom
								// // })
								// // this.minIrisAmt = `${minIrisAmt.amount} ${minIrisAmt.denom.toLocaleUpperCase()}`;
								// this.minIrisAmt = msg.min_iris_amt;
								// this.minToken = msg.min_token;
								// this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
							break;
							case TX_TYPE.unjail:
								this.buildUnjail(msg);
								// this.operatorAddress = msg.address || '--';
							break;
							case TX_TYPE.create_feed:
								this.buildCreateFeed(msg)
								// this.serviceName = msg.serviceName || msg.service_name || '--';
								// this.feedName = msg.feed_name || '--';
								// this.description = msg.description || '--';
								// this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
								// this.creator = msg.creator || '--';
								// this.providers = msg.providers || '--';
								// this.input = msg.input || '--';
								// if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
								// 	let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
								// 	this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
								// } else {
								// 	this.serviceFeeCap = '--'
								// }
								// this.aggregateFunc = msg.aggregate_func || '--';
								// this.valueJsonPath = msg.value_json_path || '--';
								// this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
								// this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
								// this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;
							case TX_TYPE.start_feed:
								this.buildStartFeed(msg)
								// this.feedName = msg.feed_name || '--';
								// this.creator = msg.creator || '--';
							break;
							case TX_TYPE.pause_feed:
								this.buildStartFeed(msg)
								// this.feedName = msg.feed_name || '--';
								// this.creator = msg.creator || '--';
							break;
							case TX_TYPE.edit_feed:
								this.buildEditFeed(msg)
								// this.feedName = msg.feed_name || '--';
								// this.description = msg.description || '--';
								// this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
								// this.creator = msg.creator || '--';
								// this.providers = msg.providers || '--';
								// if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
								// 	let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
								// 	this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
								// } else {
								// 	this.serviceFeeCap = '--'
								// }
								// this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
								// this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
								// this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;
							case TX_TYPE.request_rand:
								this.buildRequestRand(msg)
								// this.blockInterval = msg.block_interval == 0 ? msg.block_interval : msg.block_interval || '--';
								// this.consumer = msg.consumer || '--';
								// this.oracle = msg.oracle;
								// if (msg.service_fee_cap && msg.service_fee_cap.length) {
								// 	let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
								// 	this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								// } else {
								// 	this.serviceFeeCap = '--';
								// }
							break;
							case TX_TYPE.service_set_withdraw_address:
								this.buildServiceSetWithdrawAddress(msg)
								// this.owner = msg.owner || '--';
								// this.withdrawAddress = msg.withdraw_address || '--';
							break;
							case TX_TYPE.withdraw_earned_fees:
								this.buildWithdrawEarnedFees(msg)
								// this.owner = msg.owner || '--';
								// this.provider = msg.provider || '--';
							break;
							case TX_TYPE.issue_token:
								this.buildIssueToken(msg)
								// this.symbol = msg.symbol || '--';
								// this.name = msg.name || '--';
								// this.decimal = msg.scale || '--';
								// this.initialSupply = msg.initial_supply || '--';
								// this.maxSupply = msg.max_supply || '--';
								// this.mintable = msg.mintable;
								// this.owner = msg.owner || '--';
								// this.minUnit = msg.min_unit || '--';
							break;
							case TX_TYPE.edit_token:
								this.buildEditToken(msg)

								// this.symbol = msg.symbol || '--';
								// this.name = msg.name || '--';
								// this.maxSupply = msg.max_supply !== 0 ? msg.max_supply || '--' : msg.max_supply;
								// this.mintable = msg.mintable;
								// this.owner = msg.owner || '--';
							break;
							case TX_TYPE.mint_token:
								this.buildMintToken(msg)

								// this.symbol = msg.symbol || '--';
								// this.owner = msg.owner || '--';
								// this.amount = msg.amount || '--';
								// this.to = msg.to || '--';
							break;
							case TX_TYPE.transfer_token_owner:
								this.buildTransferTokenOwner(msg)

								// this.symbol = msg.symbol || '--';
								// this.originalOwner = msg.src_owner || '--';
								// this.newOwner = msg.dst_owner || '--';
							break;
							case TX_TYPE.burn_token:
								this.buildBurnToken(msg)
								// this.symbol = msg.symbol || '--';
								// this.sender = msg.sender || '--';
								// this.amount = msg.amount || '--';
							break;
							case TX_TYPE.deposit:
								this.buildDeposit(msg)

								// if(msg.amount && msg.amount.length > 0) {
								// 	let deposit = await converCoin(msg.amount[0]);
								// 	this.deposit = `${deposit.amount} ${deposit.denom.toUpperCase()}`;
								// } else {
								// 	this.deposit = '--'
								// }
								// this.depositor = msg.depositor || '--';
								// this.proposalID = msg.proposal_id || '--';
							break;
							case TX_TYPE.vote:
								this.buildVote(msg)
								// this.voter = msg.voter || '--';
								// this.proposalID = msg.proposal_id || '--';
								// this.option = msg.option ? formatVoteOptions[voteOptions[msg.option]] : '--';
							break;
							case TX_TYPE.submit_proposal:
								this.buildSubmitProposal(msg)

								// this.proposer = msg.proposer || '--';
								// if(msg.initial_deposit && msg.initial_deposit.length > 0) {
								// 	let initialDeposit = await converCoin(msg.initial_deposit[0]);
								// 	this.initialDeposit = `${initialDeposit.amount} ${initialDeposit.denom.toUpperCase()}`;
								// } else {
								// 	this.initialDeposit = '--'
								// }
								// this.title = msg.content && msg.content.title || '--'
								// this.description = msg.content && msg.content.description || '--'
								// this.parameter = msg.content && msg.content.changes
								// let plan = msg.content &&  msg.content.plan
								// if(plan) {
								// 	this.name = plan.name
								// 	let timestamp = plan.time  && Math.floor(new Date(plan.time).getTime() / 1000)
								// 	this.time = timestamp && Tools.formatLocalTime(timestamp)
								// 	this.switchHeight = plan.height ? plan.height : '--'
								// 	if(this.switchHeight && this.switchHeight !== '--') {
								// 		this.time = '--'
								// 	} else {
								// 		this.time = timestamp && Tools.formatLocalTime(timestamp)
								// 	}
								// 	this.info = plan.info
								// 	this.upgradedClientState = plan.upgradedclientstate || '--'
								// }
								// this.recipient = msg.content && msg.content.recipient
								// let n = msg.content && msg.content.amount && msg.content.amount[0]
								// if(n) {
								// 	n = await converCoin(n)
								// 	if(n.amount !== '0') {
								// 		this.amount = `${n.amount} ${n.denom.toUpperCase()}`
								// 	} else {
								// 		this.amount = '--'
								// 	}

								// }
							break;
							case TX_TYPE.upgrade_client:
								this.buildUpgradeClient(msg)

								// this.clientID = msg.client_id || '--';
								// this.clientState = msg.client_state || '--';
								// this.consensusState = msg.consensus_state || '--';
								// this.proofUpgradeClient = msg.proof_upgrade_client || '--';
								// this.proofUpgradeConsensusState = msg.proof_upgrade_consensus_state || '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.submit_misbehaviour:
								this.buildSubmitMisbehaviour(msg)

								// this.clientID = msg.client_id || '--';
								// this.misbehaviour = msg.misbehaviour || '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_init:
								this.buildConnectionOpenInit(msg)

								// this.clientID = msg.client_id || '--';
								// this.counterparty = msg.counterparty ? JSON.stringify(msg.counterparty) : '--';
								// this.version = msg.version ? JSON.stringify(msg.version) : '--';
								// this.delayPeriod = msg.delay_period || '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_try:
								this.buildConnectionOpenTry(msg)

								// this.clientID = msg.client_id || '--';
								// this.previousConnectionId  = msg.previous_connection_id  || '--';
								// this.clientState = msg.client_state || '--';
								// this.counterparty = msg.counterparty ? JSON.stringify(msg.counterparty) : '--';
								// this.delayPeriod = msg.delay_period || '--';
								// this.counterpartyVersions = msg.counterparty_versions ? JSON.stringify(msg.counterparty_versions) : '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.proofInit = msg.proof_init || '--';
								// this.proofClient = msg.proof_client || '--';
								// this.proofConsensus = msg.proof_consensus || '--';
								// this.consensusHeight = msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_ack:
								this.buildConnectionOpenAck(msg)

								// this.connectionId = msg.connection_id || '--';
								// this.counterpartyConnectionId = msg.counterparty_connection_id || '--';
								// this.version = msg.version ? JSON.stringify(msg.version) : '--';
								// this.clientState = msg.client_state  || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.proofTry = msg.proof_try || '--';
								// this.proofClient = msg.proof_client || '--';
								// this.proofConsensus = msg.proof_consensus || '--';
								// this.consensusHeight = msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_confirm:
								this.buildConnectionOpenConfirm(msg)

								// this.connectionId = msg.connection_id || '--';
								// this.proofAck = msg.proof_ack || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_init:
								this.buildChannelOpenInit(msg)
								
								// this.portId = msg.port_id || '--';
								// this.channel = msg.channel ? JSON.stringify(msg.channel) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_try:
								this.buildChannelOpenTry(msg)

								// this.portId = msg.port_id || '--';
								// this.previousChannelId = msg.previous_channel_id || '--';
								// this.channel = msg.channel ? JSON.stringify(msg.channel) : '--';
								// this.counterpartyVersion = msg.counterparty_version || '--';
								// this.proofInit  = msg.proof_init || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_ack:
								this.buildChannelOpenAck(msg)

								// this.portId = msg.port_id || '--';
								// this.channelId = msg.channel_id || '--';
								// this.counterpartyChannelId = msg.counterparty_channel_id || '--',
								// this.counterpartyVersion = msg.counterparty_version || '--',
								// this.proofTry = msg.proof_try || '--',
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_confirm:
								this.buildChannelOpenConfirm(msg)

								// this.portId = msg.port_id || '--';
								// this.channelId = msg.channel_id || '--';
								// this.proofAck = msg.proof_ack || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_close_init:
								this.buildChannelCloseInit(msg)

								// this.portId = msg.port_id || '--';
								// this.channelId = msg.channel_id || '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_close_confirm:
								this.buildChannelCloseConfirm(msg)

								// this.portId = msg.port_id || '--';
								// this.channelId = msg.channel_id || '--';
								// this.proofInit = msg.proof_init || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.timeout_packet:
								this.buildTimeoutPacket(msg, message.type)

								// this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								// this.proofUnreceived = msg.proof_unreceived || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.nextSequenceRecv = msg.next_sequence_recv || '--';
								// this.signer = msg.signer || '--';
								// let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,message.type);
                //                 if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}'){
                //                     this.sender = msg.packet.data.sender;
                //                     this.receiver = msg.packet.data.receiver;
                //                     this.amount = await converCoin({
                //                         denom:originalDenom || msg.packet.data.denom,
                //                         amount:msg.packet.data.amount,
                //                     });
                //                 }
							break;
							case TX_TYPE.timeout_on_close_packet:
								this.buildTimeoutOnClosePacket(msg)

								// this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								// this.proofUnreceived = msg.proof_unreceived || '--';
								// this.proofClose = msg.proof_close || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.nextSequenceRecv = msg.next_sequence_recv || '--';
								// this.signer = msg.signer || '--';
							break;
							case TX_TYPE.acknowledge_packet:
								this.buildAcknowledgePacket(msg, message.type)
								// let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,message.type);
								// if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}' ){
								// 	this.amount = await converCoin({
								// 		denom:originalDenom || msg.packet.data.denom,
								// 		amount:msg.packet.data.amount,
								// 	});
								// }
								// this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								// this.acknowledgement = msg.acknowledgement || '--';
								// this.proofAcked = msg.proof_acked || '--';
								// this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								// this.signer = msg.signer || '--';
								// this.amount = `${this.amount.amount} ${this.amount.denom.toUpperCase()}`
							break;
							// MsgTypeIBCTransfer
							case TX_TYPE.transfer:
								this.buildTransfer(msg)

								// this.sourcePort = msg.source_port || '--';
								// this.sourceChannel = msg.source_channel || '--';
								// this.token = msg.token ?  await converCoin(msg.token) : '--';
								// this.sender = msg.sender || '--';
								// this.receiver = msg.receiver || '--';
								// this.timeoutHeight = msg.timeout_height ? JSON.stringify(msg.timeout_height) : '--';
								// let timeoutTimestamp = msg.timeout_timestamp  && Math.floor(new Date(msg.timeout_timestamp).getTime() / 1000);
								// timeoutTimestamp ? this.timeoutTimestamp = Tools.formatLocalTime(timeoutTimestamp) : this.timeoutTimestamp ='--';
							break;
							case TX_TYPE.multisend:
								this.inputs = [];
								this.outputs = [];
								if(msg && msg.inputs.length >0) {
									for (const input of msg.inputs) {
										let n = input.coins && input.coins[0] && await converCoin(input.coins[0])
										this.inputs.push({
											address: input.address,
											amount: n ? `${n.amount} ${n.denom.toUpperCase()}` : '--'
										})
									}
									for (const output of msg.outputs) {
										let n = output.coins && output.coins[0] && await converCoin(output.coins[0])
										this.outputs.push({
											address: output.address,
											amount: n ? `${n.amount} ${n.denom.toUpperCase()}` : '--'
										})
									}
								}
							break;
							case TX_TYPE.create_htlc:
								this.buildCreateHtlc(msg);

								// (this.eventsNew || []).forEach((item) => {
								// 	if(item.msg_index === this.msgIndex) {
								// 		(item.events || []).forEach((events) => {
								// 			if(events.type === 'create_htlc') {
								// 				(events.attributes || []).forEach(attrs => {
								// 					if(attrs.key === 'id') {
								// 						this.id = attrs.value
								// 					}
								// 				})
								// 			}
								// 		})
								// 	}
								// });
								// this.sender = msg.sender || '--';
								// this.to = msg.to || '--';
								// this.receiverOnOtherChain = msg.receiver_on_other_chain || '--';
								// this.senderOnOtherChain = msg.sender_on_other_chain || '--';
								// if(msg.amount && msg.amount[0]) {
                //   let coin = await converCoin(msg.amount[0])
								// 	this.amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
								// } else {
								// 	this.amount = '--';
								// }
								// this.hashLock = msg.hash_lock || '--';
								// // this.timestamp = msg.timestamp ? `${msg.timestamp} s` : '--';
								// this.timestamp = Tools.formatLocalTime(msg.timestamp) || '--';
								// this.timeLock = msg.time_lock ? `${msg.time_lock} block` : '--';
								// this.transfer = msg.transfer === false ? 'HTLC' : 'HTLT';
								// // let timeLock = msg.time_lock  && Math.floor(new Date(msg.time_lock).getTime() / 1000);
								// // timeLock ? this.timeLock = Tools.getDisplayDate(timeLock) : this.timeLock ='--';
							break;
							case TX_TYPE.claim_htlc:
								this.buildClaimHtlc(msg)

								// let transfer;
                // let attributeMap;
								// (this.eventsNew || []).forEach((item) => {
								// 	if(item.msg_index === this.msgIndex) {
								// 		(item.events || []).forEach((events) => {
								// 				if(events.type === 'claim_htlc') {
								// 					(events.attributes || []).forEach(item => {
								// 						if(item.key === 'transfer')  {
								// 							transfer = item.value
								// 						}
								// 						if(item.key == 'hash_lock') {
								// 							this.hashLock = item.value
								// 						}
								// 					})
								// 				}
								// 			  if(events.type === "transfer") {
                //           attributeMap = Tools.MultKeyValueObjToOneMap(events.attributes)
                //         //   (events.attributes || []).forEach(item => {
								// 				// 		if(item.key === 'amount')  {
                //         //       this.amount = item.value
								// 				// 		}
								// 				// 		if(item.key === 'recipient') {
								// 				// 			this.recipient = item.value
								// 				// 		}
								// 				// })
								// 			}
								// 		})
								// 	}
								// });
								// if(attributeMap && attributeMap.has('amount')){
								//   let coin = await converCoin(attributeMap.get('amount'))
								//   this.amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
								// }
								// if(attributeMap && attributeMap.has('recipient')){
								//   this.recipient = attributeMap.get('recipient')
								// }
								// if(!this.recipient) {
								// 	this.recipient = '--'
								// }
								// this.transfer = transfer === 'false' ? 'HTLC' : 'HTLT';
								// this.sender = msg.sender || '--';
								// this.id = msg.id || '--';
								// this.secret = msg.secret || '--';
							break;
							case TX_TYPE.refund_htlc:
								this.sender = msg.sender || '--';
								this.hashLock = msg.hash_lock || '--';
							break;
							//新增TIBC NFT Transfer Out
							case TX_TYPE.tibc_nft_transfer:
								this.buildTibcNftTransfer(msg)

								// this.classTibc = msg.class  || '--';
								// this.idTibc = msg.id|| '--';
								// this.destChain = msg. dest_chain || '--';
								// this.realayChain = msg.realay_chain || '--';
								// this.sender = msg.sender || '--';
								// this.receiver = msg.receiver || '--';
								break;
							//新增TIBC NFT Transfer In
							case TX_TYPE.tibc_recv_packet:
								this.buildTibcRecvPacket(msg)
								// /*let recvPacketAcknowledgementValue = ''
								// if(this?.eventsNew?.length){
								// 	this.eventsNew.forEach( item => {
								// 		if(item?.msg_index === this.msgIndex && item?.events?.length){
								// 			item.events.forEach( i => {
								// 				if(i.type === EVENTS_TYPE.writeAcknowledgement && i?.attributes?.length){
								// 					i.attributes.forEach( value => {
								// 						if(value?.key === 'packet_ack'){
								// 							recvPacketAcknowledgementValue = value.value
								// 						}
								// 					})
								// 				}
								// 			})
								// 		}
										
								// 	})
								// }*/

								

								// this.idTibc=msg.packet.data.id || '--';
								// this.urlTibc = msg.packet.data.uri || '--';
								// this.classTibc = msg.packet.data.class|| '--'
								// this.sequence = msg.packet.sequence|| '--'
								// this.port = msg.packet.port|| '--'
								// this.sourceChain = msg.packet.source_chain|| '--'
								// this.destChain = msg.packet.destination_chain|| '--'
								// this.realayChain = msg.packet.relay_chain|| '--'
								// this.sender = msg.packet.data.sender|| '--'
								// this.signer = msg.signer|| '--'
								// this.receiver = msg.packet.data.receiver || '--';
								// // const recvPacketAcknowledgementResult = recvPacketAcknowledgementValue ? recvPacketAcknowledgementValue.splice(/[^0-9]/ig,"") : '';
								// // this.nftStatus = recvPacketAcknowledgementResult && Number(acknowledgementResult) === 1  ? this.$t('ExplorerLang.common.success'):this.$t('ExplorerLang.common.failed')

								break;
							//新增TIBC Acknowledge Packet
							case TX_TYPE.tibc_acknowledge_packet:
								this.buildTibcAcknowledgePacket(msg)

								// this.idTibc=msg.packet.data.id || '--';
								// this.urlTibc = msg.packet.data.uri || '--';
								// this.classTibc = msg.packet.data.class|| '--'
								// this.sequence = msg.packet.sequence|| '--'
								// this.port = msg.packet.port|| '--'
								// this.sourceChain = msg.packet.source_chain|| '--'
								// this.destChain = msg.packet.destination_chain|| '--'
								// this.realayChain = msg.packet.relay_chain|| '--'
								// this.sender = msg.packet.data.sender|| '--'
								// this.signer = msg.signer|| '--'
								// this.receiver = msg.packet.data.receiver || '--';
								// let acknowledgementResult = ''
								// if(msg?.acknowledgement){
								// 	acknowledgementResult = msg.acknowledgement.replace(/[^0-9]/ig,"");
								// }
								// this.nftStatus = acknowledgementResult && Number(acknowledgementResult) === 1 ? this.$t('ExplorerLang.common.success'):this.$t('ExplorerLang.common.failed')
								break;
              //新增 TIBC Clean Packet Out
							case TX_TYPE.clean_packet:
								this.buildCleanPacket(msg)

								// this.sequence = msg.clean_packet.sequence|| '--'
								// this.sourceChain = msg.clean_packet.source_chain|| '--'
								// this.destChain = msg.clean_packet.destination_chain|| '--'
								// this.realayChain = msg.clean_packet.relay_chain|| '--'
								// this.signer = msg.signer|| '--'
								break;
							//新增 	TIBC Clean Packet In
							case TX_TYPE.recv_clean_packet:
								this.buildRecvCleanPacket(msg)
								
								// this.cleanPacket= msg.clean_packet|| '--'
								// this.signer = msg.signer|| '--'
								break;
							//新增TIBC Update Client
							case TX_TYPE.tibc_update_client:
								this.buildTibcUpdateClient(msg)

								// this.chainName=msg.chain_name|| '--'
								// this.signer = msg.signer
								break;
              //新增Transfer Denom (Denom Transfer)
							case TX_TYPE.transfer_denom:
								this.buildTransferDenom(msg)

								// this.denomId=msg.id || '--'
								// this.sender= msg.sender|| '--'
								// this.receiver= msg.recipient|| '--'
								break;

							case TX_TYPE.stake:		  
							  this.buildStake(msg)  
								// this.poolId = Tools.formatPoolId(msg.pool_id) || '--';
								// this.amount = await this.handleAmount(msg.amount);
								// this.reward = await this.handleReward(TX_TYPE.stake,'reward');
								// this.sender = msg.sender || '--';
								break;
							case TX_TYPE.unstake:
								this.buildStake(msg)
								// this.poolId = Tools.formatPoolId(msg.pool_id) || '--';
								// this.amount = await this.handleAmount(msg.amount);
								// this.reward = await this.handleReward(TX_TYPE.unstake,'reward');
								// this.sender = msg.sender || '--';
								break;
							case TX_TYPE.harvest:
								this.buildHarvest(msg)
								// this.poolId = Tools.formatPoolId(msg.pool_id) || '--';
								// this.reward = await this.handleReward(TX_TYPE.harvest,'reward');
								// this.sender = msg.sender || '--';
								break;
							case TX_TYPE.create_pool:
								this.buildCreatePool(msg)
								// const createPoolId =  await this.getValueFromEvents(TX_TYPE.create_pool,'pool_id');
								// this.poolId = Tools.formatPoolId(createPoolId) || '--';
								// this.lptDenom = msg.lpt_denom ? msg.lpt_denom.toLocaleUpperCase() : '--';
								// this.totalReward = await this.handleTotalReward(msg.total_reward);
								// this.rewardPerBlock = await this.handleTotalReward(msg.reward_per_block);
							  // this.startHeight = msg.start_height || '--';
								// this.editable = msg.editable;
								// this.creator = msg.creator || '--';
								// this.description = msg.description || '--';		
								break;	
							case TX_TYPE.create_pool_with_community_pool:
								this.buildCreatePoolWithCP(msg)

								// this.proposalID = this.getValueFromEvents(TX_TYPE.create_pool_with_community_pool, 'proposal_id');
								// this.proposer = msg.proposer || '--';
								// this.initialDeposit = await this.handleTotalReward(msg?.initial_deposit);
								// this.proposalTitle = msg?.content?.title || '--';
								// this.proposalDescription = msg?.content?.description || '--';
								// this.lptDenom = msg?.content?.lpt_denom ? msg?.content?.lpt_denom.toLocaleUpperCase() : '--';
								// this.rewardPerBlock = await this.handleTotalReward(msg?.content?.reward_per_block);
								// this.fundApplied = await this.handleTotalReward(msg?.content?.fund_applied);
								// this.fundSelfBond = await this.handleTotalReward(msg?.content?.fund_self_bond);
								// this.poolDescription = msg?.content?.pool_description || '--';
								break;
							case TX_TYPE.destroy_pool:
								this.buildDestroyPool(msg)
								// this.poolId = Tools.formatPoolId(msg.pool_id) || '--';
								// this.refund = await this.handleReward(TX_TYPE.destroy_pool,'amount');
								// this.creator = msg.creator || '--';
								break;
							case TX_TYPE.adjust_pool:
								this.buildAdjustPool(msg)
								// this.poolId = Tools.formatPoolId(msg.pool_id) || '--';
								// this.additionalReward = await this.handleTotalReward(msg.additional_reward);
								// this.rewardPerBlock = await this.handleTotalReward(msg.reward_per_block)
								// this.creator = msg.creator || '--';
								break;
							case TX_TYPE.bsn_ddc:
								this.buildBsnDdc(msg)
								break;
						}
					}
				} catch (e) {
					console.error(e);
				}
			},
			getAmountByAmountStr(str){
				let amount = str.match(/\d+/g), denom = '';
                if(amount && amount.length > 0){
					denom = str.substr(amount[0].length);
					return {
						amount:amount[0],
						denom
					}
                }
			},
			// 处理需打开的网站地址
			openUrl(url) {
				url = url.trim();
				if (url) {
					if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
						url = `http://${url}`;
					}
					window.open(url);
				}
			},
			// 通过identity，拿到keyBaseName数据
			getKeyBaseName(identity) {
				let url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
				if (identity) {
					axios.http(url).then(res => {
						if (res.them && res.them.length > 0 && res.them[0].basics && res.them[0].basics.username) {
							this.keyBaseName = `https://keybase.io/${res.them[0].basics.username}`;
						}else {
							this.keyBaseName = ''
						}
					});
				}
			},
			getMoniker(address,monikers) {
				let moniker
				if(monikers.length) {
					monikers.map( item => {
						moniker = moniker || item[address] || ''
					})
				}
				return moniker
			},
			startStr(url){
				return url.startsWith('www.')
			},
			async handleAmount(amountObj){
				const amountItem = await converCoin(amountObj);
				return `${amountItem.amount} ${amountItem.denom.toUpperCase()}`;
			},
			/**
			 * 从events下匹配数据出来
			 */
			getValueFromEvents(msgType,attrKey){
				const eventItem = this.events ? this.events.find(item => item.type === msgType) : null;
				const attrItem = eventItem && eventItem.attributes.find(item => item.key === attrKey);
				const rewardValue = (attrItem && attrItem.value) ? attrItem.value : '--';
				return rewardValue;
			},
			/**
			 * 从events下匹配数据出来并处理
			 * 入参：msgType=stake attrKey=reward
			 * 返回： 0.12 IRIS 或者 0.12 IRIS、0.33 BSN
			 */
			async handleReward(msgType,attrKey){
				const rewardValue = this.getValueFromEvents(msgType,attrKey);
				if(rewardValue !== '--'){
					if(rewardValue.includes(',')){
						const reward1 = this.getAmountByAmountStr(rewardValue.split(',')[0]);
						const reward2 = this.getAmountByAmountStr(rewardValue.split(',')[1]);
						const rewardItem1 = await converCoin(reward1);
						const rewardItem2 = await converCoin(reward2);
						return `${rewardItem1.amount} ${rewardItem1.denom.toUpperCase()}、 ${rewardItem2.amount} ${rewardItem2.denom.toUpperCase()}`
					}else{
						const reward1 = this.getAmountByAmountStr(rewardValue);
						const rewardItem1 = await converCoin(reward1);
					  return `${rewardItem1.amount} ${rewardItem1.denom.toUpperCase()}`; 
					}
				}else{
					return rewardValue;
				}
			},
			/**
			 * 处理入参结构如下：
			 * @params [array] totalReward
			 * [{"denom": "ubusd","amount": "1"},{"denom": "uiris","amount": "10"}]
			 */
			async handleTotalReward(totalReward){
				const rewardArr = [];
				const len = totalReward ? totalReward.length : 0;
				if(len !== 0){
						const res = await converCoin(totalReward[0]);
						rewardArr.push(`${res.amount} ${res.denom.toLocaleUpperCase()}`)
					if(len === 2){
						const res = await converCoin(totalReward[1]);
						rewardArr.push(`${res.amount} ${res.denom.toLocaleUpperCase()}`)
					}
					return len === 2 ? rewardArr.join('、') : rewardArr[0];
				}else{
					return '--'
				}
			},
			judgeCosmos(addr){
				return addr.startsWith(COSMOS_ADDRESS_PREFIX)
			},
			// bind_service
			async buildBindService(msg){
				let deposit;
				if (msg.deposit && msg.deposit.length) {
					let amount = await converCoin(msg.deposit[0]);
					deposit = `${amount.amount} ${amount.denom.toUpperCase()}` || '--';
				}
				const serviceList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name,
						isService: true,
					}
				]
				const priceList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.pricing'),
						value: msg.pricing,
					}
				]
				const otherList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.qos'),
						value: msg.qos,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.deposit'),
						value: deposit,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.bindService.options'),
						value: msg.options
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value: msg.owner,
						isAddress: true
					}
				]
				this.detailInfo = this.isShowFee ? serviceList.concat(priceList,otherList) : serviceList.concat(otherList)
			},
			// define_service
			buildDefineService(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.name,
						isService: true,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.defineService.description'),
						value: msg.description,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.defineService.author'),
						value: msg.author,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.defineService.authorDescription'),
						value: msg.author_description,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.defineService.tags'),
						value: msg.tags.length && msg.tags || '--',
					}
				]
			},
			// call_service
			async buildCallService(msg){
				let requestContextId = '--',
				 	serviceFeeCap='--';
				if(this.eventsNew && this.eventsNew.length > 0) {
					(this.eventsNew || []).forEach((item) => {
						if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
								(events.attributes || []).forEach((attr) => {
									if (attr.key == 'request_context_id') {
										requestContextId = attr.value || '--';
									}
								});
							})
						}
					});
				} else {
					(this.events || []).forEach((item) => {
							(item.attributes || []).forEach((attr) => {
								if (attr.key == 'request_context_id') {
									requestContextId = attr.value || '--';
								}
							});
					})
				}
				if (msg.service_fee_cap && msg.service_fee_cap.length) {
					let res = await converCoin(msg.service_fee_cap[0]);
					serviceFeeCap = `${res.amount} ${res.denom.toUpperCase()}`;
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.requestContextId'),
						value: requestContextId.toUpperCase()
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.consumer'),
						value: msg.consumer,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.callService.input'),
						value: msg.input,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.providers,
						isAddress: true,
						isMulti: true,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.callService.input'),
						value: msg.input,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.callService.repeated'),
						value: msg.repeated ? '是' : '否',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.repeatedFrequency'),
						value: msg.repeated_frequency
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.repeatedTotal'),
						value: msg.repeated_total
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceFeeCap'),
						value: serviceFeeCap
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.callService.superMode'),
						value: msg.super_mode
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.timeOut'),
						value: msg.timeout
					},
				]
			},
			// response_service
			buildRespondService(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.respondService.requestId'),
						value: (msg.request_id || '--').toUpperCase()
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.requestContextId'),
						value: ((msg.ex || {}).request_context_id || '--').toUpperCase()
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value:  msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.respondService.result'),
						value: msg.result
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.respondService.output'),
						value:  msg.output,
						isSchema: true
					}
				]
			},
			// update_service_binding
			async buildUpdateServiceBinding(msg){
				let deposit;
				if (msg.deposit && msg.deposit.length) {
					let amount = await converCoin(msg.deposit[0]);
					deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
				}
				const serviceList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
				]
				const priceList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.pricing'),
						value: msg.pricing
					}
				]
				const otherList = [
					{
						label: this.$t('ExplorerLang.transactionInformation.qos'),
						value: msg.qos,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.deposit'),
						value: deposit,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value: msg.owner,
						isAddress: true
					},
				]
				this.detailInfo = this.isShowFee ?  serviceList.concat(priceList, otherList) : serviceList.concat(otherList)
			},
			// disable_service_binding 未自测 refund_service_deposit 未自测
			buildDisableServiceBinding(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value:  msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value:  msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value:  msg.owner,
						isAddress: true
					}	
				]
			},
			// enable_service_binding  未自测
			async buildEnableServiceBinding(msg){
				let deposit;
				if (msg.deposit && msg.deposit.length) {
					let amount = await converCoin(msg.deposit[0]);
					deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
				}
				this.detailInfo = [
					{	
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value:  msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.deposit'),
						value: deposit 
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value: msg.owner,
						isAddress: true
					}
				]
			},
			// pause_request_context 未自测 start_request_context 未自测 kill_request_context 未自测
			buildPauseRequestContext(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.requestContextId'),
						value: (msg.request_context_id || '--').toUpperCase()
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.consumer'),
						value:  msg.consumer,
						isAddress: true
					}
				]
			},
			// update_request_context 未自测
			async buildUpdateRequestContext(msg){
				let serviceFeeCap
				if (msg.service_fee_cap && msg.service_fee_cap.length) {
					const res = await converCoin(msg.service_fee_cap[0])
					serviceFeeCap = `${res.amount} ${res.denom.toUpperCase()}`;
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.service_name ||  (msg.ex || {}).service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.requestContextId'),
						value: msg.request_context_id
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.consumer'),
						value: msg.consumer,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.providers,
						isAddress: true,
						isMulti: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.repeatedFrequency'),
						value: msg.repeated_frequency
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.repeatedTotal'),
						value: msg.repeated_total
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceFeeCap'),
						value: serviceFeeCap
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.timeOut'),
						value: msg.timeout
					}
				]
				if(!this.isShowFee){
					// 去掉fee的展示
					this.detailInfo.splice(-2, 1)
				}
			},
			// service_set_withdraw_address 未自测
			buildServiceSetWithdrawAddress(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value: msg.owner,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.withdrawAddress'),
						value: msg.withdraw_address,
						isAddress: true
					},
				]
			},
			// withdraw_earned_fees 未自测
			buildWithdrawEarnedFees(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.provider'),
						value: msg.provider,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.owner'),
						value: msg.owner,
						isAddress: true
					}
				]
			},
			// burn_nft
			buildBurnNft(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.denomId'),
						value: msg.denom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.denomName'),
						value: msg.denom_name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftName'),
						value: msg.nft_name,
					}
				]
			},
			// mint_nft
			buildMintNft(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.denomId'),
						value: msg.denom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.denomName'),
						value: msg.denom_name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftName'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.to'),
						value: msg.recipient,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.uri'),
						value: msg.uri,
						isUri: true
					}
				]
			},
			// edit_nft
			buildEditNft(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.denomId'),
						value: msg.denom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.denomName'),
						value: msg.denom_name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftName'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.data'),
						value: msg.data,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.uri'),
						value: msg.uri,
						isUri: true
					}
				]
			},
			// transfer_nft
			buildTransferNft(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.denomId'),
						value: msg.denom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.denomName'),
						value: msg.denom_name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nftName'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.to'),
						value: msg.recipient,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.data'),
						value: msg.data,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.uri'),
						value: msg.uri,
						isUri: true
					}
				]
			},
			// issue_denom
			buildIssueDenom(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.denomId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.denomName'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.symbol'),
						value: msg.symbol,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.schema'),
						value: msg.schema,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.mintRestricted'),
						value: msg.mint_restricted,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.updateRestricted'),
						value: msg.update_restricted,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.issueDenom.sender'),
						value: msg.sender,
						isAddress: true
					}
				]
			},
			// transfer_denom
			buildTransferDenom(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.denomId'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.nft.receiver'),
						value: msg.recipient,
						isComplexAddr: true
					}
				]
			},
			// issue_token
			buildIssueToken(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.symbol'),
						value: msg.symbol,
						isAsset: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.name'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.minUnit'),
						value: msg.min_unit,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.decimal'),
						value: msg.scale,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.initialSupply'),
						value: msg.max_supply,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.maxSupply'),
						value: msg.update_restricted,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.mintable'),
						value: msg.mintable,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.owner'),
						value: msg.owner,
						isAddress: true
					}
				]
			},
		  // edit_token
			buildEditToken(msg){
				this.detailInfo =  [
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.symbol'),
						value: msg.symbol,
						isAsset: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.name'),
						value: msg.name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.maxSupply'),
						value: msg.max_supply !== 0 ? (msg.max_supply || '--') : msg.max_supply,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.mintable'),
						value: msg.mintable,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.owner'),
						value: msg.owner,
						isAddress: true
					}
				]
			},
			// mint_token
			buildMintToken(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.tokenId'),
						value: msg.symbol,
						isAsset: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.owner'),
						value: msg.owner,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.amount'),
						value: msg.amount,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.to'),
						value: msg.to,
						isAddress: true
					}
				]
			},
			// transfer_token_owner
			buildTransferTokenOwner(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.tokenId'),
						value: msg.symbol,
						isAsset: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.originalOwner'),
						value: msg.src_owner,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.newOwner'),
						value: msg.dst_owner,
						isAddress: true
					}
				]
			},
			// burn_token
			buildBurnToken(msg){
					this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.symbol'),
						value: msg.symbol,
						isAsset: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.asset.amount'),
						value: msg.amount,
					}
				]
			},
			// send
			async buildSend(msg){
				const amountArray = [];
				if (msg.amount && msg.amount.length > 0) {
					for (const item of msg.amount) {
						const amount = await converCoin(item);
						amountArray.push(`${amount.amount} ${amount.denom.toUpperCase()}` || '--')
					}
				}
				amountArray && amountArray.length > 0 ? '' : amountArray.push('--')

				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.send.amount'),
						value: amountArray,
						isArray: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.from_address,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.to'),
						value: msg.to_address,
						isAddress: true
					}
				]
			},
			// transfer 
			async buildTransfer(msg){
				const token = msg.token ?  await converCoin(msg.token) : '--';
				const timeoutHeight = msg.timeout_height ? JSON.stringify(msg.timeout_height) : '--';
				let timeoutTimestamp = msg.timeout_timestamp  && Math.floor(new Date(msg.timeout_timestamp).getTime() / 1000);
				timeoutTimestamp = timeoutTimestamp ? Tools.formatLocalTime(timeoutTimestamp) : '--';
			
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.sourcePort'),
						value: msg.source_port,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.sourceChannel'),
						value: msg.source_channel,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.token'),
						value: token.amount + ' ' + (token.denom || '').toUpperCase(),
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.sender'),
						value: msg.sender,
						isComplexAddr: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.receiver'),
						value: msg.receiver,
						isComplexAddr: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.timeoutHeight'),
						value: timeoutHeight,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.timeoutTimestamp'),
						value: timeoutTimestamp,
					}
				]
			},
			// recv_packet
			async buildRecvPacket(msg, type){
				let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet, type);
				let amount,sender,receiver;
				if(msg.packet && msg.packet.data){
					sender = msg.packet.data.sender;
					receiver = msg.packet.data.receiver;
					amount = await converCoin({
						denom:originalDenom || msg.packet.data.denom,
						amount:msg.packet.data.amount,
					});
				}

				let infoList = []
				if(prodConfig.txDetail && prodConfig.txDetail.ibc){
					infoList = [
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.proof'),
							value: msg.proof,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.proofHeight'),
							value: msg.proof_height,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.proofPath'),
							value: JSON.stringify(msg.proof_path || []) || '--',
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.proofData'),
							value: msg.proof_data || '--',
							isSchema: true
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.clientID'),
							value: msg.client_id,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.recvPacket.module'),
							value: msg.module,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.signer'),
							value: msg.signer,
							isAddress: true
						}
					]
				}else{
					infoList = [
						{
							label: this.$t('ExplorerLang.transactionInformation.ibc.amount'),
							value: amount.amount + ' ' + (amount.denom || '').toUpperCase(),
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.ibc.from'),
							value: sender,
							isAddress: true,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.ibc.to'),
							value: receiver,
							isAddress: true,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
							value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
							isSchema: true,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.signer'),
							value: msg.signer,
							isAddress: true
						}
					]
				}
				this.detailInfo = infoList
			},

			// timeout_packet
			async buildTimeoutPacket(msg, type){
				let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,type);
				let sender, receiver, amount;
				if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}'){
						sender = msg.packet.data.sender;
						receiver = msg.packet.data.receiver;
						amount = await converCoin({
								denom:originalDenom || msg.packet.data.denom,
								amount:msg.packet.data.amount,
						});
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.amount'),
						value: amount.amount + ' ' + (amount.denom || '').toUpperCase(),
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.from'),
						value: sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.to'),
						value: receiver,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv'),
						value: msg.next_sequence_recv,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// create_identity/update_identity -未自测
			buildCreateIdentity(msg){
				const credentials = msg.credentials && msg.credentials !== '[do-not-modify]' ? msg.credentials : '--';
				const pubKeyAlgo = TxHelper.getPubKeyAlgorithm(pubkey.algorithm) || '--';
				this.detailInfo = [
					{
							label: this.$t('ExplorerLang.transactionInformation.identity.id'),
							value: msg.id,
							isIdentity: true
					},
					{
							label: this.$t('ExplorerLang.transactionInformation.identity.pubkey'),
							value: msg?.pubkey?.pubkey || '--',
							isSchema: true
					},
					{
							label: this.$t('ExplorerLang.transactionInformation.identity.pubKeyAlgo'),
							value: pubKeyAlgo,
							isIdentity: true
					},
					{
							label: this.$t('ExplorerLang.transactionInformation.identity.certificate'),
							value: msg.certificate,
							isSchema: true
					},
					{
							label: this.$t('ExplorerLang.transactionInformation.identity.credentials'),
							value: credentials,
							isLink: true
					},
					{
							label: this.$t('ExplorerLang.transactionInformation.owner'),
							value: msg.owner,
							isAddress: true
					}
				]
			},

			//create_client
			buildCreateClient(msg){
				if(prodConfig.txDetail && prodConfig.txDetail.ibc){
					this.detailInfo = [
						{
							label: this.$t('ExplorerLang.transactionInformation.client.clientID'),
							value: msg.client_id,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.client.header'),
							value: JSON.stringify(msg.header || {}) || '--',
							isSchema: true
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.signer'),
							value: msg.signer,
							isAddress: true
						}
					]
				}else{
					this.detailInfo = [
						{
							label: this.$t('ExplorerLang.transactionInformation.signer'),
							value: msg.signer,
							isAddress: true
						}
					]
				}
				
			}, 

			// update_client
			buildUpdateClient(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.client.clientID'),
						value: msg.client_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// upgrade_client 未自测
			buildUpgradeClient(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientID'),
						value: msg.client_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientState'),
						value: msg.client_state,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.consensusState'),
						value: msg.consensus_state,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofUpgradeClient'),
						value: msg.proof_upgrade_client,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofUpgradeConsensusState'),
						value: msg.proof_upgrade_consensus_state,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},
			
			//submit_misbehaviour 未自测
			buildSubmitMisbehaviour(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientID'),
						value: msg.client_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.misbehaviour'),
						value: msg.misbehaviour
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},
			
			// connection_open_init
			buildConnectionOpenInit(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientID'),
						value: msg.client_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterparty'),
						value: msg.counterparty ? JSON.stringify(msg.counterparty) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.version'),
						value: msg.version ? JSON.stringify(msg.version) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.delayPeriod'),
						value: msg.delay_period,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// connection_open_try
			buildConnectionOpenTry(msg){
				this.detailInfo =  [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientID'),
						value: msg.client_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.previousConnectionId'),
						value: msg.previous_connection_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.clientState'),
						value: msg.client_state,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterparty'),
						value: msg.counterparty ? JSON.stringify(msg.counterparty) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.delayPeriod'),
						value: msg.delay_period,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterpartyVersions'),
						value: msg.counterparty_versions ? JSON.stringify(msg.counterparty_versions) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofInit'),
						value: msg.proof_init,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofClient'),
						value: msg.proof_client,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofConsensus'),
						value: msg.proof_consensus,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.consensusHeight'),
						value: msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// connection_open_ack
			buildConnectionOpenAck(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.connectionId'),
						value: msg.connection_id,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterpartyConnectionId'),
						value: msg.counterparty_connection_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.version'),
						value: msg.version ? JSON.stringify(msg.version) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.consensusHeight'),
						value: msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// connection_open_confirm
			buildConnectionOpenConfirm(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.connectionId'),
						value: msg.connection_id,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofAck'),
						value: msg.proof_ack,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value:  msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// channel_open_init 
			buildChannelOpenInit(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// channel_open_try
			buildChannelOpenTry(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.previousChannelId'),
						value: msg.previous_channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.channel'),
						value: msg.channel ? JSON.stringify(msg.channel) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion'),
						value: msg.counterparty_version,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofInit'),
						value: msg.proof_init,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// channel_open_ack
			buildChannelOpenAck(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.channelId'),
						value: msg.channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterpartyChannelId'),
						value: msg.counterparty_channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion'),
						value: msg.counterparty_version,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// channel_open_confirm
			buildChannelOpenConfirm(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.channelId'),
						value: msg.channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofAck'),
						value: msg.proof_ack,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			}, 

			// channel_close_init -未自测
			buildChannelCloseInit(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.channelId'),
						value: msg.channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// channel_close_confirm -未自测
			buildChannelCloseConfirm(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.portId'),
						value: msg.port_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.channelId'),
						value: msg.channel_id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofInit'),
						value: msg.proof_init,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// timeout_on_close_packet -未自测
			buildTimeoutOnClosePacket(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.packet'),
						value: msg.packet ? JSON.stringify(msg.packet) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofUnreceived'),
						value: msg.proof_unreceived,
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofClose'),
						value: msg.proof_close,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv'),
						value: msg.next_sequence_recv,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// acknowledge_packet
			async buildAcknowledgePacket(msg, type){
				let amount;
				let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet, type);
				if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}' ){
					amount = await converCoin({
							denom: originalDenom || msg.packet.data.denom,
							amount:msg.packet.data.amount,
					});
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.acknowledgement'),
						value: msg.acknowledgement,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.token'),
						value: `${amount.amount} ${amount.denom.toUpperCase()}`,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.ibc.proofHeight'),
						value: msg.proof_height ? JSON.stringify(msg.proof_height) : '--',
						isSchema: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},
			// deposit
			async buildDeposit(msg){
				let deposit;
				if(msg.amount && msg.amount.length > 0) {
					let amount = await converCoin(msg.amount[0]);
					deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
				} else {
					deposit = '--'
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.depositor'),
						value: msg.depositor,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.proposalID'),
						value: msg.proposal_id,
						isProposal: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.deposit'),
						value: deposit,
					}
				]
				
			},

			// vote
			buildVote(msg){
				const option = msg.option ? formatVoteOptions[voteOptions[msg.option]] : '--';
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.voter'),
						value: msg.voter,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.proposalID'),
						value: msg.proposal_id,
						isProposal: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.option'),
						value: option
					}
			
				]
			},

			// submit_proposal 
			async buildSubmitProposal(msg){	
				let initialDeposit;
				if(msg.initial_deposit && msg.initial_deposit.length > 0) {
					let res  = await converCoin(msg.initial_deposit[0]);
					initialDeposit = `${res.amount} ${res.denom.toUpperCase()}`;
				} else {
					initialDeposit = '--'
				}
				let plan = msg.content &&  msg.content.plan
				let name, switchHeight, time, info, upgradedClientState, amount;
				if(plan) {
					name = plan.name
					let timestamp = plan.time  && Math.floor(new Date(plan.time).getTime() / 1000)
					switchHeight = plan.height ? plan.height : '--'
					if(switchHeight && switchHeight !== '--') {
						time = '--'
					} else {
						time = timestamp && Tools.formatLocalTime(timestamp)
					}
					info = plan.info
					upgradedClientState = plan.upgradedclientstate || '--'
				}
				let n = msg.content && msg.content.amount && msg.content.amount[0]
				if(n) {
					n = await converCoin(n)
					if(n.amount !== '0') {
						amount = `${n.amount} ${n.denom.toUpperCase()}`
					} else {
						amount = '--'
					}
				}

				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.proposer'),
						value: msg.proposer,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.title'),
						value: msg.content && msg.content.title || '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.initialDeposit'),
						value: initialDeposit,
					}, 
					{
						label: this.$t('ExplorerLang.transactionInformation.gov.description'),
						value: msg.content && msg.content.description || '--',
					}
				]
				if(msg.content && msg.content.changes){
					this.detailInfo.push(
						{
							label: this.$t('ExplorerLang.transactionInformation.gov.parameter'),
							value: msg.content && msg.content.changes,
					})
				}
				if(name){
					this.detailInfo.push(
						{
							label: this.$t('ExplorerLang.transactionInformation.gov.name'),
							value: name,
						}
					)
				}
				if(time){
					this.detailInfo.push(
						{
						label: this.$t('ExplorerLang.transactionInformation.gov.time'),
						value: time,
						})
				}
				if(switchHeight){
					this.detailInfo.push(
						{
							label: this.$t('ExplorerLang.transactionInformation.gov.switchHeight'),
							value: switchHeight,
					})
				}
				if(info){
					this.detailInfo.push({
						label: this.$t('ExplorerLang.transactionInformation.gov.info'),
						value: info,
					})
				}
				if(upgradedClientState){
					this.detailInfo.push({
						label: this.$t('ExplorerLang.transactionInformation.gov.upgradedClientState'),
						value: upgradedClientState,
					})
				}
				if(msg.content && msg.content.recipient){
					this.detailInfo.push({
						label: this.$t('ExplorerLang.transactionInformation.gov.recipient'),
						value: msg.content && msg.content.recipient,
					})
				}
				if(amount){
					this.detailInfo.push({
						label: this.$t('ExplorerLang.transactionInformation.gov.amount'),
						value: amount,
					})
				}	
			},

			// create_htlc
			async buildCreateHtlc(msg){
				let id, amount;
				(this.eventsNew || []).forEach((item) => {
					if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
								if(events.type === 'create_htlc') {
									(events.attributes || []).forEach(attrs => {
										if(attrs.key === 'id') {
											id = attrs.value
										}
									})
								}
							})
						}
				});

				if(msg.amount && msg.amount[0]) {
					let coin = await converCoin(msg.amount[0])
					amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
				} else {
					amount = '--';
				}

				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.id'),
						value: id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.amount'),
						value: amount,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.to'),
						value: msg.to,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.receiverOnOtherChain'),
						value: msg.receiver_on_other_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.senderOnOtherChain'),
						value: msg.sender_on_other_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.hashLock'),
						value: msg.hash_lock,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.timestamp'),
						value: Tools.formatLocalTime(msg.timestamp) || '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.timeLock'),
						value: msg.time_lock ? `${msg.time_lock} block` : '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.transfer'),
						value: msg.transfer === false ? 'HTLC' : 'HTLT',
					},
				]
			},

			// claim_htlc 
			async buildClaimHtlc(msg){
					let transfer, attributeMap, hashLock, amount, recipient;
					(this.eventsNew || []).forEach((item) => {
						if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
									if(events.type === 'claim_htlc') {
										(events.attributes || []).forEach(item => {
											if(item.key === 'transfer')  {
												transfer = item.value
											}
											if(item.key == 'hash_lock') {
												hashLock = item.value
											}
										})
									}
									if(events.type === "transfer") {
										attributeMap = Tools.MultKeyValueObjToOneMap(events.attributes)
									}
							})
						}
					});
					if(attributeMap && attributeMap.has('amount')){
						let coin = await converCoin(attributeMap.get('amount'))
						amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
					}
					if(attributeMap && attributeMap.has('recipient')){
						recipient = attributeMap.get('recipient')
					}
					this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.id'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.amount'),
						value: amount,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.secret'),
						value: msg.secret,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.recipient'),
						value: recipient,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.hashLock'),
						value: hashLock,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.htlc.transfer'),
						value: transfer === 'false' ? 'HTLC' : 'HTLT',
					},
				]
			},

			// tibc_nft_transfer
			buildTibcNftTransfer(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.idTibc'),
						value: msg.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.classTibc'),
						value: msg.class,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.destChain'),
						value: msg.dest_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.realayChain'),
						value: msg.realay_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.receiver'),
						value: msg.receiver,
						isComplexAddr: true
					}
				]
			},
			
			// tibc_recv_packet
			buildTibcRecvPacket(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.idTibc'),
						value: msg?.packet?.data?.id,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.urlTibc'),
						value: msg?.packet?.data?.uri,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.classTibc'),
						value: msg?.packet?.data?.class,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sequence'),
						value: msg?.packet?.sequence,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.port'),
						value: msg?.packet?.port,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sourceChain'),
						value: msg?.packet?.source_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.destChain'),
						value: msg?.packet?.destination_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.realayChain'),
						value: msg?.packet?.relay_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sender'),
						value: msg?.packet?.data?.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.receiver'),
						value: msg?.packet?.data?.receiver,
						isComplexAddr: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// tibc_acknowledge_packet -未自测
			buildTibcAcknowledgePacket(msg){
				let acknowledgementResult = ''
				if(msg?.acknowledgement){
					acknowledgementResult = msg.acknowledgement.replace(/[^0-9]/ig,"");
				}
				const nftStatus = acknowledgementResult && Number(acknowledgementResult) === 1 ? this.$t('ExplorerLang.common.success'):this.$t('ExplorerLang.common.failed')
				
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.idTibc'),
						value: msg.packet.data.id
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.urlTibc'),
						value: msg.packet.data.uri,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.classTibc'),
						value: msg.packet.data.class,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sequence'),
						value: msg.packet.sequence,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.port'),
						value: msg.packet.port,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sourceChain'),
						value: msg.packet.source_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.destChain'),
						value: msg.packet.destination_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.realayChain'),
						value: msg.packet.relay_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sender'),
						value: msg.packet.data.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.receiver'),
						value: msg.packet.data.receiver,
						isComplexAddr: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.nftStatus'),
						value: nftStatus,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.signer'),
						value: msg.signer,
						isAddress: true
					},
				]
			},

			// clean_packet 
			buildCleanPacket(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sequence'),
						value: msg.clean_packet.sequence
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.sourceChain'),
						value: msg.clean_packet.source_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.destChain'),
						value: msg.clean_packet.destination_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.realayChain'),
						value: msg.clean_packet.relay_chain,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// recv_clean_packet - 未自测
			buildRecvCleanPacket(msg){
		    this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.cleanPacket'),
						value: msg.clean_packet
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// tibc_update_client
			buildTibcUpdateClient(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.chainName'),
						value: msg.chain_name
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.tibc.signer'),
						value: msg.signer,
						isAddress: true
					}
				]
			},

			// set_withdraw_address 
			buildSetWithdrawAddress(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.staking.delegatorAddress'),
						value: msg.delegator_address,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.staking.withdrawAddress'),
						value: msg.withdraw_address,
						isAddress: true
					}
				]
			},

			// fund_community_pool
			async buildFundCommunityPool(msg){					
				let poolAmount = await converCoin(msg.amount[0])
				const amount =  `${poolAmount.amount} ${poolAmount.denom.toLocaleUpperCase()}`
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.staking.amount'),
						value: amount
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.staking.from'),
						value: msg.depositor,
						isAddress: true
					}
				]
			},

			// swap_order
			async buildSwapOrder(msg){
				let input,output,tokenPair;
					(this.eventsNew || []).forEach((item) => {
						if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
								if(events.type === 'swap') {
									(events.attributes || []).forEach(async attribute => {
										if(attribute.key === 'token_pair') {
											let list = attribute.value.split('-');
											if(list.length > 1){
												let token1 = await converCoin({
													denom:list[0],
													amount:0
												})
												let token2 = await converCoin({
													denom:list[1],
													amount:0
												})
												tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
											}

										}
									})
								}
							})
						}
					});
					if(this.eventsNew && this.eventsNew.length > 0){
							let currentEvents = this.eventsNew.find((e)=>e.msg_index === this.msgIndex);
							if(currentEvents && currentEvents.events.length > 0){
									let transferItem = currentEvents.events.find(e=>e.type === TX_TYPE.transfer);
									if(transferItem && transferItem.attributes && transferItem.attributes.length > 0){
											let amountList = transferItem.attributes.filter((t)=>t.key === 'amount');
											if(amountList && amountList.length > 0){
													let inputItem = amountList[0],
															outputItem = amountList[amountList.length - 1]
													let inputAmount = inputItem.value.match(/\d+/g), inputDenom = '',
															outputAmount = outputItem.value.match(/\d+/g), outputDenom = '';
													if(inputAmount && inputAmount.length > 0){
															inputDenom = inputItem.value.substr(inputAmount[0].length);
													}
													if(outputAmount && outputAmount.length > 0){
														outputDenom = outputItem.value.substr(outputAmount[0].length);
													}
													let inputRes = await converCoin({
															denom:inputDenom,
															amount:inputAmount[0]})

													input = `${inputRes.amount} ${inputRes.denom.toLocaleUpperCase()}`;
													let outputRes = await converCoin({
															denom:outputDenom,
															amount:outputAmount[0]
													})
													output = `${outputRes.amount} ${outputRes.denom.toLocaleUpperCase()}`;
											}
									}
							}
					}else{
						let inputRes = await converCoin({
								denom:msg.input.coin.denom,
								amount:msg.input.coin.amount
						})
						input = `${inputRes.amount} ${inputRes.denom.toLocaleUpperCase()}`;
						let outputRes = await converCoin({
								denom:msg.output.coin.denom,
								amount:msg.output.coin.amount
						})
						output = `${outputRes.amount} ${outputRes.denom.toLocaleUpperCase()}`;
					}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.isBuyOrder'),
						value: msg.is_buy_order
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.inputAddress'),
						value: msg.input.address ,
						isAddress: true
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.Input'),
						value: input,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.outputAddress'),
						value: msg.output.address,
						isAddress: true
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.output'),
						value: output,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.tokenPair'),
						value: tokenPair,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.deadline'),
						value: Tools.formatLocalTime(msg.deadline)  || '--',
					},
				]
			},

			// remove_liquidity
			async buildRemoveLiquidity(msg){
				let amount, tokenPair, withdrawLiquidity;
				(this.eventsNew || []).forEach((item) => {
						if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
								if(events.type === 'transfer') {
									(events.attributes || []).forEach(async attribute => {
										if(attribute.key === 'amount') {
											if(attribute.value && attribute.value.includes(",")) {
												const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
												const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
												const amountItem1 = await converCoin(amount1);
												const amountItem2 = await converCoin(amount2);
												amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`
											  this.detailInfo[4].value = amount;
											}
										}
									})
								}
								if(events.type === 'remove_liquidity') {
									(events.attributes || []).forEach(async attribute => {
										if(attribute.key === 'token_pair') {
											let list = attribute.value.split('-');
											if(list.length > 1){
												let token1 = await converCoin({
													denom:list[0],
													amount:0
												})
												let token2 = await converCoin({
													denom:list[1],
													amount:0
												})
												tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
												this.detailInfo[5].value = tokenPair;
											}
										}
									})
								}
							})
						}
				});
				let res = await converCoin(msg.withdraw_liquidity)
				withdrawLiquidity = `${res.amount} ${res.denom.toLocaleUpperCase()}`;
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.sender'),
						value: msg.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.withdrawLiquidity'),
						value: withdrawLiquidity ,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.minIrisAmt'),
						value: msg.min_iris_amt,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.minToken'),
						value: msg.min_token,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.amount'),
						value: amount,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.tokenPair'),
						value: tokenPair,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.coinswap.deadline'),
						value: Tools.formatLocalTime(msg.deadline)  || '--',
					},
				]
			},

			// add_liquidity
			async buildAddLiquidity(msg){
				let amount, tokenPair, maxToken;
				(this.eventsNew || []).forEach((item) => {
					if(item.msg_index === this.msgIndex) {
							(item.events || []).forEach((events) => {
								if(events.type === 'transfer') {
									(events.attributes || []).forEach(async attribute => {
										if(attribute.key === 'amount') {
											if(attribute.value && attribute.value.includes(",")) {
												const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
												const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
												const amountItem1 = await converCoin(amount1);
												const amountItem2 = await converCoin(amount2);
												amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`
												this.detailInfo[3].value = amount;
											}
										}
									})
								}
								if(events.type === 'add_liquidity') {
									(events.attributes || []).forEach(async attribute => {
										if(attribute.key === 'token_pair') {
											let list = attribute.value.split('-');
											if(list.length > 1){
												let token1 = await converCoin({
													denom:list[0],
													amount:0
												})
												let token2 = await converCoin({
													denom:list[1],
													amount:0
												})
												tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
												this.detailInfo[5].value = tokenPair;
											}
										}
									})
								}
							})
						}
					});
					let res = await converCoin(msg.max_token);
					maxToken = `${res.amount} ${res.denom.toLocaleUpperCase()}`;
				
					this.detailInfo = [
						{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.sender'),
							value: msg.sender,
							isAddress: true
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.exactIrisAmt'),
							value: msg.exact_iris_amt ,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.maxToken'),
							value: maxToken,
						},
						{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.amount'),
							value: amount,
						},
						
							{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.minLiquidity'),
							value: msg.min_liquidity,
						},
							{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.tokenPair'),
							value: tokenPair,
						},
							{
							label: this.$t('ExplorerLang.transactionInformation.coinswap.deadline'),
							value: Tools.formatLocalTime(msg.deadline)  || '--',
						},
					]
			},

			// unjail 
			buildUnjail(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.staking.operatorAddress'),
						value: msg.address,
						isAddress: true
					}
				]
			},

			// create_feed -未自测
			async buildCreateFeed(msg){
				let serviceFeeCap;
				if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
					let res = await converCoin(msg.service_fee_cap[0])
					serviceFeeCap = `${res.amount} ${res.denom.toLocaleUpperCase()}`;
				} else {
					serviceFeeCap = '--'
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceName'),
						value: msg.serviceName || msg.service_name,
						isService: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.feedName'),
						value: msg.feed_name ,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.description'),
						value: msg.description,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.latestHistory'),
						value: msg.latest_history !== 0 ?  msg.latest_history || '--' : '--',
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.creator'),
						value: msg.creator,
						isAddress: true
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.providers'),
						value: msg.providers,
						isAddress: true,
						isMulti: true
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.serviceFeeCap'),
						value: serviceFeeCap,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.aggregateFunc'),
						value: msg.aggregate_func,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.valueJsonPath'),
						value: msg.value_json_path,
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.repeatedFrequency'),
						value: msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--',
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.oracle.responseThreshold'),
						value: msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--',
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.timeOut'),
						value: msg.timeout !== 0 ? msg.timeout || '--' : '--',
					}
				]
			},

			// start_feed pause_feed
			buildStartFeed(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.feedName'),
						value: msg.feed_name
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.creator'),
						value: msg.creator ,
						isComplexAddr: true
					}
				]
			},

			// edit_feed
			async buildEditFeed(msg){
				let serviceFeeCap;
				if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
					let res = await converCoin(msg.service_fee_cap[0])
					serviceFeeCap = `${res.amount} ${res.denom.toLocaleUpperCase()}`;
				} else {
					serviceFeeCap = '--'
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.feedName'),
						value: msg.feed_name
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.description'),
						value: msg.description,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.latestHistory'),
						value: msg.latest_history !== 0 ?  msg.latest_history || '--' : '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.creator'),
						value: msg.creator,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.providers'),
						value: msg.providers,
						isAddress: true,
						isMulti: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceFeeCap'),
						value: serviceFeeCap,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.repeatedFrequency'),
						value: msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.oracle.responseThreshold'),
						value: msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--',
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.timeOut'),
						value:  msg.timeout !== 0 ? msg.timeout || '--' : '--',
					},
					
				]
			},

			// request_rand
			async buildRequestRand(msg){
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.random.blockInterval'),
						value: msg.block_interval == 0 ? msg.block_interval : msg.block_interval || '--'
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.consumer'),
						value: msg.consumer ,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.random.oracle'),
						value: msg.oracle ,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.serviceFeeCap'),
						value: '',
					}
				]
				if (msg.service_fee_cap && msg.service_fee_cap.length) {
					const res = await converCoin(msg.service_fee_cap[0]);
					const serviceFeeCap = `${res.amount} ${res.denom.toUpperCase()}`;
					this.detailInfo[3].value = serviceFeeCap;
				}
			},

			// stake
			async buildStake(msg){
				const amount = await this.handleAmount(msg.amount);
				const reward = await this.handleReward(TX_TYPE.stake,'reward');
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolId'),
						value: Tools.formatPoolId(msg.pool_id)
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.amount'),
						value: amount,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.reward'),
						value: reward,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.sender'),
						value: msg.sender,
						isAddress: true
					}
				]
			},

			// harvest
			async buildHarvest(msg){
			  const reward = await this.handleReward(TX_TYPE.harvest,'reward');
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolId'),
						value: Tools.formatPoolId(msg.pool_id)
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.reward'),
						value: reward,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.sender'),
						value: msg.sender,
						isAddress: true
					}
				]
			},

			// create_pool
			async buildCreatePool(msg){
				const createPoolId =  await this.getValueFromEvents(TX_TYPE.create_pool,'pool_id');
				const poolId = Tools.formatPoolId(createPoolId) || '--';
				const lptDenom = msg.lpt_denom ? msg.lpt_denom.toLocaleUpperCase() : '--';
				const totalReward = await this.handleTotalReward(msg.total_reward);
				const rewardPerBlock = await this.handleTotalReward(msg.reward_per_block);
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolId'),
						value: poolId
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.lptDenom'),
						value: lptDenom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.totalReward'),
						value: totalReward,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.rewardPerBlock'),
						value: rewardPerBlock,
					},	
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.startHeight'),
						value: msg.start_height,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.editable'),
						value: msg.editable ? 'Yes': 'No' ,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.creator'),
						value: msg.creator,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.description'),
						value: msg.description,
					}

				]
			},

			// create_pool_with_community_pool
			async buildCreatePoolWithCP(msg){
				const proposalID = this.getValueFromEvents(TX_TYPE.create_pool_with_community_pool, 'proposal_id');
				const initialDeposit = await this.handleTotalReward(msg?.initial_deposit);
				const lptDenom = msg?.content?.lpt_denom ? msg?.content?.lpt_denom.toLocaleUpperCase() : '--';
				const rewardPerBlock = await this.handleTotalReward(msg?.content?.reward_per_block);
				const fundApplied = await this.handleTotalReward(msg?.content?.fund_applied);
				const fundSelfBond = await this.handleTotalReward(msg?.content?.fund_self_bond);
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.proposalId'),
						value: proposalID
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.proposer'),
						value: msg.proposer,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.initialDeposit'),
						value: initialDeposit,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.proposalTitle'),
						value: msg?.content?.title,
					},	
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.proposalDescription'),
						value: msg?.content?.description,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.lptDenom'),
						value: lptDenom,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.rewardPerBlock'),
						value: rewardPerBlock,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.fundApplied'),
						value: fundApplied,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.fundSelfBond'),
						value: fundSelfBond,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolDescription'),
						value:  msg?.content?.pool_description,
					},
				]
			},

			// destroy_pool
			async buildDestroyPool(msg){
				const poolId = Tools.formatPoolId(msg.pool_id) || '--';
				const refund = await this.handleReward(TX_TYPE.destroy_pool,'amount');
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolId'),
						value: poolId
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.refund'),
						value: refund,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.creator'),
						value: msg.creator,
						isAddress: true
					}
				]
			},

			// adjust_pool
			async buildAdjustPool(msg){
				const poolId = Tools.formatPoolId(msg.pool_id) || '--';
				const additionalReward = await this.handleTotalReward(msg.additional_reward);
				const rewardPerBlock = await this.handleTotalReward(msg.reward_per_block)
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.poolId'),
						value: poolId
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.additionalReward'),
						value: additionalReward,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.rewardPerBlock'),
						value: rewardPerBlock,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.farm.creator'),
						value: msg.creator,
						isAddress: true
					}
				]
			},
			setMethodLang(ddcMethod){
				if(ddcMethod){
					if(prodConfig?.lang === 'EN'){
						return enLang?.ExplorerLang?.smartContract[ddcMethod]
					}
					if(prodConfig?.lang === 'CN'){
						return cnLang?.ExplorerLang?.smartContract[ddcMethod]
					}
					return ddcMethod
				}
			},
			// BSN-DDC 合约
			buildBsnDdc(msg){
				let ddcId,ddcUri;
				if(Array.isArray(msg?.ex?.ddc_id)){
					ddcId = msg.ex.ddc_id.join('、')
				}else{
					ddcId = msg.ex.ddc_id || '--'
				}
				if(Array.isArray(msg?.ex?.ddc_uri)){
					// 去掉空值
					ddcUri = msg.ex.ddc_uri.filter(item => item)
					ddcUri = ddcUri.length === 0 ? ['--']: ddcUri
				}else{
					ddcUri = (msg.ex.ddc_uri &&  [msg.ex.ddc_uri]) || ['--']
				}
				this.detailInfo = [
					{
						label: this.$t('ExplorerLang.table.contractAddress'),
						value: msg.ex.contract_address
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.bsnddc.contractType'),
						value: msg.ex.ddc_type,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.bsnddc.contractMethod'),
						value: this.setMethodLang(msg.ex.ddc_method),
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.bsnddc.ddcId'),
						value: ddcId,
						isSchema: true
					},
						{
						label: this.$t('ExplorerLang.transactionInformation.bsnddc.ddcName'),
						value: msg.ex.ddc_name,
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.from'),
						value: msg.ex.sender,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.to'),
						value: msg.ex.recipient,
						isAddress: true
					},
					{
						label: this.$t('ExplorerLang.transactionInformation.uri'),
						value: ddcUri,
						isMultiLink: true
					}
				]
			}
			

		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}

	.tx_message_content {
		padding: 0.36rem 0;
		background: $bg_white_c;
		font-size: $s14;
		.record_container {
			display: flex;
			width: 100%;
			max-width: 12rem;

			.record_content {
				width: 100%;

				.record_name {
					color: $t_second_c;
					min-width: 1.5rem;
					text-align: left;
					font-size: $s14;
				}

				.record_list_content {
					flex: 1;
					width: 100%;
					box-sizing: border-box;
					background: $bg_cancel_c;
					border-radius: 0.05rem;

					::v-deep .el-table {
						background: $bg_cancel_c;

						tr {
							background: $bg_cancel_c;

							th {
								background: $bg_cancel_c;
							}
						}
					}
				}
			}
		}
		.address_container{
			flex-wrap: wrap;
			a{
				margin-right: 0.1rem;
			}
			span{
				
				font-weight: normal !important;
				color: #171D44 !important;
			}
		}

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
			}

			span:nth-of-type(2) {
				text-align: left;
				font-size: $s14;
				color: $t_first_c;
				word-break: break-all;
				line-height: 0.20rem;
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
			}
			a {
				word-break: break-all;
			}
		}

		p:last-child {
			margin-bottom: 0;
		}

		.website_link{
			font-size:  $s14;
			line-height: 0.16rem;
			color:$theme_c !important;
			cursor: pointer;
		}

	}

	@media screen and (max-width: 768px) {
		.tx_message_content {

			.record_container {

				.record_content {

					.record_name {
						min-width: 1.4rem;
					}

					.record_list_content {

						::v-deep .el-table {

							tr {

								th {

								}
							}
						}
					}
				}
			}

			p {
				span:nth-of-type(1) {
					min-width: 1.4rem;
				}

				span:nth-of-type(2) {

				}
			}

			p:last-child {

			}
		}
	}
</style>
