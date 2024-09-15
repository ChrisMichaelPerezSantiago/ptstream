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

import Root from "./scenes/root";
import TvIcon from "./components/Icons/TvIcon";
import MovieIcon from "./components/Icons/MovieIcon";
import Search from "./components/scenes/Search";
import MyFa from "./components/scenes/MyFavorites";
import { setScene } from "./redux/scenes/sceneSlice";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import GenreSelector from "./components/GenreSelector";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppDispatch, RootState, store } from "./redux/store";
import { Scene, SceneProps } from "./types";
import { setGenre } from "./redux/genre/genreSlice";

import "./index.css";

const queryClient = new QueryClient();

const scenes: Record<Scene, SceneProps> = {
  series: {
    icon: TvIcon,
  },
  movies: {
    icon: MovieIcon,
  },
};

function App() {
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const currentScene = useSelector(
    (state: RootState) => state.scene.currentScene
  );
  const selectedGenre = useSelector(
    (state: RootState) => state.genre.selectedGenre
  );

  const reset = () => {
    dispatch(setGenre(null));
  };

  const SceneIcon = scenes[currentScene].icon;
  const switchScene = (scene: Scene) => dispatch(setScene(scene));
  const handleGenreChange = (genre: number | null) => dispatch(setGenre(genre));

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
              color="default"
              onChange={(e) => {
                switchScene(e.target.checked ? "movies" : "series");
                reset();
              }}
              thumbIcon={({ className }) => <SceneIcon className={className} />}
            />
          ) : null}
          {location.pathname !== "/search" ? (
            <GenreSelector
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
            />
          ) : null}
          {/* <Switch
            checked={resolvedTheme === "light"} // Show light mode selected by default
            size="md"
            color="primary"
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} // Switch to dark mode if toggled
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <SunIcon className={className} /> // Show Sun icon when light mode is selected
              ) : (
                <MoonIcon className={className} /> // Show Moon icon when dark mode is selected
              )
            }
          /> */}
        </div>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/search" element={<Search />} />
          <Route path="/myFavorites" element={<MyFa />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
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
);
