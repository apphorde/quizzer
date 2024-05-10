<template>
  <div class="app">
    <Selector v-if="!selected" @select="onSelect" :options="options" placeholder="Find a quiz" />
    <Flip :speech="true" :favorites="true" v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Flip from './Flip.vue';
import Selector from './Selector.vue';
import { useDeckList } from './useApi.js';

const [deckList, refresh] = useDeckList();
const options = computed(() => deckList.value?.map((deck) => ({ value: deck, label: deck.name })));
const selected = ref('');

function onSelect({ name }) {
  const url = new URL(location.href);
  url.searchParams.set('id', name);
  history.pushState({ name: name }, '', url);
  selected.value = name;
}

function updateSelected() {
  const url = new URL(location.href);
  selected.value = url.searchParams.get('id') || '';
}

onMounted(() => {
  refresh();
  updateSelected();
  window.addEventListener('popstate', () => updateSelected());
});
</script>
