<template>
  <div class="app">
    <Flip
      :cards="deck"
      :speech="canSpeak"
      :favorites="true"
      :language="quizSource?.language"
      @speak="onSpeak($event)"
      @save="onSave($event)"
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

const [canSpeak, speak] = useSpeech();
const [quizSource, refreshCards] = useData<QuizSource>(`/assets/nl-words.json`);
const deck = ref<FlipCard[]>([]);

function onShuffle() {
  if (!quizSource.value) return;

  const mappedCards = (quizSource.value.pairs || []).map(([front, back]) => ({ front, back }));
  deck.value = mappedCards.slice().sort(() => (Math.random() > Math.random() ? 1 : -1));
}

function onSpeak({ text, language }) {
  speak(text, language);
}

function onSave({ front, back }) {
  fetch('/api/fav/' + [front, back].join(','), { method: 'POST' });
}

async function onLoad() {
  const uid = new URL(location.href).searchParams.get('id') || '';
  if (uid) {
    const req = await fetch('/api/deck/' + uid);
    quizSource.value = await req.json();
  }
}

onMounted(async () => {
  await refreshCards();
  await onLoad();
  onShuffle();
});
</script>
