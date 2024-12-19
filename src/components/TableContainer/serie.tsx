import { useCallback, useEffect } from "react";
import { Spinner, Image } from "@nextui-org/react";
import { map, size, throttle, truncate } from "lodash";

import { SerieResult, UniqueSerie } from "../../types";

const SCROLL_DELAY = 500; // Throttle delay in ms

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

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
    (row: UniqueSerie) => {
      return (
        <div
          className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
          onClick={() => handleOpenModal(row)}
        >
          <Image
            alt={row.name}
            className="object-cover rounded-lg"
            src={`https://image.tmdb.org/t/p/w185${row.poster_path}`}
            fallbackSrc="https://via.placeholder.com/300x300"
            height={120}
            width={80}
          />
          <div className="flex-1 ml-4">
            <p className="font-semibold text-gray-800 text-md">{row.name}</p>
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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner color="default" size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {size(rows) > 0 ? <DataState /> : <EmptyState />}
        </div>
      )}
    </div>
  );
};
