import { useState, useCallback, Fragment } from "react";
import { useDisclosure } from "@nextui-org/react";
import { unionBy } from "lodash";

import { MovieResult, MovieReturnType, UniqueMovie } from "../../../types";
import useMovies from "../../../hooks/useMovies";
import { MovieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection } from "../../Section";

export default function MovieScene() {
  const [movies, setMovies] = useState<MovieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueMovie | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (recordSelected: UniqueMovie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const { mutate: mutateMovies, status } = useMovies({
    onSuccess: (data: MovieReturnType) => {
      setMovies((prev) => unionBy([...prev, ...data.results], "id"));
      setPage(data.page);
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useMovies] error", error);
    },
  });

  const watchPage = useCallback(
    (page: number) => {
      mutateMovies({ page: page });
    },
    [mutateMovies]
  );

  const isLoading = status === "pending";

  return (
    <Fragment>
      <MovieTableContainer
        isLoading={isLoading}
        rows={movies}
        totalRecords={totalRecords}
        page={page}
        watchPage={watchPage}
        handleOpenModal={handleOpenModal}
        emptyContentLabel="No movies found"
      />

      <ModalContainer
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={<MovieSection item={record} />}
        children={null}
      />
    </Fragment>
  );
}
