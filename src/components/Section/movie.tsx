import { useEffect, useState } from "react";
import { Badge, Button, Image, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlayCircle,
  Star,
  Calendar,
  Globe,
  ThumbsUp,
  ArrowLeft,
} from "lucide-react";
import { map, merge, range, toUpper } from "lodash";

import { PromoResult, PromoReturnType, UniqueMovie } from "../../types";
import { moviesGenres } from "../../constants";
import { parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import useGetPromoById from "../../hooks/useGetPromoById";
import PlyrVideoPlayer from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";

type MovieSectionProps = {
  item: UniqueMovie;
};

type DefaultStateProps = {
  movie: UniqueMovie;
  onWatchNow: () => void;
  onWatchPromo: () => void;
};

type StreamingVideoProps = {
  movie: UniqueMovie;
  onBack: () => void;
};

const renderStars = (rating: number) => {
  return map(range(1, 5), (i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i <= rating / 2
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300 dark:text-gray-600"
      }`}
    />
  ));
};

const getGenreName = (id: number) => {
  return moviesGenres[id] || "Unknown";
};

const StreamingVideo = ({
  movie: { id, title, backdrop_path },
  onBack,
}: StreamingVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFloating] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 p-1 text-black transition-colors border rounded-full bg-gray-200/30 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/30 dark:text-white dark:border-gray-800/50 hover:bg-gray-200/40 dark:hover:bg-gray-800/40"
      >
        <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
      </button>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}

      {backdrop_path ? (
        <Banner
          srcImg={backdrop_path}
          alt={title}
          style={{
            height: 200,
            margin: 0,
            marginTop: 20,
          }}
        />
      ) : null}

      <div
        className={`container py-8 ${
          isFloating ? "animate-iframe-drop-effect" : ""
        }`}
      >
        <iframe
          src={`https://vidsrc.pro/embed/movie/${id}`}
          className="absolute w-full border-0 rounded-lg shadow-lg h-96"
          allowFullScreen
          allow="autoplay; fullscreen"
          frameBorder="0"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

const DefaultState = ({
  movie,
  onWatchNow,
  onWatchPromo,
}: DefaultStateProps) => {
  return (
    <div className="max-h-screen overflow-y-auto text-black dark:text-white">
      {movie.backdrop_path ? (
        <Banner srcImg={movie.backdrop_path} alt={movie.title} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {movie.poster_path ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + movie.poster_path}
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {movie.title && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {movie.title}
              </h1>
            )}
            {movie.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {movie.overview}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {map(movie.genre_ids, (genreId) => (
                <Badge
                  key={genreId}
                  className="text-black bg-gray-200 dark:bg-gray-700 dark:text-white"
                >
                  {getGenreName(genreId)}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(movie.vote_average)}
                {movie.vote_average && (
                  <span className="ml-2">{movie.vote_average.toFixed(1)}</span>
                )}
              </div>
              {movie.vote_count && (
                <span className="text-gray-700 dark:text-gray-300">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchNow}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchPromo}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Promo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Release Date: {parseDate(movie.release_date)}
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Language: {toUpper(movie.original_language)}
                </div>
              )}
              {movie.popularity && (
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Popularity: {movie.popularity.toFixed(2)}
                </div>
              )}
              {movie.adult && (
                <div className="flex items-center">
                  <Badge>Adult Content</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Section = ({ item }: MovieSectionProps) => {
  const [watchNow, setWatchNow] = useState(false);
  const [watchPromo, setWatchPromo] = useState(false);
  const [promo, setPromo] = useState<PromoResult>();
  const movie = item;

  const handleBack = () => {
    setWatchNow(false);
  };

  const { mutate: mutatePromo } = useGetPromoById({
    onSuccess: (data: PromoReturnType) => {
      setPromo(data.results);
    },
    onError: (error: Error) => {
      console.error("Error fetching promo by movie id:", error);
    },
  });

  // get promo for a particular movie
  useEffect(() => {
    if (movie.id) {
      mutatePromo({ id: `movie/${movie.id}` });
    }
  }, [movie.id]);

  return (
    <div className="relative">
      {watchPromo ? (
        <PlyrVideoPlayer
          promo={promo}
          onClosePlayer={() => setWatchPromo(false)}
        />
      ) : null}

      <AnimatePresence>
        {watchNow ? (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StreamingVideo movie={movie} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DefaultState
              movie={movie}
              onWatchNow={() => setWatchNow(true)}
              onWatchPromo={() => setWatchPromo(true)}
            />
          </motion.div>
        )}
        <FavoriteButton item={merge(item, { media_type: "movie" })} />
      </AnimatePresence>
    </div>
  );
};
