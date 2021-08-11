<template>
	<div class="sp-component">
		<div class="sp-component-title">
			<h3>Create new liquidity pool</h3>
		</div>
		<div class="sp-box sp-shadow">
			validation: {{ JSON.stringify(validation) }}
			<form>
				<select v-model="deposit[0].denom">
					<option v-for="{ denom } in balances" v-bind:key="'denom1_' + denom" :value="denom">{{ denom }}</option>
				</select>
				<input type="number" step="0.0001" v-model="deposit[0].amount" />

				<br />
				<select v-model="deposit[1].denom">
					<option v-for="{ denom } in balances" v-bind:key="'denom2_' + denom" :value="denom">{{ denom }}</option>
				</select>
				<input type="number" step="0.0001" v-model="deposit[1].amount" />
				<br />
				<textarea width="238" v-model="memo" class="memo"></textarea>
				<br />
				<SpButton type="secondary" @click="createPool">Create</SpButton>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

import useBalances from '../shared/useBalances'

export default defineComponent({
	name: 'AddLiquidityPool',
	data() {
		return {
			deposit: [
				{ amount: '', denom: '' },
				{ amount: '', denom: '' },
			],
			memo: '',
			validation: {
				// init_pool_coin_mint_amount: '',
				min_init_deposit_amount: '',
				pool_creation_fee: [],
			},
		}
	},
	async setup() {
		const { balances, myAddress } = await useBalances()

		return { balances, myAddress }
	},
	async mounted() {
		const {
			params: {
				min_init_deposit_amount,
				// init_pool_coin_mint_amount,
				pool_creation_fee,
			},
		} = await this.QueryParams({})

		// this.requirements.init_pool_coin_mint_amount = init_pool_coin_mint_amount
		this.validation.min_init_deposit_amount = min_init_deposit_amount
		this.validation.pool_creation_fee = pool_creation_fee
	},
	methods: {
		...mapActions('tendermint.liquidity.v1beta1', ['QueryParams', 'sendMsgCreatePool']),
		async createPool() {
			if (
				Number(this.validation.min_init_deposit_amount) > this.deposit[0].amount ||
				Number(this.validation.min_init_deposit_amount) > this.deposit[1].amount
			) {
				alert(`Amount should be more than ${this.validation.min_init_deposit_amount}`)
				return
			}
			// this.pool_creation_fee.find(({ denom }) => denom === (this.deposit[0].denom || this.deposit[1].denom))

			await this.sendMsgCreatePool({
				value: {
					poolCreatorAddress: this.myAddress,
					poolTypeId: 1,
					depositCoins: this.deposit,
				},
				memo: this.memo,
			})
		},
	},
})
</script>

<style>
.memo {
	width: 238px;
}
</style>
