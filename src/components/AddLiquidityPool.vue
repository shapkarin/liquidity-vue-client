<template>
<div>
	<div class="sp-component sp-box sp-shadow">
		{{ JSON.stringify(balances)}}
		<h1>Create new pool</h1>
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
import { mapGetters, mapActions }  from 'vuex';

export default defineComponent({
	name: 'AddLiquidityPool',
	data() {
		return {
			deposit: [
				{ amount: '', denom: '' },
				{ amount: '', denom: '' },
			],
			memo: '',
		}
	},
	async mounted(){
		// await this.QueryAllBalances({
		// 	params: { address: this.address },
		// 	options: { all: true, subscribe: true },
		// })
		// console.log(this.getAllBalances)
	},
	methods: {
		...mapActions('tendermint.liquidity.v1beta1', ['sendMsgCreatePool']),
		...mapActions('cosmos.bank.v1beta1', ['QueryAllBalances']),
		async createPool() {
			await this.sendMsgCreatePool({
				value: {
					poolCreatorAddress: this.address,
					poolTypeId: 1,
					depositCoins: this.deposit,
				},
				// example at https://github.com/tendermint/liquidity/blob/develop/doc/client.md#msgcreatepool
				// there is: "fee": { "amount": [],
				// ---------
				// fee: [
				// 	{ amount: '20000', denom: 'uusd' },
				// 	{ denom: 'token', amount: '20000' },
				// ],
				memo: 'tokens to stake',
			})
		},
	},

	computed: {
		...mapGetters('common/wallet', ['address']),
		...mapGetters('cosmos.bank.v1beta1', ['getAllBalances']),
		balances: function () {
			return (
				this.getAllBalances({
					params: { address: this.address },
				}).balances
			)
		},
	}
})
</script>

<style>
.memo {
	width: 238px;
}
</style>
