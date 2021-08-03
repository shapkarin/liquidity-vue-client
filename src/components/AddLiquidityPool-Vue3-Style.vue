<template>
<div>
	<!-- <SpTokenSend :address="poolCreatorAddress" refresh="true" /> -->
	<div class="sp-component sp-box sp-shadow">



		<h1>Create new pool</h1>
		<form>
			<select v-model="payload.deposit[0].denom">
				<option value="stake">stake</option>
				<option value="token">token</option>
				<option value="uatom">uatom</option>
			</select>
			<input type="number" step="0.0001" v-model="payload.deposit[0].amount" />

			<br />
			<select v-model="payload.deposit[1].denom">
				<option value="stake">stake</option>
				<option value="token">token</option>
				<option value="uatom">uatom</option>
			</select>
			<input type="number" step="0.0001" v-model="payload.deposit[1].amount" />
			<br />
			<textarea width="238" v-model="payload.memo" class="memo"></textarea>
			<br />
			<SpButton type="secondary" @click="createPool">Create</SpButton>
		</form>
	</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore }  from 'vuex';

export default defineComponent({
	name: 'AddLiquidityPool',
	async setup() {
		const payload = ref({
			deposit: [
				{ amount: '', denom: '' },
				{ amount: '', denom: '' },
			],
			memo: '',
		})
		const store = useStore()


		const poolCreatorAddress = computed(() => store.getters['common/wallet/address'])

		console.log({ poolCreatorAddress: poolCreatorAddress.value })

		// await store.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
		// 	params: { address: 'cosmos1l8f7dcdmvvrpsqw44xz48re95gve88sdk2tyls' },
		// 	options: { all: true, subscribe: true },
		// })

		//const getAllBalances = store.getters['cosmos.bank.v1beta1/getAllBalances']
		// console.log({getAllBalances: getAllBalances()})


		async function createPool() {

			// console.log(poolCreatorAddress)

			await store.dispatch('tendermint.liquidity.v1beta1/sendMsgCreatePool', {
				value: {
					poolCreatorAddress: poolCreatorAddress.value,
					poolTypeId: 1,
					depositCoins: payload.value.deposit,
				},
				// example at https://github.com/tendermint/liquidity/blob/develop/doc/client.md#msgcreatepool
				// there is: "fee": { "amount": [],
				// ---------
				// fee: [
				// 	{ amount: '20000', denom: 'uusd' },
				// 	{ denom: 'token', amount: '20000' },
				// ],
				memo: 'token to stake',
			})
		}
		return { payload, createPool, poolCreatorAddress }
	},
})
</script>

<style>
.memo {
	width: 238px;
}
</style>
