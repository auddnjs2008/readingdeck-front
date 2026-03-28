import fetcher from "../fetcher";
import type { ResGetMyProfile } from "./getMyProfile";

export type ReqUpdateMyProfile = {
  body: {
    name: string;
    profileImage?: File | null;
  };
};

export const updateMyProfile = async (req: ReqUpdateMyProfile) => {
  const formData = new FormData();
  formData.append("name", req.body.name);

  if (req.body.profileImage) {
    formData.append("profileImage", req.body.profileImage);
  }

  const result = await fetcher.patch<ResGetMyProfile>("/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return result.data;
};
