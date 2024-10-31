const storagePrefix = "";

const storage = {
  get: (key: string) => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}${key}`) as string
    );
  },
  set: (key: string, value: string) => {
    window.localStorage.setItem(
      `${storagePrefix}${key}`,
      JSON.stringify(value)
    );
  },
  clear: (key: string) => {
    window.localStorage.removeItem(`${storagePrefix}${key}`);
  },
};

export default storage;
