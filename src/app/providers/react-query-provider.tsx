"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

type Props = {
  children: ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
