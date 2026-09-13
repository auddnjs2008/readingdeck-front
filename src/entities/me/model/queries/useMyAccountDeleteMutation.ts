import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMyAccount } from "@/entities/me/api/deleteMyAccount";

export const useMyAccountDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
