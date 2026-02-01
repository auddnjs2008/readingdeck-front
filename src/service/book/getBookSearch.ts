import fetcher from "../fetcher";

export type ReqGetBookSearch = {
  query: {
    query: string;
    sort?: "accuracy" | "latest";
    page?: number;
    size?: number;
    target?: "title" | "isbn" | "publisher" | "person";
  };
};

export interface KakaoBookSearchResponse {
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
  documents: KakaoBookDocument[];
}

export interface KakaoBookDocument {
  authors: string[];
  contents: string;
  datetime: string;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
}

export const getBookSearch = async (req: ReqGetBookSearch) => {
  const result = await fetcher.get<KakaoBookSearchResponse>("/books/search", {
    params: req.query,
  });
  return result.data;
};
