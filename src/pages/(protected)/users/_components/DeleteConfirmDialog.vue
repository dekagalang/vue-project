<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="400px"
    @update:model-value="$emit('update:open', $event)"
  >
    <v-card>
      <v-card-title>Confirm Delete</v-card-title>
      <v-card-text>Are you sure you want to delete this user?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="error"
          @click="onConfirmDelete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    confirm: []
  }>()

  const dialogOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  function closeDialog() {
    dialogOpen.value = false
  }

  function onConfirmDelete() {
    emit('confirm')
    closeDialog()
  }
</script>
