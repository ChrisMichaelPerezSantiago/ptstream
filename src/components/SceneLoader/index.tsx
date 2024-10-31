import { Suspense, lazy } from "react";

import { Scene } from "../../types";
import { Spinner } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const scenes = {
  series: lazy(() => import("../scenes/Series")),
  movies: lazy(() => import("../scenes/Movies")),
};

const SceneLoader = ({ scene }: { scene: Scene }) => {
  const { t } = useTranslation();

  const SceneComponent = scenes[scene];

  return (
    <Suspense
      fallback={
        <div>
          <Spinner color="default" size="sm" />
        </div>
      }
    >
      {SceneComponent ? (
        <SceneComponent />
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="max-w-md mb-6 text-default-500">
            {t("Scene_NotFound")}
          </p>
        </div>
      )}
    </Suspense>
  );
};

export default SceneLoader;
