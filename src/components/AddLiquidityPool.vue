<template>
	<div class="sp-component">
		<div class="sp-component-title">
			<h3>Create new liquidity pool</h3>
		</div>
		<div class="sp-box sp-shadow">
			<!-- <SpAmountSelect :index="0" v-model="balances[0]" :available="balances" :selected="() => balances.map((b) => b.denom)" v-bind:key="'fee' + index" /> -->
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
import { mapGetters, mapActions } from 'vuex'

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
			balances: [],
		}
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

		const { balances } = await this.QueryAllBalances({
			params: { address: this.address },
			options: { all: true, subscribe: false },
		})
		this.balances = balances
	},
	methods: {
		...mapActions('tendermint.liquidity.v1beta1', ['QueryParams', 'sendMsgCreatePool']),
		...mapActions('cosmos.bank.v1beta1', ['QueryAllBalances']),
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
					poolCreatorAddress: this.address,
					poolTypeId: 1,
					depositCoins: this.deposit,
				},
				memo: this.memo,
			})
		},
	},
	computed: {
		...mapGetters('common/wallet', ['address']),
		...mapGetters('cosmos.bank.v1beta1', ['getAllBalances']),
	},
})
</script>

<style>
.memo {
	width: 238px;
}
</style>
