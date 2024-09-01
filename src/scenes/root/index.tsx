import React from "react";
import { useSelector } from "react-redux";
import { Film, LucideProps, Tv } from "lucide-react";

import { RootState } from "../../redux/store";
import SerieScene from "../../components/scenes/Series";
import MovieScene from "../../components/scenes/Movies";
import { Scene } from "../../types";

type SceneProps = {
  component: JSX.Element;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

const scenes: Record<Scene, SceneProps> = {
  series: {
    component: <SerieScene />,
    icon: Tv,
  },
  movies: {
    component: <MovieScene />,
    icon: Film,
  },
};

export default function RootScene() {
  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );
  const SceneComponent = scenes[currentScene].component;

  return <>{SceneComponent}</>;
}
