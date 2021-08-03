<template>
	<SpSidebar
		v-on:sidebar-open="sidebarOpen = true"
		v-on:sidebar-close="sidebarOpen = false"
	>
		<template v-slot:default>
			<!-- Just for the test to quickly render navigation -->
			<SpLinkIcon v-for="(route, index) in routes" :link="route.path" :text="route.component.name" icon="Hash" v-bind:key="'menu_item_' + index" />
		</template>
		<template v-slot:footer>
			<SpStatusAPI :showText="sidebarOpen" />
			<SpStatusRPC :showText="sidebarOpen" />
			<SpStatusWS :showText="sidebarOpen" />
		</template>
	</SpSidebar>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Sidebar',
	data() {
		return {
			sidebarOpen: true
		}
	},
	computed: {
		hasWallet() {
			return this.$store.hasModule(['common', 'wallet'])
		},
		routes() {
			const { routes } = require('../router')
			return routes
		}
	}
})
</script>
