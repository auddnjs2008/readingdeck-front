import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQcommunityQueryKey } from "@/hooks/community/react-query/RQcommunityQueryKey";
import { updateMyProfile } from "@/service/me/updateMyProfile";
import { RQmeQueryKey } from "./RQmeQueryKey";

export const useMyProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQcommunityQueryKey.all });
    },
  });
};
