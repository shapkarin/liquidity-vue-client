<template>
	<div>
		<Popup>
			<template #header> Select a token </template>
			<template #body> <input type="text" /> </template>
		</Popup>

		<SpButton id="show-modal" @click="$emit('show')">Show Modal</SpButton>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Popup from './Popup'

export default defineComponent({
	name: 'SearchSelect',
	components: {
		Popup,
	},
})
</script>

<style></style>
