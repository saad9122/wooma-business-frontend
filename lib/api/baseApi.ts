import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { API_TAGS } from "./tags";

// Define our single API slice object
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    // Include credentials if needed
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  // Global tag types for cache invalidation - using constants
  tagTypes: Object.values(API_TAGS),
  // Keep unused data in cache for 60 seconds
  keepUnusedDataFor: 60,
  // Refetch on mount or arg change
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = baseApi;
