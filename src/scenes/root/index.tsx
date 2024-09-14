import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import SerieScene from "../../components/scenes/Series";
import MovieScene from "../../components/scenes/Movies";
import { Scene, SceneProps } from "../../types";

const scenes: Record<Scene, SceneProps> = {
  series: {
    component: <SerieScene />,
  },
  movies: {
    component: <MovieScene />,
  },
};

export default function RootScene() {
  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );
  const SceneComponent = scenes[currentScene].component;

  return <>{SceneComponent}</>;
}
