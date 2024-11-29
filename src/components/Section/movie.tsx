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
  Minimize2,
  Maximize2,
} from "lucide-react";
import { join, map, merge, range, toUpper } from "lodash";
import { useTranslation } from "react-i18next";

import { PromoResult, PromoReturnType, UniqueMovie } from "../../types";
import { parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import useGetPromoById from "../../hooks/useGetPromoById";
import PlyrVideoPlayer from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";
import { useFullscreen } from "../../hooks/useFullscreen";
import SeoContainer from "../SeoContainer";

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

const StreamingVideo = ({ movie: { id }, onBack }: StreamingVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFloating] = useState(true);

  const { toggleFullscreen, isFullscreen } = useFullscreen();

  const onLoad = () => setIsLoading(false);
  const src = `https://vidsrc.pro/embed/movie/${id}`;

  return (
    <div className="fixed inset-0 text-black bg-black dark:text-white">
      <div className="absolute z-10 flex gap-2 top-4 right-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 p-1 text-white transition-colors border rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => toggleFullscreen()}
          className="flex items-center justify-center w-8 h-8 p-1 text-white transition-colors border rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-white" />
          ) : (
            <Maximize2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}

      <div
        className={`relative w-full h-full ${
          isFloating ? "animate-iframe-drop-effect" : ""
        }`}
      >
        <iframe
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={onLoad}
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
  const { t } = useTranslation();

  const genreKeywords = join(
    map(movie.genre_ids, (genreId) => t(`${genreId}`)),
    ", "
  );

  return (
    <div className="max-h-screen overflow-y-auto text-black dark:text-white">
      <SeoContainer
        title={movie.title}
        description={movie.overview}
        keywords={genreKeywords}
      />

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
                  {t(`${genreId}`)}
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
                  ({movie.vote_count.toLocaleString()}{" "}
                  {t("Movie_DefaultState_Votes")})
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchNow}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {t("Movie_ChapterState_WatchNow")}
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchPromo}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {t("Movie_DefaultState_WatchPromo")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("Movie_DefaultState_ReleaseDate")}:{" "}
                  {parseDate(movie.release_date)}
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  {t("Movie_DefaultState_Language")}:{" "}
                  {toUpper(movie.original_language)}
                </div>
              )}
              {movie.popularity && (
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {t("Movie_DefaultState_Popularity")}:{" "}
                  {movie.popularity.toFixed(2)}
                </div>
              )}
              {movie.adult && (
                <div className="flex items-center">
                  <Badge>{t("AdultContent")}</Badge>
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
        {!!watchNow ? null : (
          <FavoriteButton item={merge(item, { media_type: "movie" })} />
        )}
      </AnimatePresence>
    </div>
  );
};
