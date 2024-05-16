<template>
  <div class="flipper">
    <div v-if="haveValidCards()" class="flipper__deck">
      <div class="flipper__cardholder" @click="showTranslation = !showTranslation">
        <div class="flipper__card" :class="[showTranslation ? 'out' : 'in', animated ? 'animated' : '']">
          {{ cards[index].front }}
        </div>
        <div
          class="flipper__card flipper__card-back"
          :class="[showTranslation ? 'in' : 'out', animated ? 'animated' : '']"
        >
          {{ cards[index].back }}
        </div>
      </div>
      <div class="flipper__nav">
        <button @click="prevCard()" class="btn" title="Previous (<-)">
          <svg
            class="btn__icon"
            alt="Previous"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              fill="currentColor"
              d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z"
            />
          </svg>
        </button>

        <button @click="onShuffle()" class="btn" title="Shuffle (r)">
          <svg
            class="btn__icon"
            alt="Shuffle"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              fill="currentColor"
              d="M560-160v-80h104L537-367l57-57 126 126v-102h80v240H560Zm-344 0-56-56 504-504H560v-80h240v240h-80v-104L216-160Zm151-377L160-744l56-56 207 207-56 56Z"
            />
          </svg>
        </button>

        <button v-if="speech" @click="onSpeak()" class="btn" title="Speak (p)">
          <svg
            class="btn__icon"
            alt="Speak"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="M640-440v-80h160v80H640Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM120-360v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z"
            />
          </svg>
        </button>
        <button v-if="favorites" @click="onFavorite()" class="btn" title="Save it (q)">
          <svg
            v-if="isFavorite(cards[index])"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            alt="Save"
            viewBox="0 0 24 24"
            class="btn__icon fill-current text-primary"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            alt="Save"
            viewBox="-1 -1 26 26"
            class="btn__icon"
          >
            <path
              style="stroke: currentColor"
              fill="none"
              stroke-width="2"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>

        <button @click="nextCard()" class="btn" title="Next (->)">
          <svg
            class="btn__icon"
            alt="Next"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              fill="currentColor"
              d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useSpeech } from './useSpeech';
import { Card, useDeck, useFavorites } from './useApi';

const [source, refreshDeck] = useDeck();
const [_, speak] = useSpeech();
const { isFavorite, save, refresh: refreshFavorites, remove } = useFavorites();

const cards = ref<Card[]>([]);
const index = ref(0);
const animated = ref(true);
const showTranslation = ref(false);

interface Props {
  speech: boolean;
  favorites: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  speech: false,
  favorites: false,
});

function haveValidCards() {
  return cards.value.length && Array.isArray(cards.value);
}

async function onFavorite() {
  const card = cards.value[index.value];

  if (isFavorite(card)) {
    await remove(card);
  } else {
    await save(card);
  }

  await refreshFavorites();
}

function onShuffle() {
  animated.value = false;
  unflip();
  index.value = 0;
  animated.value = true;

  if (source.value) {
    const mappedCards: Card[] = (source.value.pairs || []).map(([front, back]) => ({ front, back }));
    cards.value = mappedCards.slice().sort(() => (Math.random() > Math.random() ? 1 : -1));
  }
}

function onSpeak() {
  const card = cards.value[index.value];
  const text = showTranslation.value ? card.back : card.front;
  const language = showTranslation.value ? 'en' : source.value?.language;

  speak(text, language);
}

function flip() {
  showTranslation.value = true;
}

function unflip() {
  showTranslation.value = false;
}

function prevCard() {
  animated.value = false;
  unflip();

  if (index.value > 0) {
    index.value--;
  } else {
    index.value = cards.value.length - 1;
  }

  setTimeout(() => (animated.value = true));
}

function nextCard() {
  animated.value = false;
  unflip();

  if (index.value < cards.value.length - 1) {
    index.value++;
  } else {
    index.value = 0;
  }

  setTimeout(() => (animated.value = true));
}

function handleKeyDown(event) {
  if (event.key === 'a' || event.key === 'ArrowLeft') {
    prevCard();
  }

  if (event.key === 'd' || event.key === 'ArrowRight') {
    nextCard();
  }

  if (event.key === 's' || event.key === 'ArrowDown') {
    showTranslation.value ? unflip() : flip();
  }

  if (event.key === 'w' || event.key === 'ArrowUp') {
    unflip();
  }

  if (event.key === 'r') {
    onShuffle();
  }

  if (event.key === 'q') {
    onFavorite();
  }

  if (event.key === 'p' && props.speech) {
    onSpeak();
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  await refreshDeck();
  await refreshFavorites();
  onShuffle();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.in {
  width: 100%;
  top: 0%;
}

.out {
  width: 100%;
  top: 100%;
}

.animated {
  transition: top 0.1s ease-in-out 0.05s;
}
</style>
