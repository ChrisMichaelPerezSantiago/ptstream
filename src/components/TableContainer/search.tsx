import { useCallback, useMemo } from "react";
import { Spinner, Image, Input } from "@nextui-org/react";
import { get, map, size, truncate } from "lodash";

import { SerieResult, UniqueSerie } from "../../types";
import { SearchIcon } from "../Icons/SearchIcon";

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchInputSearch: (query: string) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = ({
  rows,
  handleOpenModal,
  watchInputSearch,
  emptyContentLabel,
  isLoading,
}: TableContainerProps) => {
  const renderUserCard = useCallback(
    (row: UniqueSerie) => {
      return (
        <div
          className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
          onClick={() => handleOpenModal(row)}
        >
          <Image
            alt={get(row, "name", null) || get(row, "title", null)}
            className="object-cover rounded-lg"
            height={120}
            width={80}
            src={`https://image.tmdb.org/t/p/w185${get(row, "poster_path")}`}
          />
          <div className="flex-1 ml-4">
            <p className="font-semibold text-gray-800 text-md">
              {get(row, "name", null) || get(row, "title", null)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {truncate(get(row, "overview", null), {
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

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            onValueChange={(value) => watchInputSearch(value)}
          />
        </div>
      </div>
    );
  }, [watchInputSearch]);

  const DataState = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {map(rows, (row) => (
        <div key={row.id}>{renderUserCard(row)}</div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex justify-center w-full">{emptyContentLabel}</div>
  );

  const LoadingState = () => (
    <div className="flex justify-center w-full mt-20">
      <Spinner color="default" size="sm" />
    </div>
  );

  const mainClass = size(rows) > 0 ? "mt-4" : "mt-20";

  return (
    <div>
      {topContent}
      {isLoading && <LoadingState />}
      <div className={mainClass}>
        {size(rows) > 0 ? <DataState /> : <EmptyState />}
      </div>
    </div>
  );
};
