import { apiSlice } from "./ApiSlice";

const analyticApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: () => "/analytics",
        }),
        getAnalyticsById: builder.query({
            query: (id) => `/analytics/${id}`,
        }),
        createAnalytics: builder.mutation({
            query: (newAnalytics) => ({
                url: "/analytics",
                method: "POST",
                body: newAnalytics,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateAnalytics: builder.mutation({
            query: (updatedAnalytics) => ({
                url: `/analytics/${updatedAnalytics.id}`,
                method: "PUT",
                body: updatedAnalytics,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteAnalytics: builder.mutation({
            query: (id) => ({
                url: `/analytics/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetAnalyticsByIdQuery,
    useCreateAnalyticsMutation,
    useUpdateAnalyticsMutation,
    useDeleteAnalyticsMutation,
} = analyticApi;

export { analyticApi };