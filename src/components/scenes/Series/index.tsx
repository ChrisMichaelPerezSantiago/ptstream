import { useState, useCallback, Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@nextui-org/react";
import { unionBy, set } from "lodash";

import { SerieResult, SerieReturnType, UniqueSerie } from "../../../types";
import useSeries from "../../../hooks/useSeries";
import { SerieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { SerieSection } from "../../Section";
import { RootState } from "../../../redux/store";

export default function SerieScene() {
  const [series, setSeries] = useState<SerieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueSerie | undefined>();

  const genreChanged = useRef(false);

  const currentGenre = useSelector(
    (state: RootState) => state.genre.selectedGenre
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (recordSelected: UniqueSerie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const { mutate: mutateSeries, status } = useSeries({
    onSuccess: (data: SerieReturnType) => {
      setSeries((prev) => unionBy([...prev, ...data.results], "id"));
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useSeries] error", error);
    },
  });

  const reset = () => {
    setSeries([]);
    setPage(1);
  };

  const buildPayload = useCallback(() => {
    const payload = { page };
    if (currentGenre > 0) {
      reset();
      set(payload, "with_genres", currentGenre);
    }
    return payload;
  }, [page, currentGenre]);

  useEffect(() => {
    if (currentGenre > 0 || page > 0) {
      if (genreChanged.current) {
        reset();
      }

      genreChanged.current = false;
      mutateSeries(buildPayload());
    }
  }, [currentGenre, page, buildPayload, mutateSeries]);

  useEffect(() => {
    if (currentGenre > 0) {
      genreChanged.current = true;
    }
  }, [currentGenre]);

  const isLoading = status === "pending";

  return (
    <Fragment>
      <SerieTableContainer
        isLoading={isLoading}
        rows={series}
        totalRecords={totalRecords}
        page={page}
        watchPage={setPage}
        handleOpenModal={handleOpenModal}
        emptyContentLabel="No series found"
      />

      <ModalContainer
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={<SerieSection item={record} />}
        children={null}
      />
    </Fragment>
  );
}
