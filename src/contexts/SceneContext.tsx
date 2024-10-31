import { createContext, ReactNode, useContext } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { Scene } from "../types";

const SceneContext = createContext<Scene | null>(null);

export const SceneProvider = ({ children }: { children: ReactNode }) => {
  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );

  return (
    <SceneContext.Provider value={currentScene}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (context === null) {
    throw new Error("[useScene]: must be used within a SceneProvider");
  }
  return context;
};
