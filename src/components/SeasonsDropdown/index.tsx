import { useState, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
} from "@nextui-org/react";
import { get, map } from "lodash";

import useGetSeasonById from "../../hooks/useGetSeasonById";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { Seasons, SerieSeasonsResult, UniqueSerieSeason } from "../../types";

type SeriesDropdownProps = {
  id: number;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

export default function SeriesDropdown({
  id,
  watchChapter,
}: SeriesDropdownProps) {
  const [seasons, setSeasons] = useState<Seasons>([]);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>();
  const [selectedSeason, setSelectedSeason] = useState<UniqueSerieSeason>(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>();

  const { mutate: mutateSeasons } = useGetSeasonById({
    onSuccess: (data: SerieSeasonsResult) => {
      setSeasons(get(data, "seasons", []));
    },
    onError: (error: Error) => {
      console.error("Error fetching season by id:", error);
    },
  });

  // call mutation as soon selecting a serie
  useEffect(() => {
    mutateSeasons(id);
  }, [id, mutateSeasons]);

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
              onClick={() => handleSeasonSelect(season, index)} // index + 1  equal season
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
                { length: selectedSeason.episode_count },
                (_, i) => i + 1
              ),
              (chapter) => (
                <DropdownItem
                  key={chapter}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {chapter}
                </DropdownItem>
              )
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
