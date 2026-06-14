<template>
  <div class="space-y-3">
    <div v-if="title" class="flex items-center gap-2">
      <h3 class="font-display text-xl text-ink">{{ title }}</h3>
      <span class="text-sm text-ink/50">{{ images.length }} 张</span>
    </div>
    <VueDraggable
      v-model="localImages"
      :group="group"
      :animation="200"
      class="grid grid-cols-2 gap-3 md:grid-cols-4"
      ghost-class="opacity-50"
    >
      <img v-for="image in localImages" :key="image.id" :src="image.imageUrl" :alt="image.sourceDescription" class="aspect-square w-full cursor-grab object-cover ring-1 ring-ink/10 transition hover:ring-2 hover:ring-clay active:cursor-grabbing" />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { InspirationImage } from '../../types';

const props = withDefaults(defineProps<{
  images: InspirationImage[];
  title?: string;
  group?: string;
}>(), {
  group: 'default'
});

const emit = defineEmits<{ reorder: [images: InspirationImage[]] }>();
const localImages = computed({
  get: () => props.images,
  set: (value) => emit('reorder', value)
});
</script>
