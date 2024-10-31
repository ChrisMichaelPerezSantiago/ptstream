import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { House, Search, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

import useSearchState from "../../hooks/useSearchState";

type Key = "home" | "search" | "myFavorites";

const NAVIGATION_MAP: Record<Key, string> = {
  home: "/",
  search: "/search",
  myFavorites: "/myFavorites",
};

const translationKeys: Record<Key, string> = {
  home: "Navigation_Home",
  search: "Navigation_Search",
  myFavorites: "Navigation_MyFavorites",
};

const translateKeys = (t: TFunction<"translation", undefined>, key: Key) => {
  return t(translationKeys[key]);
};

export default function NavBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Key>("home");

  const { clearSearchState } = useSearchState();

  useEffect(() => {
    navigate(NAVIGATION_MAP[selected]);
  }, [selected]);

  const handleSelectionChange = (key: Key) => {
    setSelected(key);
    clearSearchState();
  };

  return (
    <div className="flex flex-col w-full">
      <Tabs
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
        color="default"
        variant="bordered"
      >
        {Object.entries(NAVIGATION_MAP).map(([key]) => (
          <Tab
            key={key}
            title={
              <div className="flex items-center space-x-2">
                {key === "home" ? (
                  <House className="w-4 h-4" />
                ) : key === "search" ? (
                  <Search className="w-4 h-4" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                <span>{translateKeys(t, key as Key)}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
