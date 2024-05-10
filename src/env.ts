export const env: Record<string, any> = Object.fromEntries(
  Object.entries((import.meta as any).env).map(([k, v]) => [k.replace('VITE_', ''), v]),
);

export function setEnv(value) {
  Object.assign(env, value);
}
