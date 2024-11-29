import { useState, Fragment, useEffect } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { filter, get, includes, map, size } from "lodash";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { MyFavoritesTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import * as MyFavLocalStorage from "../../../toolkit/MyFavLocalStorage";
import { RootState } from "../../../redux/store";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import { MediaType } from "../../../types";
import SeoContainer from "../../../components/SeoContainer";

const DefaultState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex-col items-center">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          {t("MyFavorites_DefaultState_Text1")}
        </h2>
      </div>
      <p className="max-w-md mb-6 text-default-500">
        {t("MyFavorites_DefaultState_Text2")}
      </p>
      <div className="text-sm text-default-500">
        <p>{t("MyFavorites_DefaultState_Text3")}</p>
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
};

const FilterEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-default-500">
      <p>{t("MyFavorites_FilterEmptyState")}</p>
    </div>
  );
};

const transformMyFavorites = (data: any) => map(data, (item) => item);

export default function MyFavoriteScene() {
  const [record, setRecord] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();

  const currentGenre = useSelector(
    (state: RootState) => state.genre.selectedGenre
  );

  const items = MyFavLocalStorage.getAllLikedItems();

  const [myFavorites, setMyFavorites] = useState(transformMyFavorites(items));

  const showScrollToTop = size(myFavorites) >= 100;

  const handleOpenModal = (recordSelected: any) => {
    setRecord(recordSelected);
    onOpen();
  };

  const content: Record<MediaType, { component: JSX.Element }> = {
    movie: {
      component: <MovieSection item={record} />,
    },
    tv: {
      component: <SerieSection item={record} />,
    },
  };

  // filter items by genre if currentGenre is not 0
  // else reset state to default items
  useEffect(() => {
    setIsLoading(true);
    const filteredFavorites =
      currentGenre > 0
        ? filter(transformMyFavorites(items), (item) =>
            includes(item.genre_ids, currentGenre)
          )
        : transformMyFavorites(items);

    setMyFavorites(filteredFavorites);
    setIsLoading(false);
  }, [currentGenre]);

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_MyFavorites")}`} />

      <MyFavoritesTableContainer
        isLoading={isLoading}
        rows={myFavorites}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={
          currentGenre > 0 ? <FilterEmptyState /> : <DefaultState />
        }
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={
            get(content, [get(record, "media_type")], { component: null })
              .component
          }
          children={null}
        />
      ) : null}
    </Fragment>
  );
}
