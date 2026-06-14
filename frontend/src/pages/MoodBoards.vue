<template>
  <section class="space-y-7">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-clay">Moodboards</p>
        <h1 class="page-title mt-3">把收藏重排成方案线索</h1>
      </div>
      <button class="bg-ink px-5 py-3 font-semibold text-paper" @click="create">新建灵感板</button>
    </div>
    <div class="grid gap-5 lg:grid-cols-3">
      <MoodBoardCard v-for="board in boards.boards" :key="board.id" :board="board" />
    </div>
    <div class="bg-paper p-6 ring-1 ring-ink/10">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-3xl text-ink">按空间分组排列</h2>
        <span class="text-sm text-ink/50">每组可独立拖拽排序</span>
      </div>
      <div class="mt-6 space-y-8">
        <template v-for="roomType in roomOrderWithImages" :key="roomType">
          <DraggableGrid
            :title="ROOM_NAMES[roomType]"
            :images="groupedImages[roomType]"
            :group="roomType"
            @reorder="handleReorder(roomType, $event)"
          />
          <div v-if="roomType !== lastRoomWithImages" class="border-t border-ink/10"></div>
        </template>
        <EmptyState v-if="!hasAnyImages" title="暂无灵感图" description="去画廊收藏一些灵感图吧" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DraggableGrid from '../components/common/DraggableGrid.vue';
import MoodBoardCard from '../components/common/MoodBoardCard.vue';
import EmptyState from '../components/common/EmptyState.vue';
import { useInspirationStore } from '../stores/inspirationStore';
import { useMoodboardStore } from '../stores/moodboardStore';
import { InspirationImage, RoomType } from '../types';
import { ROOM_NAMES, ROOM_ORDER } from '../constants/roomNames';

const boards = useMoodboardStore();
const inspirations = useInspirationStore();
const selectedImages = ref<InspirationImage[]>([]);

const imageMap = computed(() => new Map(inspirations.images.map((image) => [image.id, image])));

const groupedImages = computed<Record<RoomType, InspirationImage[]>>(() => {
  const groups: Record<string, InspirationImage[]> = {};
  for (const room of ROOM_ORDER) {
    groups[room] = [];
  }
  for (const image of selectedImages.value) {
    if (groups[image.roomType]) {
      groups[image.roomType].push(image);
    }
  }
  return groups as Record<RoomType, InspirationImage[]>;
});

const roomOrderWithImages = computed(() => ROOM_ORDER.filter((room) => groupedImages.value[room].length > 0));

const lastRoomWithImages = computed(() => {
  const rooms = roomOrderWithImages.value;
  return rooms.length > 0 ? rooms[rooms.length - 1] : null;
});

const hasAnyImages = computed(() => selectedImages.value.length > 0);

function handleReorder(roomType: RoomType, reordered: InspirationImage[]) {
  const otherImages = selectedImages.value.filter((img) => img.roomType !== roomType);
  selectedImages.value = [...otherImages, ...reordered];
}

async function create() {
  await boards.createBoard('材质实验 ' + (boards.boards.length + 1), '手动整理的风格方向', []);
}

onMounted(async () => {
  await inspirations.seed();
  await boards.load();
  const first = boards.boards[0];
  const boardImages = first && first.imageIds.length > 0
    ? (first.imageIds.map((id) => imageMap.value.get(id)).filter(Boolean) as InspirationImage[])
    : [];
  selectedImages.value = boardImages.length > 0 ? boardImages : inspirations.images;
});
</script>
