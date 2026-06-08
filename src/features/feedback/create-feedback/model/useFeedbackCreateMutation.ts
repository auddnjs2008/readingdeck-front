import { useMutation } from "@tanstack/react-query";

import { createFeedback } from "@/features/feedback/create-feedback/api/createFeedback";

export const useFeedbackCreateMutation = () => {
  return useMutation({
    mutationFn: createFeedback,
  });
};
