import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { NextUIProvider, Switch } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Film, Sun, Tv, Moon, LucideProps } from "lucide-react";

import Root from "./scenes/root";
import Search from "./components/scenes/Search";
import { setScene } from "./redux/scenes/sceneSlice";
import SerieScene from "./components/scenes/Series";
import MovieScene from "./components/scenes/Movies";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppDispatch, RootState, store } from "./redux/store";
import { Scene } from "./types";

import "./index.css";

const queryClient = new QueryClient();

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

function App() {
  const { setTheme, resolvedTheme } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );
  const SceneIcon = scenes[currentScene].icon;
  const switchScene = (scene: Scene) => dispatch(setScene(scene));

  return (
    <div
      className={`min-h-screen w-full ${
        resolvedTheme === "dark"
          ? "bg-black text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Common header wrapping NavBar and the switches */}
      <header className="flex items-center justify-between p-4">
        <NavBar />
        <div className="flex items-center gap-4">
          {location.pathname === "/" ? (
            <Switch
              defaultChecked={currentScene === "series"}
              size="md"
              color="primary"
              onChange={(e) =>
                switchScene(e.target.checked ? "movies" : "series")
              }
              thumbIcon={({ className }) => <SceneIcon className={className} />}
            />
          ) : null}
          <Switch
            checked={resolvedTheme === "light"} // Show light mode selected by default
            size="md"
            color="primary"
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} // Switch to dark mode if toggled
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Sun className={className} /> // Show Sun icon when light mode is selected
              ) : (
                <Moon className={className} /> // Show Moon icon when dark mode is selected
              )
            }
          />
        </div>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <Provider store={store}>
            <LanguageProvider>
              <Router>
                <div className="px-2 mx-1 sm:mx-2 lg:mx-4">
                  <App />
                </div>
              </Router>
            </LanguageProvider>
          </Provider>
        </NextThemesProvider>
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>
);
