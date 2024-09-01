import { useState, useCallback, Fragment } from "react";
import { useDisclosure } from "@nextui-org/react";
import { unionBy } from "lodash";

import { SerieResult, SerieReturnType, UniqueSerie } from "../../../types";
import useSeries from "../../../hooks/useSeries";
import { SerieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { SerieSection } from "../../Section";

export default function SerieScene() {
  const [series, setSeries] = useState<SerieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueSerie | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (recordSelected: UniqueSerie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const { mutate: mutateSeries, status } = useSeries({
    onSuccess: (data: SerieReturnType) => {
      setSeries((prev) => unionBy([...prev, ...data.results], "id"));
      setPage(data.page);
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useSeries] error", error);
    },
  });

  const watchPage = useCallback(
    (page: number) => {
      mutateSeries({ page: page });
    },
    [mutateSeries]
  );

  const isLoading = status === "pending";

  return (
    <Fragment>
      <SerieTableContainer
        isLoading={isLoading}
        rows={series}
        totalRecords={totalRecords}
        page={page}
        watchPage={watchPage}
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
