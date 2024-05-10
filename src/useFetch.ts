import { ref } from 'vue';

export function useFetch<T, U = any>(getArgs: (a?: U) => null | Parameters<typeof fetch>) {
  const value = ref<T | null>(null);

  const refresh = async (a: U) => {
    const args = getArgs(a);
    if (args !== null) {
      const req = await fetch(...args);
      const text = await req.text();
      value.value = text.startsWith('{') || text.startsWith('[') ? JSON.parse(text) : text;
    }
  };

  return [value, refresh] as const;
}
