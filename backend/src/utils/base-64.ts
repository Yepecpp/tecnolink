export function jsonToBase64(object: object) {
  const json = JSON.stringify(object);
  return btoa(json);
}
export function base64ToJson(base64String: string) {
  const json = atob(base64String);
  return JSON.parse(json);
}
