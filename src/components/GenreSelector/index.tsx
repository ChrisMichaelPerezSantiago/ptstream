import React, { useCallback, useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { map, sortBy } from "lodash";
import { useTranslation } from "react-i18next";
import { Effect, pipe } from "effect";

import { RootState } from "../../redux/store";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import { moviesGenres, tvSeriesGenres } from "../../constants";

type GenreSelectorProps = {
  selectedGenre: number | null;
  onGenreChange: (genre: number | null) => void;
};

const GenreSelector: React.FC<GenreSelectorProps> = React.memo(
  ({ selectedGenre, onGenreChange }) => {
    const { t } = useTranslation();

    const currentScene = useSelector(
      (state: RootState) => state.scene.currentScene
    );

    const getGenres = pipe(
      Effect.sync(() =>
        currentScene === "series" ? tvSeriesGenres : moviesGenres
      ),
      Effect.map((genres) => Object.entries(genres)),
      Effect.map((entries) => sortBy(entries, ([id]) => (id === "0" ? 1 : 0))),
      Effect.runSync
    );

    const selectedKeys = useMemo(
      () =>
        pipe(
          Effect.sync(() => selectedGenre),
          Effect.map((genre) =>
            genre ? map([genre], (key) => key.toString()) : []
          ),
          Effect.runSync
        ),
      [selectedGenre]
    );

    const handleGenreChange = useCallback(
      (key: string | null) =>
        pipe(
          Effect.sync(() => key),
          Effect.map((k) => (k ? Number(k) : null)),
          Effect.tap((genre) => Effect.sync(() => onGenreChange(genre))),
          Effect.runSync
        ),
      [onGenreChange]
    );

    const reorderedGenres = getGenres;

    return (
      <div className="mx-auto w-full max-w-xs">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              style={{
                padding: "4px",
                minWidth: "auto",
                width: "32px",
                height: "32px",
              }}
            >
              <VerticalDotsIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedKeys}
            onAction={handleGenreChange}
            selectionMode="single"
            className="max-h-[300px] overflow-y-auto"
          >
            {map(reorderedGenres, ([id, genre]) => (
              <DropdownItem
                key={id}
                value={id}
                className={id === "0" ? "text-red-500" : ""}
              >
                {t(id)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
);

export default GenreSelector;
