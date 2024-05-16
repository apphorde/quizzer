import { ref } from "vue";

export function useCache<T=any>(name: string) {
  const value = ref<T|null>();

  function refresh() {
    const local = localStorage.getItem("cache:" + name);
    if (typeof local !== "string") {
      value.value = null;
      return;
    }

    try {
      value.value = JSON.parse(local);
    } catch {
      value.value = null;
    }
  }

  function store(value) {
    localStorage.setItem("cache:" + name, value);
  }

  return [value, refresh, store] as const;
}
