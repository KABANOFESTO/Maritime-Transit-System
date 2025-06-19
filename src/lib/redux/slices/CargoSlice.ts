import { apiSlice } from "./ApiSlice";

const cargoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCargoes: builder.query({
            query: () => ({
                url: "/cargo",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        getCargoById: builder.query({
            query: (id) => ({
                url: `/cargo/${id}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        createCargo: builder.mutation({
            query: (newCargo) => ({
                url: "/cargo",
                method: "POST",
                body: newCargo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateCargo: builder.mutation({
            query: (updatedCargo) => ({
                url: `/cargo/${updatedCargo.id}`,
                method: "PUT",
                body: updatedCargo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteCargo: builder.mutation({
            query: (id) => ({
                url: `/cargo/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCargoesQuery,
    useGetCargoByIdQuery,
    useCreateCargoMutation,
    useUpdateCargoMutation,
    useDeleteCargoMutation,
} = cargoApi;

export { cargoApi };