import { useMutation } from "@tanstack/react-query";

import { createFeedback } from "@/service/feedback/createFeedback";

export const useFeedbackCreateMutation = () => {
  return useMutation({
    mutationFn: createFeedback,
  });
};
