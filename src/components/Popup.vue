<template>
	<transition name="modal" v-if="visible" @show="showModal" @close="hideModal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<slot name="header" />
					</div>

					<div class="modal-body">
						<slot name="body" />
					</div>

					<div class="modal-footer">
						<slot name="footer" />
						<button class="modal-default-button" @click="$emit('close')">OK</button>
					</div>
				</div>
			</div>
		</div>
	</transition>

	<!-- <button id="show-modal" @click="$emit('show')">Show Modal</button> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'Popup',
	setup() {
		const visible = ref(false)

		const showModal = () => {
			visible.value = true
		}
		const hideModal = () => {
			visible.value = false
		}

		return { visible, showModal, hideModal }
	},
})
</script>

<style></style>
