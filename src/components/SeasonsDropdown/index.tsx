import { useState, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
} from "@nextui-org/react";
import { chain, get, map, size } from "lodash";

import useGetSeasonById from "../../hooks/useGetSeasonById";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { Seasons, SerieSeasonsResult, UniqueSerieSeason } from "../../types";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import { parseDate } from "../../toolkit/serie";

type SeriesDropdownProps = {
  id: number;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

export default function SeriesDropdown({
  id,
  watchChapter,
}: SeriesDropdownProps) {
  const [seasons, setSeasons] = useState<Seasons>([]);
  const [chapters, setChapters] = useState<any>(null);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>();
  const [selectedSeason, setSelectedSeason] = useState<UniqueSerieSeason>(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>();

  const { mutate: mutateSeasons } = useGetSeasonById({
    onSuccess: (data: SerieSeasonsResult) => {
      const listOfSeasons = chain(get(data, "seasons", []))
        .filter((season) => season.name !== "Specials") // remove specials season
        .value();
      setSeasons(listOfSeasons);
    },
    onError: (error: Error) => {
      console.error("Error fetching season by id:", error);
    },
  });

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data: any) => {
      setChapters(data);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
    },
  });

  // call mutation as soon selecting a serie
  useEffect(() => {
    mutateSeasons(id);
  }, [id, mutateSeasons]);

  useEffect(() => {
    if (selectedSeason) {
      mutateChapter({
        serieId: id,
        seasonId: selectedSeasonIndex,
      });
    }
  }, [selectedSeason, selectedSeasonIndex, mutateChapter]);

  // watch chapter when selecting a season in the serie (default state)
  // pass seasonId and chapterId to watchChapter
  useEffect(() => {
    if (selectedSeason && selectedSeasonIndex && selectedChapterNumber) {
      watchChapter(id, selectedSeasonIndex, selectedChapterNumber);
    }
  }, [selectedSeason, selectedSeasonIndex, selectedChapterNumber]);

  const handleSeasonSelect = useCallback((season: any, seasonIndex: number) => {
    setSelectedSeason(season);
    setSelectedSeasonIndex(seasonIndex);
    setSelectedChapterNumber(null);
  }, []);

  const handleChapterSelect = useCallback((chapter: any) => {
    setSelectedChapterNumber(chapter);
  }, []);

  return (
    <div className="flex space-x-4">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            endContent={<ChevronDownIcon className="text-xl" />}
          >
            {selectedSeason ? selectedSeason.name : "Seasons"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" className="overflow-y-auto max-h-60">
          {map(seasons, (season, index) => (
            <DropdownItem
              key={season.id}
              description={`${season.episode_count} episodes`}
              startContent={
                <User
                  avatarProps={{
                    radius: "lg",
                    src: `https://image.tmdb.org/t/p/w185${season.poster_path}`,
                    title: season.name,
                  }}
                />
              }
              onClick={() => handleSeasonSelect(season, index + 1)} // index + 1  equal season
            >
              {season.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {selectedSeason && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              endContent={<ChevronDownIcon className="text-xl" />}
            >
              {selectedChapterNumber ? selectedChapterNumber : "Chapters"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" className="overflow-y-auto max-h-60">
            {map(
              Array.from(
                { length: size(get(chapters, "episodes")) },
                (_, i) => i + 1
              ),
              (chapter) => (
                <DropdownItem
                  key={chapter}
                  description={`${parseDate(
                    get(chapters, "episodes")[chapter - 1].air_date
                  )}`}
                  startContent={
                    <User
                      avatarProps={{
                        radius: "lg",
                        src: `https://image.tmdb.org/t/p/w185${
                          get(chapters, "episodes")[chapter - 1].still_path
                        }`,
                        title: get(chapters, "episodes")[chapter - 1].name,
                      }}
                    />
                  }
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {get(chapters, "episodes")[chapter - 1].name}
                </DropdownItem>
              )
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
