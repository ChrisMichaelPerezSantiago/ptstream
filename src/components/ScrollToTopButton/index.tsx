import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { Effect, pipe } from "effect";

type ScrollToTopButtonProps = {};

const ScrollToTopButton = ({}: ScrollToTopButtonProps) => {
  const handleScrollToTop = () =>
    pipe(
      Effect.sync(() => ({
        top: 0,
        behavior: "smooth" as const,
      })),
      Effect.tap((scrollOptions) =>
        Effect.sync(() => window.scrollTo(scrollOptions))
      ),
      Effect.runSync
    );

  return (
    <motion.button
      className={`fixed right-10 bottom-20 z-50 p-2 bg-white rounded-full border-black shadow-lg transition-colors duration-500 focus:outline-none`}
      onClick={handleScrollToTop}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.2 }}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ArrowUp color="black" className="w-4 h-4 text-black" />
      </motion.div>
    </motion.button>
  );
};

export default ScrollToTopButton;
