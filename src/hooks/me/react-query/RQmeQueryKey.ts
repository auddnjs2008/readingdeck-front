export const RQmeQueryKey = {
  all: ["me"] as const,
  profile: () => [...RQmeQueryKey.all, "profile"] as const,
  libraryStats: () => [...RQmeQueryKey.all, "libraryStats"] as const,
  dailyCardStack: () => [...RQmeQueryKey.all, "dailyCardStack"] as const,
  latestBookList: () => [...RQmeQueryKey.all, "latestBookList"] as const,
};
