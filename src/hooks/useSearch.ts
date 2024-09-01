import { useMutation, UseMutationResult } from "@tanstack/react-query";

import SearchService from "../services/SearchService";

const { search } = SearchService;

type SearchProps = {
  q: string;
}

const useSearch = (
  values: any
): UseMutationResult<ReturnType<typeof search>, unknown, SearchProps> => {
  return useMutation({
    mutationKey: ["UseSearch"],
    mutationFn: async ({ q }) => {
      return search({ q });
    },
    ...values,
  });
};

export default useSearch;
