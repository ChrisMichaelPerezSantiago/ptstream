import React, { useCallback, useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { chain, compact, map, size, sortBy } from "lodash";
import { useTranslation } from "react-i18next";

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

    const genresObject =
      currentScene === "series" ? tvSeriesGenres : moviesGenres;
    const genresArray = Object.entries(genresObject);
    const reorderedGenres = sortBy(genresArray, ([id]) => (id === "0" ? 1 : 0));

    const selectedKeys = useMemo(() => {
      return selectedGenre ? map([selectedGenre], (key) => key.toString()) : [];
    }, [selectedGenre]);

    const handleGenreChange = useCallback(
      (key: string | null) => {
        onGenreChange(key ? Number(key) : null);
      },
      [onGenreChange]
    );

    return (
      <div className="w-full max-w-xs mx-auto">
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
