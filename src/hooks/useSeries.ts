import { useMutation, UseMutationResult } from "@tanstack/react-query";

import SerieService from "../services/SerieService";
import { SerieFilter } from "../types";

const { all } = SerieService;

const useSeries = (
  values: any
): UseMutationResult<ReturnType<typeof all>, unknown, SerieFilter> => {
  return useMutation({
    mutationKey: ["UseAllSeries"],
    mutationFn: async ({ page }) => {
      return all({ page });
    },
    ...values,
  });
};

export default useSeries;
