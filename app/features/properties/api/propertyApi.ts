import { baseApi } from "../../../../lib/api/baseApi";
import { TagIds, createTags } from "../../../../lib/api/tags";
import type {
  Property,
  PropertyWithReports,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyListFilters,
  PropertyReportsFilters,
} from "../types/property.types";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../../../../lib/api/types";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Properties List
    getPropertiesList: builder.query<
      PaginatedResponse<Property>,
      PaginationParams & PropertyListFilters
    >({
      query: (params) => ({
        url: "/properties",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.city && { city: params.city }),
          ...(params.postcode && { postcode: params.postcode }),
          ...(params.search && { search: params.search }),
          ...(params.is_active !== undefined && {
            is_active: params.is_active,
          }),
          ...(params.sort_by && { sort_by: params.sort_by }),
          ...(params.sort_order && { sort_order: params.sort_order }),
        },
      }),
      providesTags: (result) =>
        createTags.forList(
          result?.data,
          TagIds.propertyList(),
          TagIds.property
        ),
      keepUnusedDataFor: 300,
    }),

    // 2. Get Property with Reports (with filters)
    getProperty: builder.query<
      ApiResponse<PropertyWithReports>,
      { id: string } & PropertyReportsFilters
    >({
      query: ({ id, ...filters }) => ({
        url: `/properties/${id}`,
        params: {
          ...(filters.report_type && {
            report_type: Array.isArray(filters.report_type)
              ? filters.report_type.join(",")
              : filters.report_type,
          }),
          ...(filters.report_status && {
            report_status: Array.isArray(filters.report_status)
              ? filters.report_status.join(",")
              : filters.report_status,
          }),
          ...(filters.start_date && { start_date: filters.start_date }),
          ...(filters.end_date && { end_date: filters.end_date }),
        },
      }),
      providesTags: (result, error, { id }) => [TagIds.property(id)],
    }),

    // 3. Create Property
    createProperty: builder.mutation<
      ApiResponse<Property>,
      CreatePropertyRequest
    >({
      query: (property) => ({
        url: "/properties",
        method: "POST",
        body: property,
      }),
      invalidatesTags: [TagIds.propertyList()],
      // Optimistic update for the list
      onQueryStarted: async (property, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          propertyApi.util.updateQueryData("getPropertiesList", {}, (draft) => {
            const tempProperty: Property = {
              id: `temp-${Date.now()}`,
              // Name will be set by backend
              name: "",
              ...property,
              no_of_reports: 0,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            draft.data.unshift(tempProperty);
            draft.pagination.total += 1;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // 4. Archive Property
    archiveProperty: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/properties/${id}/archive`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        TagIds.property(id),
        TagIds.propertyList(),
      ],
      // Optimistic update to mark as archived (is_active: false)
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResults = [
          // Update the property detail cache
          dispatch(
            propertyApi.util.updateQueryData("getProperty", { id }, (draft) => {
              if (draft.data) {
                draft.data.is_active = false;
                draft.data.updated_at = new Date().toISOString();
              }
            })
          ),
          // Update the properties list cache
          dispatch(
            propertyApi.util.updateQueryData(
              "getPropertiesList",
              {},
              (draft) => {
                const property = draft.data.find((p) => p.id === id);
                if (property) {
                  property.is_active = false;
                  property.updated_at = new Date().toISOString();
                }
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    // 5. Update Property
    updateProperty: builder.mutation<
      ApiResponse<Property>,
      UpdatePropertyRequest
    >({
      query: ({ id, ...updates }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        TagIds.property(id),
        TagIds.propertyList(),
      ],
      // Optimistic update
      onQueryStarted: async (
        { id, ...updates },
        { dispatch, queryFulfilled }
      ) => {
        const patchResults = [
          // Update property detail cache
          dispatch(
            propertyApi.util.updateQueryData("getProperty", { id }, (draft) => {
              if (draft.data) {
                Object.assign(draft.data, updates);
                draft.data.updated_at = new Date().toISOString();
              }
            })
          ),
          // Update properties list cache
          dispatch(
            propertyApi.util.updateQueryData(
              "getPropertiesList",
              {},
              (draft) => {
                const property = draft.data.find((p) => p.id === id);
                if (property) {
                  Object.assign(property, updates);
                  property.updated_at = new Date().toISOString();
                }
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPropertiesListQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useArchivePropertyMutation,
  useUpdatePropertyMutation,
  useLazyGetPropertiesListQuery,
  useLazyGetPropertyQuery,
} = propertyApi;
