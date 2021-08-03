<template>
	<div class="status">
		<div>RPC <SpStatusRPC /> API <SpStatusAPI /> WS <SpStatusWS /></div>
		<div>API Tendermint (rpcNode): {{ apiTendermint }}</div>
		<div>API Cosmos: {{ apiCosmos }}</div>
		<div>API WS: {{ apiWS }}</div>
		<div>Chain Name: {{ chainName }}</div>
		<div v-if="address">Wallet's address: {{ address }}</div>
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
	name: 'Status',
	computed: {
		...mapGetters('common/env', ['chainName', 'apiTendermint', 'apiCosmos', 'apiWS']),
		...mapGetters('common/wallet', ['address', 'lastWallet']),
	},
})
</script>

<style scoped>
/* that's not a production styles. just some */
.status > div {
	margin-bottom: 5px;
	display: flex;
}
.status > div > div {
	margin: 0 5px;
}
</style>
