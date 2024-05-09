<template>
  <div class="w-screen h-screen bg-tertiary app">
    <Flip :cards="deck" @shuffle="shuffle()" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Flip from './Flip.vue';
import { useData } from './useData';

const uid = new URL(location.href).searchParams.get('id') || '';
const [cards, refreshCards] = useData(`/assets/${uid || 'nl-words'}.json`);
const deck = ref([]);

function shuffle() {
  const mappedCards = (cards.value || []).map(([front, back]) => ({ front, back }));
  deck.value = mappedCards.slice().sort(() => (Math.random() > Math.random() ? 1 : -1));
}

onMounted(async () => {
  await refreshCards();
  shuffle();
});
</script>
