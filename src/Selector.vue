<template>
  <div class="selector">
    <form class="selector__header">
      <input class="selector__search" type="text" :placeholder="placeholder" name="search" v-model="filter" />
      <button class="btn sr-only">Search</button>
    </form>
    <div class="selector__list">
      <a @click.prevent="onSelect(item)" href="#" class="selector__item" v-for="item of list" :key="item.label">{{
        item.label
      }}</a>
    </div>

    <div class="selector__empty" v-if="!list.length">No items found.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type Props = {
  placeholder: string;
  options: any[];
};

const filter = ref('');
const props = defineProps<Props>();
const emit = defineEmits(['select']);

const list = computed(() =>
  (props.options || []).filter((item) => String(item.label).toLowerCase().includes(filter.value.toLowerCase())),
);

function onSelect(item) {
  emit('select', item.value || item);
}
</script>

<style scoped>
.selector__list:empty {
  display: none;
}
</style>
