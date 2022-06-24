<template>
	<div class="address_send_receive_tx_container">
		<div class="address_send_receive_tx_wrap">
			<div class="address_send_tx_content" v-if="isFlShowSendTxCount">
				<span class="address_send_tx_label">{{ $t('ExplorerLang.addressDetail.sendTx') }}</span>
				<span class="address_send_tx_value">{{ sendTxCount }}</span>
			</div>
			<div class="address_receive_tx_content" v-if="isFlShowReceiveTxCount">
				<div class="address_receive_tx_wrap" :class="isFlShowSendTxCount ? 'show_cross_line' : ''">
					<span class="address_receive_tx_label">{{ $t('ExplorerLang.addressDetail.receiptTx') }}</span>
					<span class="address_send_tx_value">{{ receiveTxCount }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {getTxCountByAddress} from '@/service/api'
import prodConfig from '../../productionConfig';

export default {
	name: "AddressSendAndReceiveTx",
	data() {
		return {
			sendTxCount: 0,
			receiveTxCount: 0,
			isFlShowSendTxCount: prodConfig?.isShowSendTxCount,
			isFlShowReceiveTxCount: prodConfig?.isShowReceiveTxCount
		}
	},
	created() {
		this.getSendTxAndReceiveTxByAddress()
	},
	methods: {
		async getSendTxAndReceiveTxByAddress() {
			const address = this.$route.params.param
			if (address) {
				const sendTxParams = 198;
				const receiveParams = 199;
				let params = '';
				if (prodConfig?.isShowSendTxCount) {
					params = `${sendTxParams}`
				}
				if (prodConfig?.isShowReceiveTxCount) {
					params = `${receiveParams}`
				}
				if (prodConfig?.isShowSendTxCount && prodConfig?.isShowReceiveTxCount) {
					params = `${sendTxParams},${receiveParams}`
				}
				const txCount = await getTxCountByAddress(params, address).catch(error => {
					console.error(error)
				})
				if (txCount?.send_txs_count) {
					this.sendTxCount = txCount.send_txs_count
				}
				if (txCount?.recv_txs_count) {
					this.receiveTxCount = txCount.recv_txs_count
				}
			}
			
		}
	}
}
</script>

<style scoped lang="scss">
.address_send_receive_tx_container {
	.address_send_receive_tx_wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		padding: 0.05rem 0.08rem;
		background: rgba(249, 249, 249, 1);
		border-radius: 0.06rem;
		@media (max-width: 500px) {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.address_send_tx_content {
			.address_send_tx_label {
				font-size: 0.16rem;
				font-weight: 400;
				color: #171D44;
				line-height: 0.22rem;
				margin-right: 0.06rem;
			}
			
		}
		
		.address_receive_tx_content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.show_cross_line {
				&::before {
					content: ' ';
					width: 0.01rem;
					height: 0.16rem;
					background: rgba(227, 227, 227, 1);
					margin: 0 0.11rem;
					display: block;
					@media (max-width: 500px) {
						display: none;
					}
				}
			}
			
			.address_receive_tx_wrap {
				display: flex;
				flex-direction: row;
				align-items: center;
				
				.address_receive_tx_label {
					font-size: 0.16rem;
					font-weight: 400;
					color: #171D44;
					line-height: 0.22rem;
					margin: 0 0.06rem 0 0;
				}
			}
		}
	}
}

</style>