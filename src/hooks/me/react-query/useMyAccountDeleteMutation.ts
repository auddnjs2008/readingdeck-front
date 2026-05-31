import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMyAccount } from '@/service/me/deleteMyAccount';
import { RQmeQueryKey } from './RQmeQueryKey';

export const useMyAccountDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      queryClient.clear();
      queryClient.removeQueries({ queryKey: RQmeQueryKey.all });
    },
  });
};
