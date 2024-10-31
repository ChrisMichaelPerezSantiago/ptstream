import { SceneProvider, useScene } from "../../contexts/SceneContext";
import SceneLoader from "../../components/SceneLoader";

const SceneConsumer = () => {
  const currentScene = useScene();
  return <SceneLoader scene={currentScene} />;
};

const RootScene = () => {
  return (
    <SceneProvider>
      <SceneConsumer />
    </SceneProvider>
  );
};

export default RootScene;
