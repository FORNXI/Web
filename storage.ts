export type SavedItemType = 'code' | 'image' | 'chat' | 'expert';

export interface SavedItem {
  id: string;
  type: SavedItemType;
  title: string;
  content: string;
  timestamp: number;
}

const STORAGE_KEY = 'nexus_ai_library';

export function saveToLibrary(type: SavedItemType, title: string, content: string) {
  const items = getLibraryItems();
  const newItem: SavedItem = {
    id: Math.random().toString(36).substring(2, 11),
    type,
    title,
    content,
    timestamp: Date.now(),
  };
  const updatedItems = [newItem, ...items];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  return newItem;
}

export function getLibraryItems(): SavedItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function removeFromLibrary(id: string) {
  const items = getLibraryItems();
  const updatedItems = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
}
