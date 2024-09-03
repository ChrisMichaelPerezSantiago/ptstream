import { useState, useCallback, Fragment, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@nextui-org/react";
import { set, unionBy } from "lodash";

import { MovieResult, MovieReturnType, UniqueMovie } from "../../../types";
import useMovies from "../../../hooks/useMovies";
import { MovieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection } from "../../Section";
import { RootState } from "../../../redux/store";

export default function MovieScene() {
  const [movies, setMovies] = useState<MovieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueMovie | undefined>();

  const genreChanged = useRef(false);

  const currentGenre = useSelector(
    (state: RootState) => state.genre.selectedGenre
  );

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

  const buildPayload = useCallback(() => {
    let payload = { page };
    if (currentGenre > 0) {
      set(payload, "with_genres", currentGenre);
    }
    return payload;
  }, [page, currentGenre]);

  const reset = () => {
    setMovies([]);
    setPage(1);
  };

  useEffect(() => {
    if (currentGenre > 0 || page > 0) {
      if (genreChanged.current) {
        reset();
      }

      genreChanged.current = false;
      mutateMovies(buildPayload());
    }
  }, [currentGenre, page, buildPayload, mutateMovies]);

  useEffect(() => {
    if (currentGenre > 0) {
      genreChanged.current = true;
    }
  }, [currentGenre]);

  const isLoading = status === "pending";

  return (
    <Fragment>
      <MovieTableContainer
        isLoading={isLoading}
        rows={movies}
        totalRecords={totalRecords}
        page={page}
        watchPage={setPage}
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
