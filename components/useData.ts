import { ref } from 'vue';

export function useData<T>(...p: Parameters<typeof fetch>) {
  const value = ref(null);
  const refresh = async () => {
    const req = await fetch(...p);
    value.value = await req.json();
  };

  return [value, refresh];
}
