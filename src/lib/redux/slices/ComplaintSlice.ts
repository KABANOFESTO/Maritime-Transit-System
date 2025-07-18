import { apiSlice } from "./ApiSlice";

const complaintApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComplaints: builder.query({
            query: () => ({
                url: "/complaints",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        getComplaintById: builder.query({
            query: (id) => ({
                url: `/complaints/${id}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
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
                url: `/complaints/${updatedComplaint.id}/status?status=${encodeURIComponent(updatedComplaint.status)}`,
                method: "PATCH",
                body: { status: updatedComplaint.status }, 
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
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
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