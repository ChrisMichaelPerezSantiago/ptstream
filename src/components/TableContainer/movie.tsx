import { useCallback, useEffect, useMemo } from "react";
import { Button, Spinner, Image } from "@nextui-org/react";
import { map, size, throttle, truncate } from "lodash";

import { MovieResult, UniqueMovie } from "../../types";

type TableContainerProps = {
  rows: MovieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueMovie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

const SCROLL_DELAY = 500; // Throttle delay in ms

export const TableContainer = ({
  rows,
  totalRecords,
  page,
  handleOpenModal,
  watchPage,
  emptyContentLabel,
  isLoading,
}: TableContainerProps) => {
  const hasMore = page < totalRecords;

  const renderUserCard = useCallback(
    (row: UniqueMovie) => {
      return (
        <div
          className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
          onClick={() => handleOpenModal(row)}
        >
          <Image
            alt={row.title}
            className="object-cover rounded-lg"
            height={120}
            width={80}
            src={`https://image.tmdb.org/t/p/w185${row.poster_path}`}
          />
          <div className="flex-1 ml-4">
            <p className="font-semibold text-gray-800 text-md">{row.title}</p>
            <p className="mt-1 text-sm text-gray-500">
              {truncate(row.overview, {
                length: 50,
                omission: "...",
              })}
            </p>
          </div>
        </div>
      );
    },
    [handleOpenModal]
  );

  const bottomContent = useMemo(() => {
    return hasMore && !isLoading ? (
      <div className="flex justify-center w-full mt-4">
        <Button
          isDisabled={isLoading}
          variant="flat"
          onPress={() => watchPage(page + 1)}
        >
          {isLoading && <Spinner color="default" size="sm" />}
          Load More
        </Button>
      </div>
    ) : null;
  }, [isLoading, page, totalRecords, watchPage]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollableHeight = document.documentElement.scrollHeight;
      const scrolled = window.innerHeight + window.scrollY;

      // Check if near the bottom of the page and if there are more pages to load
      if (scrolled >= scrollableHeight && hasMore && !isLoading) {
        watchPage(page + 1);
      }
    }, SCROLL_DELAY); // Throttle the function

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [hasMore, isLoading, page, watchPage]);

  const DataState = () =>
    map(rows, (row) => <div key={row.id}>{renderUserCard(row)}</div>);

  const EmptyState = () => (
    <div className="flex justify-center w-full">{emptyContentLabel}</div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && <Spinner color="default" size="sm" />}
        {size(rows) > 0 ? <DataState /> : <EmptyState />}
      </div>
      {bottomContent}
    </div>
  );
};
