import { useState, Fragment } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { map } from "lodash";

import { MyFavoritesTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import { getAllLikedItems } from "../../../toolkit/localstorage";

type MediaType = "movie" | "tv";

const DefaultState = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="flex-col items-center">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight">
        Discover Your Favorite Movies & Series
      </h2>
    </div>
    <p className="max-w-md mb-6 text-default-500">
      You haven't added any favorite movies or series yet. Start by searching
      our extensive database and find your next favorite.
    </p>
    <div className="text-sm text-default-500">
      <p>Need inspiration? Try searching for:</p>
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

const transformMyFavorites = (data: any) => map(data, (item) => item);

export default function MyFavoriteScene() {
  const [record, setRecord] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const items = getAllLikedItems();

  const myFavorites = transformMyFavorites(items);

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

  return (
    <Fragment>
      <MyFavoritesTableContainer
        isLoading={false}
        rows={myFavorites}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={<DefaultState />}
      />

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={content[record.media_type].component}
          children={null}
        />
      ) : null}
    </Fragment>
  );
}
