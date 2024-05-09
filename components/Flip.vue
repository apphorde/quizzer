<template>
  <div class="flipper">
    <div v-if="haveValidCards()" class="flipper__deck">
      <div
        class="relative overflow-hidden card h-48 text-center rounded-t-lg cursor-pointer"
        @click="showTranslation = !showTranslation"
      >
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
        <button @click="prevCard()" class="btn">
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

        <button @click="shuffle()" class="btn">
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

        <button v-if="speech" @click="speak()" class="btn">
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

        <button v-if="favorites" @click="save()" class="btn">
          <svg
            class="btn__icon"
            alt="Save"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
            />
          </svg>
        </button>

        <button @click="nextCard()" class="btn">
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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const index = ref(0);
const animated = ref(true);
const showTranslation = ref(false);

const props = defineProps({
  speech: { type: Boolean },
  favorites: { type: Boolean },
  language: { type: String, default: 'en' },
  cards: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['shuffle', 'speak', 'save']);

function haveValidCards() {
  return props.cards?.length && Array.isArray(props.cards);
}

function save() {
  const card = props.cards[index.value];
  emit('save', card);
}

function shuffle() {
  animated.value = false;
  unflip();
  index.value = 0;
  animated.value = true;

  emit('shuffle');
}

function speak() {
  const card = props.cards[index.value];
  const text = showTranslation.value ? card.back : card.front;
  const language = showTranslation.value ? 'en' : props.language;

  emit('speak', { text, language });
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
    index.value = props.cards.length - 1;
  }

  setTimeout(() => (animated.value = true));
}

function nextCard() {
  animated.value = false;
  unflip();

  if (index.value < props.cards.length - 1) {
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
    flip();
  }

  if (event.key === 'w' || event.key === 'ArrowUp') {
    unflip();
  }

  if (event.key === 'r') {
    shuffle();
  }

  if (event.key === 'q') {
    save();
  }

  if (event.key === 'p' && props.speech) {
    speak();
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  shuffle();
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
