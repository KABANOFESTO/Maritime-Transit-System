import { apiSlice } from "./ApiSlice";

const complaintApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComplaints: builder.query({
            query: () => "/complaints",
        }),
        getComplaintById: builder.query({
            query: (id) => `/complaints/${id}`,
        }),
        createComplaint: builder.mutation({
            query: (newComplaint) => ({
                url: "/complaints",
                method: "POST",
                body: newComplaint,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateComplaint: builder.mutation({
            query: (updatedComplaint) => ({
                url: `/complaints/${updatedComplaint.id}`,
                method: "PUT",
                body: updatedComplaint,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteComplaint: builder.mutation({
            query: (id) => ({
                url: `/complaints/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetComplaintsQuery,
    useGetComplaintByIdQuery,
    useCreateComplaintMutation,
    useUpdateComplaintMutation,
    useDeleteComplaintMutation,
} = complaintApi;

export { complaintApi };