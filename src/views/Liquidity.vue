<template>
	<div>
		<Suspense>
			<template #default>
				<AddLiquidityPool v-if="loggedIn" />
			</template>
			<template #fallback>
				<div>Loading...</div>
			</template>
		</Suspense>
		<div class="sp-component">
			<div class="sp-component-title">
				<h3 id="liquidity_pools">Liquidity pools</h3>
			</div>
			<div class="sp-box sp-shadow">
				<div v-for="pool in pools" v-bind:key="'pool_' + pool.id">
					Pairs: <b>{{ pool.reserve_coin_denoms[0] }}</b> / <b>{{ pool.reserve_coin_denoms[1] }}</b> <br />
					pool_coin_denom: {{ pool.pool_coin_denom }} <br />
					reserve_account_address: {{ pool.reserve_account_address }} <br />
					id: {{ pool.id }}, type_id: {{ pool.type_id }} <br /><br />
					<SpButton type="secondary" :disabled="!loggedIn">Trade</SpButton> <br />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import AddLiquidityPool from '../components/AddLiquidityPool'

export default defineComponent({
	name: 'Liquidity',
	components: {
		AddLiquidityPool,
	},
	computed: {
		...mapGetters('tendermint.liquidity.v1beta1', ['getLiquidityPools', 'getLiquidityPool', 'getParams', 'getPoolBatchSwapMsg']),
		...mapGetters('common/env', ['apiTendermint', 'apiCosmos', 'apiWS']),
		...mapGetters('common/wallet', ['loggedIn']),
		pools() {
			return this.getLiquidityPools().pools // todo: optional chaining
		},
	},
	async mounted() {
		await this.QueryLiquidityPools({})
	},
	methods: {
		...mapActions('tendermint.liquidity.v1beta1', ['QueryLiquidityPools', 'QueryParams']),
	},
})
</script>
