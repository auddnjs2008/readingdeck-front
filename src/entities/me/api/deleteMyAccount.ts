import fetcher from "@/shared/api/fetcher";

export const deleteMyAccount = async () => {
  const { data } = await fetcher.delete('/me');
  return data as { success: boolean; message: string };
};
