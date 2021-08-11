import { computed } from 'vue'
import { useStore } from 'vuex'

export default async function (otherAddress) {
	const store = useStore()

	const BANK_MODULE = 'cosmos.bank.v1beta1'
	const WALLET_MODULE = 'common/wallet'

	const myAddress = computed(() => store.getters[`${WALLET_MODULE}/address`])
	const address = otherAddress || myAddress.value

	const balances = computed(() => store.getters[`${BANK_MODULE}/getAllBalances`]({ params: { address } }).balances)

	const QueryAllBalances = await store.dispatch(`${BANK_MODULE}/QueryAllBalances`, {
		params: { address },
		options: { all: true, subscribe: false },
	})

	return { balances, QueryAllBalances, myAddress }
}
