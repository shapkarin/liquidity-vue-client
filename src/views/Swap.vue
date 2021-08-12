<template>
	<div>
		<Swap />
		<ExchangeDirections :pairs="allPairsNames" v-if="loggedIn" />
		<SpTransferList :address="address" :refresh="true" v-if="loggedIn" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

import Swap from '../components/Swap'
import ExchangeDirections from '../components/ExchangeDirections'

export default defineComponent({
	name: 'SwapPage',
	components: {
		Swap,
		ExchangeDirections,
	},
	async mounted() {
		if (!this.poolsAreLoaded) {
			await this.QueryLiquidityPools({})
		}
	},
	methods: {
		...mapActions('tendermint.liquidity.v1beta1', ['QueryLiquidityPools']),
	},
	computed: {
		...mapGetters('common/wallet', ['loggedIn', 'address']),
		...mapGetters('tendermint.liquidity.v1beta1', ['getLiquidityPools']),
		...mapGetters('swap', ['getAllPossiblePairs']),
		poolsAreLoaded() {
			// todo: optional chaining
			return this.getLiquidityPools().pools ? this.getLiquidityPools().pools.length > 0 : false
		},
		allPairsNames() {
			return this.getAllPossiblePairs.map(({ denom, changeTo }) => ({ denom, changeTo }))
		},
	},
})
</script>
