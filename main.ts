import { createApp } from 'vue';
import { setEnv } from './src/env.js';
import App from './src/App.vue';

(async function () {
  const env = await fetch('/.env')
    .then((req) => req.json())
    .catch(() => ({}));

  setEnv(env);
  createApp(App).mount('#app');
})();
