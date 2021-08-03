<template>
	<div>
		<div class="basic-info sp-component sp-box sp-shadow">
			<h4>
				<!-- <template v-if="!client">{{ $t('greeting.anonymous') }}</template>
				<template v-else>{{ $t('greeting.user', { name: address }) }}</template> -->
				<template v-if="!client">Please auth with your's wallet. To unlick some UI parts.</template>
				<template v-else>Nice to meet you.</template>
			</h4>
			<Status />
		</div>
		<SpTransferList :address="address" :refresh="true" v-if="client" />
		<SpTokenSend :address="address" refresh="true" v-if="client" />
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
