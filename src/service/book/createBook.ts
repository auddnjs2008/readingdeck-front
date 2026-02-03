import fetcher from "../fetcher";

export type ReqCreateBook = {
  body: {
    title: string;
    author: string;
    publisher: string;
    imageUrl?: string;
    backgroundImage?: File;
  };
};

export type ResCreateBook = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  backgroundImage: string | null;
};

export const createBook = async (req: ReqCreateBook) => {
  const formData = new FormData();
  formData.append("title", req.body.title);
  formData.append("author", req.body.author);
  formData.append("publisher", req.body.publisher);

  if (req.body.backgroundImage) {
    formData.append("backgroundImage", req.body.backgroundImage);
  } else if (req.body.imageUrl) {
    formData.append("imageUrl", req.body.imageUrl);
  }

  const result = await fetcher.post<ResCreateBook>("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
};
