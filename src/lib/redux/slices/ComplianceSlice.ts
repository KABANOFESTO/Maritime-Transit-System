import { apiSlice } from "./ApiSlice";

const complianceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompliances: builder.query({
            query: () => "/compliances",
        }),
        getComplianceById: builder.query({
            query: (id) => `/compliances/${id}`,
        }),
        createCompliance: builder.mutation({
            query: (newCompliance) => ({
                url: "/compliances",
                method: "POST",
                body: newCompliance,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateCompliance: builder.mutation({
            query: (updatedCompliance) => ({
                url: `/compliances/${updatedCompliance.id}`,
                method: "PUT",
                body: updatedCompliance,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteCompliance: builder.mutation({
            query: (id) => ({
                url: `/compliances/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCompliancesQuery,
    useGetComplianceByIdQuery,
    useCreateComplianceMutation,
    useUpdateComplianceMutation,
    useDeleteComplianceMutation,
} = complianceApi;

export { complianceApi };