import fetcher from "../fetcher";

export type ResGetMyProfile = {
  id: number;
  name: string;
  email: string;
  profile: string | null;
};

export const getMyProfile = async () => {
  const result = await fetcher.get<ResGetMyProfile>("/me");
  return result.data;
};
