import { useMutation, UseMutationResult } from "@tanstack/react-query";

import MovieService from "../services/MovieService";
import { MovieFilter } from "../types";

const { all } = MovieService;

const useMovies = (
  values: any
): UseMutationResult<ReturnType<typeof all>, unknown, MovieFilter> => {
  return useMutation({
    mutationKey: ["UseAllMovies"],
    mutationFn: async ({ page }) => {
      return all({ page });
    },
    ...values,
  });
};

export default useMovies;
