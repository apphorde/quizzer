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
import { useDeckList, favoritesId, Deck } from './useApi.js';

const [deckList, refresh] = useDeckList();
const favoriteItem = [{ value: { name: favoritesId }, label: '★ Words to Review ★' }];
const selected = ref('');
const options = computed(() => [
  ...favoriteItem,
  ...deckList.value!.map((deck: Deck) => ({ value: deck, label: deck.title || deck.name })),
]);

function onSelect({ name, id }) {
  const uid = id || name;
  const url = new URL(location.href);
  url.searchParams.set('id', uid);
  history.pushState({ name: uid }, '', url);
  selected.value = uid;
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
