import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";

import * as ChaptersWatchedLocalStorage from "../../toolkit/ChaptersWatchedLocalStorage";

type ChapterWatchedButtonProps = {
  item: {
    serieId: number;
    seasonId: number;
    episodeId: number;
  };
};

const ChapterWatchedButton = ({ item }: ChapterWatchedButtonProps) => {
  const [isWatched, setIsWatched] = useState(false);

  // Generate a unique key based on serieId, seasonId, and episodeId
  const chapterKey = `${item.serieId}_${item.seasonId}_${item.episodeId}`;

  useEffect(() => {
    // Check if the chapter is already watched when the component mounts
    setIsWatched(ChaptersWatchedLocalStorage.wasChapterSeen(item));
  }, [chapterKey]);

  const toggleWatched = () => {
    if (isWatched) {
      ChaptersWatchedLocalStorage.removeChapterWatchedItem(item);
    } else {
      ChaptersWatchedLocalStorage.addChapterWatchedItem(item);
    }
    setIsWatched(!isWatched);
  };

  return (
    <motion.button
      className={`fixed z-50 bottom-4 right-14 p-2 rounded-full ${
        isWatched ? "border-green-500 bg-white" : "border-black bg-white"
      } shadow-lg transition-colors duration-500 focus:outline-none`}
      onClick={toggleWatched}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isWatched ? 1.2 : 1 }}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isWatched ? (
          <Tooltip content="Marked as watched">
            <Eye className="w-4 h-4 text-green-500" />
          </Tooltip>
        ) : (
          <Tooltip content="Mark as watched">
            <EyeOff className="w-4 h-4 text-black" />
          </Tooltip>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ChapterWatchedButton;
