import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCommunityPost } from "@/entities/community/api/deleteCommunityPost";
import { RQdeckQueryKey } from "@/entities/deck/model/queries/RQdeckQueryKey";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityPostDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: RQcommunityQueryKey.all }),
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all }),
    ]),
  });
};
