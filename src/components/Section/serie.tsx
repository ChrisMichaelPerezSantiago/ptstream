import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Image, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlayCircle,
  Star,
  Calendar,
  Clock,
  Globe,
  ThumbsUp,
  ArrowLeft,
} from "lucide-react";
import { chain, get, map, merge, range, toUpper } from "lodash";

import { PromoResult, PromoReturnType, UniqueSerie } from "../../types";
import { tvSeriesGenres } from "../../constants";
import SeriesDropdown from "../../components/SeasonsDropdown";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import useGetPromoById from "../../hooks/useGetPromoById";
import { formatRuntime, parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import PlyrVideoPlayer from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";

type SerieSectionProps = {
  item: UniqueSerie;
};

type DefaultStateProps = {
  serie: UniqueSerie;
  onWatchNow: () => void;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

type ChapterStateProps = {
  chapter: any;
  serie: UniqueSerie;
  onWatchNow: () => void;
  onBack: () => void;
};

type StreamingVideoProps = {
  serie: UniqueSerie;
  serieId: number;
  seasonId: number;
  episodeId: number;
  onBack: () => void;
};

const renderStars = (rating: number) => {
  return map(range(1, 6), (i) => (
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
  return tvSeriesGenres[id] || "Unknown";
};

const StreamingVideo = ({
  serie,
  serieId,
  seasonId,
  episodeId,
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

      {serie.backdrop_path ? (
        <Banner
          srcImg={serie.backdrop_path}
          alt={serie.name}
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
          src={`https://vidsrc.pro/embed/tv/${serieId}/${seasonId}/${episodeId}`}
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

const ChapterState = ({
  chapter,
  serie,
  onWatchNow,
  onBack,
}: ChapterStateProps) => {
  return (
    <div className="max-h-screen overflow-y-auto text-black dark:text-white">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 p-1 text-black transition-colors border rounded-full bg-gray-200/30 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/30 dark:text-white dark:border-gray-800/50 hover:bg-gray-200/40 dark:hover:bg-gray-800/40"
      >
        <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
      </button>

      {serie.backdrop_path ? (
        <Banner srcImg={serie.backdrop_path} alt={chapter.name} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {chapter.still_path ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + chapter.still_path}
                alt={chapter.name}
                className="object-cover w-full h-56 rounded-lg shadow-lg lg:h-auto"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {chapter.name && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {chapter.name}
              </h1>
            )}
            {chapter.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {chapter.overview}
                </p>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(chapter.vote_average)}
                {chapter.vote_average && (
                  <span className="ml-2">
                    {chapter.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              {chapter.vote_count && (
                <span className="text-gray-700 dark:text-gray-300">
                  ({chapter.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
            {onWatchNow ? (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onWatchNow}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {chapter.air_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Air Date: {parseDate(chapter.air_date)}
                </div>
              )}
              {chapter.runtime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Runtime: {formatRuntime(chapter.runtime)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultState = ({
  serie,
  onWatchNow,
  watchChapter,
}: DefaultStateProps) => {
  return (
    <div className="max-h-screen overflow-y-auto text-black dark:text-white">
      {serie.backdrop_path ? (
        <Banner srcImg={serie.backdrop_path} alt={serie.name} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {serie.poster_path ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + serie.poster_path}
                alt={serie.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {serie.name && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {serie.name}
              </h1>
            )}
            {serie.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {serie.overview}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {map(serie.genre_ids, (genreId) => (
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
                {renderStars(serie.vote_average)}
                {serie.vote_average && (
                  <span className="ml-2">{serie.vote_average.toFixed(1)}</span>
                )}
              </div>
              {serie.vote_count && (
                <span className="text-gray-700 dark:text-gray-300">
                  ({serie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchNow}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Promo
              </Button>
              <SeriesDropdown id={serie.id} watchChapter={watchChapter} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {serie.first_air_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  First Air Date: {parseDate(serie.first_air_date)}
                </div>
              )}
              {serie.original_language && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Language: {toUpper(serie.original_language)}
                </div>
              )}
              {serie.popularity && (
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Popularity: {serie.popularity.toFixed(2)}
                </div>
              )}
              {serie.adult && (
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

export const Section = ({ item }: SerieSectionProps) => {
  const [watchNow, setWatchNow] = useState(false);
  const [watchPromo, setWatchPromo] = useState(false);
  const [backToSeason, setBackToSeason] = useState(false);
  const [serieId, setSerieId] = useState<number>();
  const [seasonId, setSeasonId] = useState<number>();
  const [episodeId, setEpisodeId] = useState<number>();
  const [chapter, setChapter] = useState<any>(null);
  const [promo, setPromo] = useState<PromoResult>();
  const serie = item;

  const handleBack = () => {
    setWatchNow(false);
  };

  const handleBackToSeason = () => {
    setBackToSeason(true);
  };

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data: any) => {
      setChapter(data);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
    },
  });

  const { mutate: mutatePromo } = useGetPromoById({
    onSuccess: (data: PromoReturnType) => {
      setPromo(data.results);
    },
    onError: (error: Error) => {
      console.error("Error fetching promo by season id:", error);
    },
  });

  const watchChapter = useCallback(
    (serieId: number, seasonId: number, episodeId: number) => {
      setSerieId(serieId);
      setSeasonId(seasonId);
      setEpisodeId(episodeId);

      mutateChapter({
        serieId: serieId,
        seasonId: seasonId,
      });
    },
    [mutateChapter]
  );

  const episode = chain(get(chapter, "episodes", []))
    .find((episode) => episode && episode.episode_number === episodeId)
    .value();

  const reset = () => {
    setWatchNow(false);
    setBackToSeason(false);
    setChapter(null);
    setEpisodeId(null);
    setSeasonId(null);
    setSerieId(null);
  };

  // get promo for a particular serie
  useEffect(() => {
    if (serie.id) {
      mutatePromo({ id: `tv/${serie.id}` });
    }
  }, [serie.id]);

  // reset state when back to season
  useEffect(() => {
    if (backToSeason) {
      reset();
    }
  }, [backToSeason]);

  return (
    <div className="relative">
      {watchPromo ? (
        <motion.div
          key="streaming"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PlyrVideoPlayer
            promo={promo}
            onClosePlayer={() => setWatchPromo(false)}
          />
        </motion.div>
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
            <StreamingVideo
              serie={serie}
              serieId={serieId}
              seasonId={seasonId}
              episodeId={episodeId}
              onBack={handleBack}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {!chapter || backToSeason ? (
              <DefaultState
                serie={serie}
                onWatchNow={() => setWatchPromo(true)}
                watchChapter={(serieId, seasonId, episodeId) =>
                  watchChapter(serieId, seasonId, episodeId)
                }
              />
            ) : (
              <ChapterState
                chapter={episode}
                serie={serie}
                onWatchNow={() => setWatchNow(true)}
                onBack={handleBackToSeason}
              />
            )}
          </motion.div>
        )}
        <FavoriteButton item={merge(item, { media_type: "tv" })} />
      </AnimatePresence>
    </div>
  );
};
