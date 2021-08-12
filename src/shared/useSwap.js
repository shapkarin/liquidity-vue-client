import { useStore } from 'vuex'

export default function () {
	const store = useStore()
	// precision setting (0.000000 level precision below than this decimal digits will be truncated)
	const precisionDigits = 10 ** 6
	function getSwapPrice(payCoinAmount, payCoinPoolAmount, receiveCoinPoolAmount) {
		const swapPrice = ((BigInt(payCoinPoolAmount) + BigInt(2 * payCoinAmount)) * BigInt(precisionDigits)) / BigInt(receiveCoinPoolAmount)
		return swapPrice
	}
	function getReceiveCoinAmount(payCoinData, payCoinPoolAmount, receiveCoinPoolAmount, maxDecimal = 2) {
		var _a, _b, _c
		if (payCoinData.amount) {
			const swapFeeRate =
				1 -
				((_b = (_a = store.getters['tendermint.liquidity.v1beta1/getParams']().params) === null || _a === void 0 ? void 0 : _a.swap_fee_rate) !== null &&
				_b !== void 0
					? _b
					: 0.003 / 2) // ?? alert('Error: getDenomPrecision');
			// (_c = store.getters['demeris/getDenomPrecision']({ name: payCoinData.base_denom })) !== null && _c !== void 0 ? _c : 6
			const payCoinBaseDenomDecimalDigits = 6
			const payCoinBaseDenomAmount = Math.trunc(payCoinData.amount * swapFeeRate * 10 ** payCoinBaseDenomDecimalDigits)
			const decimalMaxDigits = 10 ** maxDecimal
			const swapPrice = Number(getSwapPrice(payCoinBaseDenomAmount, receiveCoinPoolAmount, payCoinPoolAmount))
			const receiveCoinAmount = BigInt(payCoinBaseDenomAmount * precisionDigits) / BigInt(swapPrice)
			return Math.trunc((Number(receiveCoinAmount) / precisionDigits) * decimalMaxDigits) / decimalMaxDigits
		} else {
			return 0
		}
	}
	function getPayCoinAmount(receiveCoinData, payCoinPoolAmount, receiveCoinPoolAmount, maxDecimal = 2) {
		var _a, _b, _c
		const swapFeeRate =
			1 -
			((_b = (_a = store.getters['tendermint.liquidity.v1beta1/getParams']().params) === null || _a === void 0 ? void 0 : _a.swap_fee_rate) !== null &&
			_b !== void 0
				? _b
				: 0.003 / 2)
		const receiveCoinBaseDenomDecimalDigits =
			(_c = store.getters['demeris/getDenomPrecision']({ name: receiveCoinData.base_denom })) !== null && _c !== void 0 ? _c : 6 //?? alert('Error: getDenomPrecision');
		const receiveCoinBaseDenomAmount = Math.trunc(receiveCoinData.amount * 10 ** receiveCoinBaseDenomDecimalDigits)
		const payCoinAmount =
			Number(BigInt(payCoinPoolAmount * precisionDigits) / BigInt(receiveCoinPoolAmount)) /
			(swapFeeRate / receiveCoinBaseDenomAmount - 2 / receiveCoinPoolAmount)
		if (payCoinAmount > 0) {
			return parseFloat(String(Math.ceil((payCoinAmount / 10 ** receiveCoinBaseDenomDecimalDigits / precisionDigits) * 10 ** maxDecimal) / 10 ** maxDecimal))
		} else {
			return 0
		}
	}
	function getPrecision(denom) {
		const chains = store.getters['demeris/getChains']
		const denomPrecisionIndexer = {}
		for (let chain in chains) {
			chains[chain].denoms.forEach((item) => {
				denomPrecisionIndexer[item.name] = item
			})
		}
		return Number(denomPrecisionIndexer[denom].precision)
	}
	function getPrecisedAmount(denom, amount) {
		try {
			const precision = getPrecision(denom)
			return parseInt(amount) / 10 ** precision
		} catch (_a) {
			return amount
		}
	}
	function calculateSlippage(swapAmount, poolReserve) {
		let slippage = (2 * swapAmount) / poolReserve
		if (slippage > 0.997) {
			slippage = 0.997
		}
		return slippage
	}
	return {
		calculateSlippage,
		getSwapPrice,
		getPayCoinAmount,
		getReceiveCoinAmount,
		getPrecision,
		getPrecisedAmount,
	}
}
