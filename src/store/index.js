import { createStore } from 'vuex'
import init from './config'
import swap from './modules/swap'

const store = createStore({
	state() {
		return {}
	},
	mutations: {},
	actions: {},
	modules: {
		swap,
	},
})
init(store)
export default store
