import { has, omit, orderBy } from 'lodash';
import { Effect } from 'effect'

const STORAGE_KEY = 'my-favorites';

// Retrieve the current list of liked items from local storage
const getLikedItems = () => {
  return Effect.try({
    try: () => {
      const likedItems = localStorage.getItem(STORAGE_KEY);
      return likedItems ? JSON.parse(likedItems) : {};
    },
    catch: (error: Error) => {
      console.error('[LocalStorage/getLikedItems] Error: ', error);
      return {};
    },
  }).pipe(Effect.runSync);
};

// Add a new item to the list of liked items
const addLikedItem = (item: any) => {
  return Effect.try({
    try: () => {
      const likedItems = getLikedItems();

      // Preserve existing data and add the new item with a timestamp
      const updatedItems = {
        ...likedItems,
        [item.id]: {
          ...item,
          likedAt: new Date().toISOString()
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    },
    catch: (error: Error) => {
      console.error('[LocalStorage/addLikedItem] Error: ', error);
    },
  }).pipe(Effect.runSync);
};

// Remove an item from the list of liked items
const removeLikedItem = (itemId: number) => {
  return Effect.try({
    try: () => {
      const likedItems = getLikedItems();

      // Remove the item by its ID
      const updatedItems = omit(likedItems, itemId);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    },
    catch: (error: Error) => {
      console.error('[LocalStorage/removeLikedItem] Error: ', error);
    },
  }).pipe(Effect.runSync);
};

// Check if an item is already liked
const isItemLiked = (itemId: number) => {
  return Effect.try({
    try: () => {
      const likedItems = getLikedItems();
      return has(likedItems, itemId);
    },
    catch: (error: Error) => {
      console.error('[LocalStorage/isItemLiked] Error: ', error);
      return false;
    },
  }).pipe(Effect.runSync);
};

// Get all liked items ordered by the timestamp (most recent first)
const getAllLikedItems = () => {
  return Effect.try({
    try: () => {
      const likedItems = getLikedItems();

      // Convert the object to an array and order by the likedAt timestamp
      const likedItemsArray = Object.values(likedItems);

      return orderBy(likedItemsArray, ['likedAt'], ['desc']);
    },
    catch: (error: Error) => {
      console.error('[LocalStorage/getAllLikedItems] Error: ', error);
      return [];
    },
  }).pipe(Effect.runSync);
};

export { addLikedItem, removeLikedItem, isItemLiked, getAllLikedItems };
