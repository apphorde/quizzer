import { ref } from 'vue';

const canSpeak = ref(!!window.speechSynthesis);
const voiceMap: Record<string, any> = {};

async function speak(text: string, lang = 'en') {
  if (!canSpeak.value) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voiceMap[lang];
  speechSynthesis.speak(utterance);
}

function loadVoices() {
  if (!canSpeak.value) {
    return;
  }

  const voices = speechSynthesis.getVoices();
  voices.forEach((voice) => {
    const [lang] = voice.lang.split('-');
    voiceMap[lang] = voice;
  });
}

export function useSpeech() {
  // immediate calls return zero voices
  setTimeout(loadVoices, 1000);

  return [canSpeak, speak] as const;
}
