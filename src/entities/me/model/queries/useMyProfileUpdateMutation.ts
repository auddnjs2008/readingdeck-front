import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQcommunityQueryKey } from "@/entities/community/model/queries/RQcommunityQueryKey";
import { updateMyProfile } from "@/entities/me/api/updateMyProfile";
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
