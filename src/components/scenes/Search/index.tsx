import { useState, useCallback, Fragment } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { debounce, size } from "lodash";

import useSearch from "../../../hooks/useSearch";
import { SearchTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";

const DefaultState = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="flex-col items-center">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight">
        Start your search
      </h2>
    </div>
    <p className="max-w-md mb-6 text-default-500">
      Find what you're looking for by searching our extensive database of movies
      and series.
    </p>
    <div className="text-sm text-default-500">
      <p>Try searching for:</p>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {[
          "Harry Potter",
          "The Lord of the Rings",
          "Game of Thrones",
          "Breaking Bad",
        ].map((term) => (
          <Chip key={term} variant="flat" color="default">
            {term}
          </Chip>
        ))}
      </div>
    </div>
  </div>
);

export default function SerieScene() {
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showScrollToTop = size(records) >= 100;

  const { mutate: mutateSearch, status } = useSearch({
    onSuccess: (data) => {
      setRecords(data.results);
      setPage(data.page);
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useSeries] error", error);
    },
  });

  const handleOpenModal = (recordSelected) => {
    setRecord(recordSelected);
    onOpen();
  };

  const watchInputSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setRecords([]);
        setPage(1);
        setTotalRecords(0);
        return;
      }
      mutateSearch({ q: searchQuery });
    }, 500),
    [mutateSearch]
  );

  const isLoading = status === "pending";

  const scenes = {
    movie: {
      component: <MovieSection item={record} />,
    },
    tv: {
      component: <SerieSection item={record} />,
    },
  };

  return (
    <Fragment>
      <SearchTableContainer
        isLoading={isLoading}
        rows={records}
        totalRecords={totalRecords}
        page={page}
        watchInputSearch={watchInputSearch}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={<DefaultState />}
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={scenes[record.media_type].component}
          children={null}
        />
      ) : null}
    </Fragment>
  );
}
