import { apiSlice } from "./ApiSlice";

const cargoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCargoes: builder.query({
            query: () => "/cargoes",
        }),
        getCargoById: builder.query({
            query: (id) => `/cargoes/${id}`,
        }),
        createCargo: builder.mutation({
            query: (newCargo) => ({
                url: "/cargoes",
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
                url: `/cargoes/${updatedCargo.id}`,
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
                url: `/cargoes/${id}`,
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