export const env: Record<string, any> = {};

export function setEnv(value) {
  Object.assign(env, value);
}
