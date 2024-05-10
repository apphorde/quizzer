<template>
  <div class="selector">
    <div class="selector__header">
      <input
        class="selector__search"
        type="text"
        :placeholder="placeholder"
        aria-label="Filter options"
        name="search"
        v-model="filter"
      />
      <svg
        class="selector__searchicon"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path
          d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
        />
      </svg>
    </div>
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
