import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Liquidity from '../views/Liquidity.vue'
import Swap from '../components/Swap.vue'

const routerHistory = createWebHistory()
export const routes = [
	{
		path: '/',
		component: Index
	},
	{
		path: '/liquidity',
		component: Liquidity
	},
	{
		path: '/swap',
		component: Swap
	}
]

const router = createRouter({
	history: routerHistory,
	routes
})

export default router
