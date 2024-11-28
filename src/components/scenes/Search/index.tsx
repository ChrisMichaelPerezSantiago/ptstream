import { Fragment } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { map, size } from "lodash";
import { useTranslation } from "react-i18next";

import { SearchTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import useSearchHandler from "../../../hooks/useSearchHandler";
import { MediaType } from "../../../types";
import useSearchState from "../../../hooks/useSearchState";

const defaultSearchTerms = [
  "Harry Potter",
  "The Lord of the Rings",
  "Game of Thrones",
  "Breaking Bad",
];

const DefaultState = ({
  terms,
  onSelectTerm,
}: {
  terms: string[];
  onSelectTerm: (term: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight">
        {t("Search_DefaultState_Text1")}
      </h2>
      <p className="max-w-md mb-6 text-default-500">
        {t("Search_DefaultState_Text2")}
      </p>
      <div className="text-sm text-default-500">
        <p>{t("Search_DefaultState_Text3")}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {map(terms, (term) => (
            <Chip
              key={term}
              className="transition duration-300 cursor-pointer"
              variant="flat"
              color="default"
              onClick={() => onSelectTerm(term)}
            >
              {term}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
};

const ModalContent = ({
  mediaType,
  record,
}: {
  mediaType: MediaType;
  record: any;
}) => {
  const scenes = {
    movie: <MovieSection item={record} />,
    tv: <SerieSection item={record} />,
  };

  return scenes[mediaType] || null;
};

const SerieScene = () => {
  const searchState = useSearchState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const records = searchState.get("records");
  const record = searchState.get("record");
  const totalRecords = searchState.get("totalRecords");
  const page = searchState.get("page");

  const showScrollToTop = size(records) >= 100;

  const { isLoading } = useSearchHandler(
    (data) => {
      searchState.set("records", data.results);
      searchState.set("page", data.page);
      searchState.set("totalRecords", data.total_pages);
    },
    (searchQuery: string) => {
      searchState.set("inputValue", searchQuery);
    }
  );

  const handleOpenModal = (recordSelected: any) => {
    searchState.set("record", recordSelected);
    onOpen();
  };

  const handleSelectTerm = (term: string) =>
    searchState.set("inputValue", term);

  return (
    <Fragment>
      <SearchTableContainer
        isLoading={isLoading}
        rows={records}
        totalRecords={totalRecords}
        page={page}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={
          <DefaultState
            terms={defaultSearchTerms}
            onSelectTerm={handleSelectTerm}
          />
        }
      />

      {showScrollToTop && <ScrollToTopButton />}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={
            <ModalContent mediaType={record["media_type"]} record={record} />
          }
          children={null}
        />
      ) : null}
    </Fragment>
  );
};

export default SerieScene;
