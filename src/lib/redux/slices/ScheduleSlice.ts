import { apiSlice } from "./ApiSlice";

const routeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoutes: builder.query({
            query: () => '/routes',
        }),
        getRouteById: builder.query({
            query: (id) => `/routes/${id}`,
        }),
        createRoute: builder.mutation({
            query: (newRoute) => ({
                url: '/routes',
                method: 'POST',
                body: newRoute,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }),
        }),
        updateRoute: builder.mutation({
            query: (updatedRoute) => ({
                url: `/routes/${updatedRoute.id}`,
                method: 'PUT',
                body: updatedRoute,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }),
        }),
        deleteRoute: builder.mutation({
            query: (id) => ({
                url: `/routes/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }),
        }),
    }),
});
export const {
    useGetRoutesQuery,
    useGetRouteByIdQuery,
    useCreateRouteMutation,
    useUpdateRouteMutation,
    useDeleteRouteMutation,
} = routeApi;