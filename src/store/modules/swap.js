/*
	todo: typescript
	can be placed directly to the component or to the tendermint.liquidity

	state.denoms shape is an object, key is a denom name
	state.denoms['NAME'] is also an obj, exchange denom name uses as it's keys
	todo: think again about different store shapes,
	with shape at least an item can be easly finded by denom name
	and due we don't need to update it much, other benefits are not so important
 */
export default {
	namespaced: true,
	state() {
		return {
			denoms: {},
		}
	},
	mutations: {
		addDenoms(state, denoms) {
			state.denoms = {
				...state.denoms,
				...denoms
			}
		},
		addDenom(state, { denom, swaps }) {
      state.denoms[denom] = {
				...state.denoms[denom],
				...swaps
			}
    },
		addPairsToDenom({ denoms, getters: { getDenomPairs } }, {denom, swap}) {
			denoms[denom] = {
				...getDenomPairs(denom),
				...(Array.isArray(swap) ? swap : [swap])
			}
		}
	},
	actions: {
		async loadDenoms({ dispatch, commit, getters, rootGetters }) {
			const getLiquidityPools = rootGetters['tendermint.liquidity.v1beta1/getLiquidityPools'];
			if(!getLiquidityPools) {
				throw new Error('tendermint.liquidity.v1beta1/getLiquidityPools getter is not exist')
			}

			const { pools } = getLiquidityPools()

			const denoms = pools.reduce((result, {reserve_coin_denoms, pool_coin_denom, id: pool_id, reserve_account_address}) => ({
					...result,
					...(reserve_coin_denoms.reduce((acc, denom, index) => ({
						...acc,
						[denom]: {
							...(result[reserve_coin_denoms[index]] ? result[reserve_coin_denoms[index]] : {}),
							[index === 0 ? reserve_coin_denoms[1] : reserve_coin_denoms[0]]: {
								pool_coin_denom,
								pool_id,
								reserve_account_address,
							}
						}
					}), {}))
			}), {})
			commit('addDenoms', denoms)
		},
	},
	getters: {
		getAllDenomsNames: ({ denoms }) => Object.keys(denoms).sort() || [], // todo: rename
		getDenomPairs: ({ denoms }) => (denom) => {
			if(!denoms[denom]) {
				return []
			}
			return Object.keys(denoms[denom]).sort().map(changeTo => ({
				...denoms[denom][changeTo],
				pair: `${denom}/${changeTo}`,
				denom,
				changeTo,
			}))
		},
		getPairInfo: ({ denoms }) => (denom1, denom2) => denoms[denom1][denom2],
		// not sure that it can be useful
		getAllPossiblePairs: ({ denoms }, { getAllDenomsNames, getDenomPairs }) => (
			getAllDenomsNames.reduce((acc, denom) => [...acc, ...getDenomPairs(denom)], [])
		),
	},
}
