<template>
  <q-dialog v-model="localIsOpen" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <div>{{ message }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="cancel" />
        <q-btn flat label="Confirm" color="positive" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    title: {
      type: String,
      default: 'Confirmation',
    },
    message: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const localIsOpen = ref(props.isOpen)

    watch(
      () => props.isOpen,
      (newVal) => {
        localIsOpen.value = newVal
      },
    )

    const confirm = () => {
      emit('confirm')
      localIsOpen.value = false
    }

    const cancel = () => {
      emit('cancel')
      localIsOpen.value = false
    }

    return {
      localIsOpen,
      confirm,
      cancel,
    }
  },
}
</script>
