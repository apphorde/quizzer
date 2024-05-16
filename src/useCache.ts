import { Ref, ref } from "vue";

export function useCache<T = any>(name: string, initialValue: T | null = null) {
  const valueRef = ref<any>(initialValue);

  function refresh() {
    const local = localStorage.getItem("cache:" + name);

    if (typeof local !== "string") {
      return;
    }

    try {
      valueRef.value = JSON.parse(local);
    } catch {
      valueRef.value = null;
    }
  }

  function store(newValue: T) {
    valueRef.value = newValue;
    localStorage.setItem("cache:" + name, JSON.stringify(newValue));
  }

  refresh();

  return [valueRef as Ref<T>, refresh, store] as const;
}
