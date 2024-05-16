import { watch } from "vue";
import { env } from "./env";
import { useCache } from "./useCache";
import { useFetch } from "./useFetch";

export interface Source {
  language: string;
  name: string;
  pairs: Array<[string, string]>;
}

export interface Card {
  front: string;
  back: string;
}

interface Deck {
  name: string;
}

export function useDeckList() {
  const [initial, _, store] = useCache<Deck[]>("decklist", []);
  const [remote, refresh] = useFetch<Deck[], void>(
    () => [new URL("/deck", env.API_HOST)],
    initial.value
  );

  async function refreshAndSave() {
    await refresh();
    store(remote.value || []);
  }

  return [remote, refreshAndSave];
}

export const favoritesId = ":favorites:";
export function useDeck() {
  return useFetch<Source, void>(() => {
    const uid = new URL(location.href).searchParams.get("id");
    return !uid
      ? null
      : [new URL(uid === favoritesId ? "/fav" : "/deck/" + uid, env.API_HOST)];
  });
}

export function useFavorites() {
  const [favorites, refresh] = useFetch<Source, void>(() => [
    new URL("/fav", env.API_HOST),
  ]);

  const encodeCard = (card: Card) =>
    [encodeURIComponent(card.front), encodeURIComponent(card.back)].join(":");

  const [_, save] = useFetch<void, Card>((card) =>
    !card
      ? null
      : [new URL("/fav/" + encodeCard(card), env.API_HOST), { method: "POST" }]
  );

  const [__, remove] = useFetch<void, Card>((card) =>
    !card
      ? null
      : [
          new URL("/fav/" + encodeCard(card), env.API_HOST),
          { method: "DELETE" },
        ]
  );

  const isFavorite = (card: Card) => {
    if (card && favorites.value) {
      const { front, back } = card;
      return !!favorites.value!.pairs.find(
        (c) =>
          decodeURIComponent(c[0]) === front &&
          decodeURIComponent(c[1]) === back
      );
    }

    return false;
  };

  return {
    favorites,
    isFavorite,
    save,
    remove,
    refresh,
  };
}
