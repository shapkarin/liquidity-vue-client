<template>
	<div class="sp-component sp-box sp-shadow">
		<div>
			payCoinPoolAmount: {{ payCoinPoolAmount }}<br />
			receiveCoinPoolAmount: {{ receiveCoinPoolAmount }}<br />
		</div>
		<form>
			<select v-model="pair.from.denom" @change="onSelectDenom" name="from">
				<option v-for="(denom, index) in getAllDenomsNames" v-bind:key="'denom1_' + index">{{ denom }}</option>
			</select>
			<input v-on:keyup="onDenomAmount" v-model="pair.from.amount" type="number" step="0.0001" max="10000" min="0" />

			<br />
			<select :disabled="!pair.from.denom" v-model="pair.to.denom" @change="onSelectDenom" name="to" selected="1">
				<option v-for="(denom, index) in denoms" v-bind:key="'denom2_' + index">{{ denom }}</option>
			</select>
			<input v-on:keyup="onDenomAmount" v-model="pair.to.amount" ype="number" step="0.0001" max="10000" min="0" />
			<br />
			<br />
			<SpButton type="secondary" :disabled="!loggedIn" @click="swap()">Swap</SpButton>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

// import useBalances from '../shared/useBalances'
import useSwap from '../shared/useSwap'

export default defineComponent({
	name: 'Swap',
	data() {
		return {
			pair: {
				from: {
					denom: '',
					amount: 0,
				},
				to: {
					denom: '',
					amount: 0,
				},
			},
			denoms: [],
			fee: 0,
			payCoinPoolAmount: '',
			receiveCoinPoolAmount: '',
			receiveCoinAmount: '',
		}
	},
	setup() {
		const { calculateSlippage, getSwapPrice, getPayCoinAmount, getReceiveCoinAmount, getPrecision, getPrecisedAmount } = useSwap()

		return {
			calculateSlippage,
			// getSwapPrice,
			getPayCoinAmount,
			getReceiveCoinAmount,
			getPrecision,
			getPrecisedAmount,
		}
	},
	methods: {
		// test() {
		// 	this.getReceiveCoinAmount(this.pair.from, )
		// },
		async swap() {
			// console.log('getReceiveCoinAmount', this.getReceiveCoinAmount)
			const pool_id = await this.getPairPoolId(this.pair.from.denom, this.pair.to.denom)
			await this.QueryLiquidityPool({ params: { pool_id } })
			const {
				pool: { reserve_account_address },
			} = this.getLiquidityPool({ params: { pool_id } })

			await this.QueryParams({ params: { pool_id } })
			const {
				params: { swap_fee_rate, max_order_amount_ratio },
			} = this.getParams({ params: { pool_id } })

			// todo: remove
			const { balances: PoolBalances } = await this.QueryAllBalances({
				params: { address: reserve_account_address },
				options: { all: true, subscribe: false },
			})

			const { amount: payCoinPoolAmount } = PoolBalances.find(({ denom }) => denom === this.pair.from.denom)
			const { amount: receiveCoinPoolAmount } = PoolBalances.find(({ denom }) => denom === this.pair.to.denom)

			this.payCoinPoolAmount = payCoinPoolAmount
			this.receiveCoinPoolAmount = receiveCoinPoolAmount

			const receiveCoinAmount = this.getReceiveCoinAmount(
				{ base_denom: this.pair.from.denom, amount: this.pair.from.amount },
				payCoinPoolAmount,
				receiveCoinPoolAmount,
			)
			console.log({ receiveCoinAmount })
			this.receiveCoinAmount = receiveCoinAmount

			const orderPrice = String(this.getSwapPrice(this.pair.from.amount, payCoinPoolAmount, receiveCoinPoolAmount))

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
						amount: Math.trunc((this.pair.from.amount / 2) * swap_fee_rate),
					},
					/**
					 * limit order price for the order, the price is the exchange ratio of X/Y where X is the amount of the first coin and
					 * Y is the amount of the second coin when their denoms are sorted alphabetically
					 */
					// orderPrice: '2',
					// orderPrice: this.pair.to.amount, // 05 или 2
					orderPrice,
				},
				// fee: [{ denom: this.pair.from.denom, amount: '20000' }, { amount: '20000', denom: 'stake' }],
			})
		},
		...mapActions('tendermint.liquidity.v1beta1', ['QueryLiquidityPool', 'QueryParams', 'sendMsgSwapWithinBatch']),
		...mapActions('cosmos.bank.v1beta1', ['QueryAllBalances']),
		...mapActions('swap', ['loadDenoms']),
		onSelectDenom({ target: { name, value } }) {
			// show only allowed denoms
			if (name === 'from') {
				this.denoms = this.getDenomPairs(value).map(({ changeTo }) => changeTo)
			}

			/*
					like in uniswap: reset denom if use tries to change denom to same denom.
					not used, because user just can't select two same denoms, look at the code abouve
				*/
			const mapRevers = { to: 'from', from: 'to' }

			if (this.pair.from.denom === this.pair.to.denom) {
				this.pair[mapRevers[name]].denom = ''
			}
		},
		onDenomAmount({ target: { value, min, max } }) {
			// console.log({ min, max })
		},
		getSwapPrice(payCoinAmount, payCoinPoolAmount, receiveCoinPoolAmount) {
			const precisionDigits = 10 ** 6

			const swapPrice = ((BigInt(payCoinPoolAmount) + BigInt(2 * payCoinAmount)) * BigInt(precisionDigits)) / BigInt(receiveCoinPoolAmount)
			return swapPrice
		},
	},
	computed: {
		...mapGetters('tendermint.liquidity.v1beta1', ['getParams', 'getLiquidityPools', 'getLiquidityPool']),
		...mapGetters('common/wallet', ['loggedIn', 'address']),
		...mapGetters('tendermint.liquidity.v1beta1', ['getLiquidityPools']),
		...mapGetters('swap', ['getAllDenomsNames', 'getDenomPairs', 'getAllDenoms', 'getPairPoolId']),
		...mapGetters('cosmos.bank.v1beta1', ['getAllBalances']),
		// todo App.vue in parent
		connected() {
			return true
		},
		balances: function () {
			return this.getAllBalances({
				params: { address: this.address },
			}).balances
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
