import { computed } from 'vue'
import { useStore } from 'vuex'

// при открытии напрямую страницы /liquidity, balances = undefined
export default async function (otherAddress = '') {
	const store = useStore()

	const BANK_MODULE = 'cosmos.bank.v1beta1'
	const WALLET_MODULE = 'common/wallet'

	const myAddress = computed(() => store.getters[`${WALLET_MODULE}/address`])
	const address = otherAddress || myAddress.value

	// возвращает значение
	setTimeout(() => {
		console.log({ myAddress1: myAddress.value })
	}, 420)

	// дефолтное значение стора, пустая строка
	console.log({ myAddress2: myAddress.value })

	const QueryAllBalances = await store.dispatch(`${BANK_MODULE}/QueryAllBalances`, {
		params: { address },
	})

	const balances = computed(
		() =>
			store.getters[`${BANK_MODULE}/getAllBalances`]({
				params: { address },
			})?.balances ?? [],
	)

	console.log({ balances })

	return { balances: [], myAddress, QueryAllBalances: () => {} }
}
