<template>
	<div class="sp-component">
		<div class="sp-component-title">
			<h3>Exchange directions</h3>
			<span>|</span><span>From all liquidity <router-link to="/liquidity">pools</router-link></span>
		</div>
		<div class="sp-box sp-shadow">
			<div v-for="pair in pairs" v-bind:key="pair" class="pair_stat">
				<b>{{ pair.denom }}</b> swap_to: <b>{{ pair.changeTo }}</b>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ExchangeDirections',
	props: {
		pairs: {
			type: Array,
			required: true,
		},
	},
})
</script>
