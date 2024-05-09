<template>
  <div class="app">
    <Flip
      :cards="deck"
      :speech="canSpeak"
      :language="quizSource?.language"
      @speak="onSpeak($event)"
      @shuffle="onShuffle()"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Flip from './Flip.vue';
import { useData } from './useData';
import { useSpeech } from './useSpeech';

type QuizSource = {
  language: string;
  pairs: Array<[string, string]>;
};

type FlipCard = {
  front: string;
  back: string;
};

const uid = new URL(location.href).searchParams.get('id') || '';
const [canSpeak, speak] = useSpeech();
const [quizSource, refreshCards] = useData<QuizSource>(`/assets/${uid || 'nl-words'}.json`);
const deck = ref<FlipCard[]>([]);

function onShuffle() {
  if (!quizSource.value) return;

  const mappedCards = (quizSource.value.pairs || []).map(([front, back]) => ({ front, back }));
  deck.value = mappedCards.slice().sort(() => (Math.random() > Math.random() ? 1 : -1));
}

function onSpeak({ text, language }) {
  speak(text, language);
}

onMounted(async () => {
  await refreshCards();
  onShuffle();
});
</script>
