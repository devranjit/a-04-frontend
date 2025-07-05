import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://library-management-lake-three.vercel.app/api/",
  }),
  tagTypes: ["Books", "BorrowSummary"],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      query: () => "books",
      providesTags: ["Books"],
      transformResponse: (response: any) => response.data,
    }),
    getBook: builder.query<Book, string>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Books", id }],
      transformResponse: (response: any) => response.data,
    }),
    createBook: builder.mutation<void, Partial<Book>>({
      query: (newBook) => ({
        url: "books",
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["Books"],
    }),
    updateBook: builder.mutation<void, { id: string; updates: Partial<Book> }>({
      query: ({ id, updates }) => ({
        url: `books/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Books", id }],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
    borrowBook: builder.mutation<
      void,
      { bookId: string; quantity: number; dueDate: string }
    >({
      query: ({ bookId, quantity, dueDate }) => ({
        url: "borrow",                
        method: "POST",
        body: { book: bookId, quantity, dueDate },  
      }),
      invalidatesTags: ["Books", "BorrowSummary"],
    }),
    getBorrowSummary: builder.query<any[], void>({
      query: () => "borrow-summary",
      providesTags: ["BorrowSummary"],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = booksApi;
