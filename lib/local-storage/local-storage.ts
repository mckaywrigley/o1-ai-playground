// Retrieves an item from local storage and parses it as JSON
export function getLocalStorageItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return null;
  }
}

// Sets an item in local storage after stringifying it to JSON
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}
