import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import SerieScene from "../../components/scenes/Series";
import MovieScene from "../../components/scenes/Movies";
import { Scene, SceneProps } from "../../types";
import MovieIcon from "../../components/Icons/MovieIcon";
import TvIcon from "../../components/Icons/TvIcon";

const scenes: Record<Scene, SceneProps> = {
  series: {
    component: <SerieScene />,
    icon: TvIcon,
  },
  movies: {
    component: <MovieScene />,
    icon: MovieIcon,
  },
};

export default function RootScene() {
  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );
  const SceneComponent = scenes[currentScene].component;

  return <>{SceneComponent}</>;
}
