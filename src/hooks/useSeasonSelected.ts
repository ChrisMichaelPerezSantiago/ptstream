import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { setSeasonSelected, clearSeasonSelected } from "../redux/season/seasonSlice";

const actionMap = {
  seasonSelected: setSeasonSelected,
} as const;

const selectorMap = {
  seasonSelected: (state: RootState) => state.season.seasonSelected,
} as const;

type SeasonSelectedStateKey = keyof typeof actionMap;

type SeasonSelectedStateValue<T extends SeasonSelectedStateKey> = RootState['season'][T];

const useSeasonSelected = (): {
  get: <T extends SeasonSelectedStateKey>(key: T) => SeasonSelectedStateValue<T>;
  set: <T extends SeasonSelectedStateKey>(key: T, value: SeasonSelectedStateValue<T>) => void;
  clear: () => void;
} => {
  const dispatch = useDispatch();

  const get = useCallback(
    <T extends SeasonSelectedStateKey>(key: T): SeasonSelectedStateValue<T> => {
      return useSelector(selectorMap[key]) as SeasonSelectedStateValue<T>;
    },
    []
  );

  const set = useCallback(
    <T extends SeasonSelectedStateKey>(key: T, value: SeasonSelectedStateValue<T>) => {
      const action = actionMap[key];
      if (action) dispatch(action(value));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearSeasonSelected());
  }, [dispatch]);

  return { get, set, clear };
};

export default useSeasonSelected;
