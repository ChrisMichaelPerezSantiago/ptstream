import { useCallback, useState } from "react";
import { Badge, Button, Image } from "@nextui-org/react";
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
import { chain, get, map, range, toUpper } from "lodash";

import { UniqueSerie } from "../../types";
import { tvSeriesGenres } from "../../constants";
import SeriesDropdown from "../../components/SeasonsDropdown";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import { formatRuntime } from "../../toolkit/serie";

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
  onWatchNow: () => void;
};

type StreamingVideoProps = {
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
  serieId,
  seasonId,
  episodeId,
  onBack,
}: StreamingVideoProps) => {
  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 p-1 text-white transition-colors bg-black rounded-full dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg aspect-video">
          <iframe
            src={`https://vidsrc.pro/embed/tv/${serieId}/${seasonId}/${episodeId}`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; fullscreen"
            style={{ borderRadius: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

const ChapterState = ({ chapter, onWatchNow }: ChapterStateProps) => {
  return (
    <div className="text-black dark:text-white">
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
                  Air Date: {chapter.air_date}
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
    <div className="text-black dark:text-white">
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
              {/* <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchNow}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Now
              </Button> */}
              <SeriesDropdown id={serie.id} watchChapter={watchChapter} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {serie.first_air_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  First Air Date: {serie.first_air_date}
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
  const [serieId, setSerieId] = useState<number>();
  const [seasonId, setSeasonId] = useState<number>();
  const [episodeId, setEpisodeId] = useState<number>();
  const [chapter, setChapter] = useState<any>(null);
  const serie = item;

  const handleBack = () => {
    setWatchNow(false);
  };

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data: any) => {
      setChapter(data);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
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

  return (
    <div className="relative">
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
            {!chapter ? (
              <DefaultState
                serie={serie}
                onWatchNow={() => setWatchNow(true)}
                watchChapter={(serieId, seasonId, episodeId) =>
                  watchChapter(serieId, seasonId, episodeId)
                }
              />
            ) : (
              <ChapterState
                chapter={episode}
                onWatchNow={() => setWatchNow(true)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
