import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { revisitCard } from "@/entities/card/api/revisitCard";
import { RQcardQueryKey } from "./RQcardQueryKey";

export const useCardRevisitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revisitCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcardQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.revisitCardStack() });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.dailyCardStack() });
    },
  });
};
