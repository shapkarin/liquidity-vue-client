<template>
	<div class="sp-component sp-box sp-shadow">
		<form>
			<select v-model="pair.from.denom" @change="onSelectDenom" name="from">
				<option v-for="(denom, index) in getAllDenomsNames" v-bind:key="'denom1_' + index">{{ denom }}</option>
			</select>
			<input v-on:keyup="onDenomAmount" v-model="pair.from.amount" type="number" step="0.0001" max="10000" min="0"  />

			<br />
			<select :disabled="!pair.from.denom" v-model="pair.to.denom" @change="onSelectDenom" name="to" selected="1">
				<option v-for="(denom, index) in denoms" v-bind:key="'denom2_' + index">{{ denom }}</option>
			</select>
			<input v-on:keyup="onDenomAmount" v-model="pair.to.amount" ype="number" step="0.0001" max="10000" min="0" />
			<br />
			<br />
			fee based on "pool fee rate": <b>{{ fee }} {{ pair.from.denom }}</b>
			<br />
			<br />
			<SpButton type="secondary" :disabled="!client && connected" @click="swap()">Swap</SpButton>
		</form>

		<h3>All exchange directions in all pools:</h3><br />
		<div v-for="pair in allPairsNames" v-bind:key="pair" class="pair_stat">
			<b>{{ pair.denom }}</b> swap_to: <b>{{ pair.changeTo }}</b>
		</div>
		<br />
		<br />
		<SpTransferList :address="address" :refresh="true" v-if="client" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
	name: 'Swap',
	data() {
		return {
			pair: {
				from: {
					denom: '',
					amount: 0
				},
				to: {
					denom: '',
					amount: 0
				}
			},
			denoms: [],
			fee: 0
		}
	},
	async mounted() {
		if(!this.poolsAreLoaded) {
			await this.QueryLiquidityPools({})
		}
		await this.loadDenoms()
	},
	methods: {
			async swap() {
				const { pool_id } = this.getPairInfo(this.pair.from.denom, this.pair.to.denom)
				await this.QueryParams({ params: { pool_id } })
				const {
					params: { swap_fee_rate, max_order_amount_ratio },
				} = this.getParams({ params: { pool_id } })

				this.fee = String((this.pair.from.amount * swap_fee_rate) / 2)

				this.sendMsgSwapWithinBatch({
					value: {
						/** address of swap requester */
						swapRequesterAddress: this.address,
						/** id of the target pool */
						poolId: 1,
						/** id of swap type. Must match the value in the pool. (default 1: InstantSwap, requesting instant swap)*/
						swapTypeId: 1,
						/** offer sdk.coin for the swap request, must match the denom in the pool. */
						offerCoin: this.pair.from,
						/** denom of demand coin to be exchanged on the swap request, must match the denom in the pool. */
						demandCoinDenom: this.pair.to.denom,
						/** half of offer coin amount * params.swap_fee_rate for reservation to pay fees */
						offerCoinFee: {
							denom: this.pair.from.denom,
							amount: this.fee
						},
						/**
						* limit order price for the order, the price is the exchange ratio of X/Y where X is the amount of the first coin and
						* Y is the amount of the second coin when their denoms are sorted alphabetically
						*/
						// orderPrice: '2',
						orderPrice: this.pair.to.amount
					},
					// fee: [{ denom: 'token', amount: '20000' }, { amount: '20000', denom: 'stake' }],
				})
			},
			...mapActions('tendermint.liquidity.v1beta1', ['QueryLiquidityPools', 'QueryParams', 'sendMsgSwapWithinBatch']),
			...mapActions('swap', ['loadDenoms']),
			onSelectDenom({ target: { name, value }}) {
				// show only allowed denoms
				if(name === 'from') {
					this.denoms = this.getDenomPairs(value).map(({ changeTo }) => changeTo)
				}

				/*
					like in uniswap: reset denom if use tries to change denom to same denom.
					not used, because user just can't select two same denoms, look at the code abouve
				*/
				const mapRevers = { to: 'from', from: 'to' }

				if(this.pair.from.denom === this.pair.to.denom) {
					this.pair[mapRevers[name]].denom = ''
				}
			},
			onDenomAmount({ target: { value, min, max }}) {
				// console.log({ min, max })
			}
	},
	computed: {
		...mapGetters('tendermint.liquidity.v1beta1', ['getParams', 'getLiquidityPools']),
		...mapGetters('common/wallet', ['client', 'address']),
		...mapGetters('tendermint.liquidity.v1beta1', ['getLiquidityPools']),
		...mapGetters('swap', ['getAllDenomsNames', 'getAllPossiblePairs', 'getDenomPairs', 'getAllDenoms', 'getPairInfo', ]),
		...mapGetters('cosmos.bank.v1beta1', ['getAllBalances']),
		// todo
		connected () {
			return true
		},
		poolsAreLoaded() {
			 // todo: optional chaining
			return this.getLiquidityPools().pools ? this.getLiquidityPools().pools.length > 0 : false
		},
		// just to test
		allPairsNames() {
			return this.getAllPossiblePairs.map(({ denom, changeTo }) => ({ denom, changeTo }))
		},
		balances: function () {
			return (
				this.getAllBalances({
					params: { address: this.address },
				}).balances
			)
		},
	},
})
</script>

<style>
/* just to test */
select {
	width: 300px;
}
.pair_stat {
	margin-bottom: 5px;
}
</style>
