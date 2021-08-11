<template>
	<div>
		<div class="basic-info sp-component sp-box sp-shadow">
			<h4>
				<template v-if="!client">Please auth with your's wallet.</template>
				<template v-else>Nice to meet you!</template>
			</h4>
			<Status />
		</div>
		<SpTransferList :address="address" :refresh="true" v-if="client" />
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import Status from '../components/Status'

export default defineComponent({
	name: 'Index',
	components: {
		Status,
	},
	computed: {
		...mapGetters('common/wallet', ['address', 'client']),
	},
})
</script>
