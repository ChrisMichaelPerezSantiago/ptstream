import { has, omit, orderBy } from 'lodash';

const STORAGE_KEY = 'my-favorites';

// Retrieve the current list of liked items from local storage
const getLikedItems = () => {
  const items = localStorage.getItem(STORAGE_KEY);
  return items ? JSON.parse(items) : {};
};

// Add a new item to the list of liked items
const addLikedItem = (item: any) => {
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
};

// Remove an item from the list of liked items
const removeLikedItem = (itemId: number) => {
  const likedItems = getLikedItems();

  // Remove the item by its ID
  const updatedItems = omit(likedItems, itemId);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
};

// Check if an item is already liked
const isItemLiked = (itemId: number) => {
  const likedItems = getLikedItems();
  return has(likedItems, itemId);
};

// Get all liked items ordered by the timestamp (most recent first)
const getAllLikedItems = () => {
  const likedItems = getLikedItems();

  // Convert the object to an array and order by the likedAt timestamp
  const likedItemsArray = Object.values(likedItems);

  return orderBy(likedItemsArray, ['likedAt'], ['desc']);
};

export { addLikedItem, removeLikedItem, isItemLiked, getAllLikedItems };
