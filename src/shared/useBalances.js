import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default async function () {
	const store = useStore()

	const address = computed(() => store.getters['common/wallet/address'])
	const balances = ref()

	/*
		if user diretly open /liquidity directly and not authed
		after the auth, "address" updates reactive only insode other component setup()

		I guess it's OK to use "watch" until account can be changed and balances should be updated
		and QueryAllBalances action returns getter
	*/
	watch(
		address,
		async (newVale) => {
			if (newVale) {
				balances.value =
					(
						await store.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
							params: { address: newVale },
						})
					)?.balances ?? []
			}
		},
		{ immediate: true },
	)

	return { balances, address }
}
