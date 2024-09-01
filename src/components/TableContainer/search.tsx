import { Key, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Selection,
  SortDescriptor,
  Spinner,
} from "@nextui-org/react";
import { truncate } from "lodash";
import { PlayCircle } from "lucide-react";

import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import * as TableUtils from "../../toolkit/table";
import { SerieResult, UniqueSerie } from "../../types";

const INITIAL_VISIBLE_COLUMNS = ["name", "actions"];

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchInputSearch: (query: string) => void;
  emptyContentLabel: string;
  isLoading?: boolean;
};

export const TableContainer = ({
  rows,
  handleOpenModal,
  watchInputSearch,
  emptyContentLabel,
  isLoading,
}: TableContainerProps) => {
  const [visibleColumns, _] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });

  type Row = typeof rows[0];

  const headerColumns = useMemo(() => {
    return TableUtils.serieColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = useCallback((row: Row, columnKey: Key) => {
    const cellValue = row[columnKey as keyof Row];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `https://image.tmdb.org/t/p/w185${row.poster_path}`,
            }}
            description={truncate(row.overview, {
              length: 90,
              omission: "...",
            })}
            name={cellValue}
          >
            {row.first_air_date}
          </User>
        );

      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<PlayCircle className="w-4 h-4" />}
                  onClick={() => handleOpenModal(row)}
                >
                  Watch
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
  }, [visibleColumns, watchInputSearch, rows.length]);

  return (
    <Table
      isHeaderSticky
      bottomContentPlacement="inside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={rows}
        loadingContent={<Spinner color="default" />}
        emptyContent={emptyContentLabel}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
