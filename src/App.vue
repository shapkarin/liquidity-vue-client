<template>
	<div v-if="initialized">
		<SpWallet ref="wallet" v-on:dropdown-opened="$refs.menu.closeDropdown()" />
		<SpLayout>
			<template v-slot:sidebar>
				<Sidebar />
			</template>
			<template v-slot:content>
				<div class="container">
					<router-view />
				</div>
			</template>
		</SpLayout>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import Sidebar from './components/Sidebar'
// import ChangeLanguage from './components/ChangeLanguage'

import './scss/app.scss'
import '@starport/vue/lib/starport-vue.css'

export default defineComponent({
	components: {
		Sidebar
	},
	data() {
		return {
			initialized: false,
		}
	},
	computed: {
		hasWallet() {
			return this.$store.hasModule(['common', 'wallet'])
		}
	},
	async created() {
		await this.$store.dispatch('common/env/init')
		this.initialized = true
	},
	errorCaptured(err) {
		console.log(err)
		return false
	},
})
</script>

<style>
body {
	margin: 0;
}
</style>
