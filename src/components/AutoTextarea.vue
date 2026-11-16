<template>
  <textarea ref="el" :value="modelValue" :rows="rows" @input="onInput"></textarea>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{ modelValue?: string; rows?: number | string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const el = ref<HTMLTextAreaElement>()

function resize() {
  if (!el.value) return
  el.value.style.height = 'auto'
  el.value.style.height = el.value.scrollHeight + 'px'
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  resize()
}

onMounted(resize)
watch(() => props.modelValue, () => nextTick(resize))
</script>
