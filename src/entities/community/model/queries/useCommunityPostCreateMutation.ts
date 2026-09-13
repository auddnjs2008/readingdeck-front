import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCommunityPost } from "@/entities/community/api/createCommunityPost";
import { RQdeckQueryKey } from "@/entities/deck/model/queries/RQdeckQueryKey";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityPostCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: RQcommunityQueryKey.all }),
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all }),
    ]),
  });
};
