import { useState, useEffect } from "react";
import { Heart, HeartCrack } from "lucide-react";
import { motion } from "framer-motion";
import * as MyFavLocalStorage from "../../toolkit/MyFavLocalStorage";

type FavoriteButtonProps = {
  item: any;
};

const FavoriteButton = ({ item }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the item is already liked when the component mounts
    setIsFavorite(MyFavLocalStorage.isItemLiked(item.id));
  }, [item.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      MyFavLocalStorage.removeLikedItem(item.id);
    } else {
      MyFavLocalStorage.addLikedItem(item);
    }
    setIsFavorite(!isFavorite);
  };
  return (
    <motion.button
      className={`fixed z-50 bottom-4 right-4 p-2 rounded-full ${
        isFavorite ? "border-red-500 bg-white" : "border-black bg-white"
      } shadow-lg transition-colors duration-500 focus:outline-none`}
      onClick={toggleFavorite}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isFavorite ? 1.2 : 1 }}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isFavorite ? (
          <Heart color="red" className="w-4 h-4 text-red-500" />
        ) : (
          <HeartCrack color="black" className="w-4 h-4 text-black" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default FavoriteButton;
