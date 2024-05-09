import router from 'micro-router';
import { Store } from './store.mjs';

const store = Store.get(process.env.STORE_ID);
const notFound = (response) => response.writeHead(404, 'Not found').end();

async function onDeckLoad(_request, response, params) {
  const deck = await store.getResource('deck').get(params.id);

  if (deck) {
    response.end(JSON.stringify(deck));
    return;
  }

  notFound(response);
}

const routes = {
  'GET /deck/{uid}': onDeckLoad,
};

export default function (request, response, next) {
  router(routes, () => next());
  next();
}
