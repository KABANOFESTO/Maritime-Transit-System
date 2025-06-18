import { apiSlice } from "./ApiSlice";

const ticketApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: () => "/tickets",
        }),
        getTicketById: builder.query({
            query: (id) => `/tickets/${id}`,
        }),
        createTicket: builder.mutation({
            query: (newTicket) => ({
                url: "/tickets",
                method: "POST",
                body: newTicket,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateTicket: builder.mutation({
            query: (updatedTicket) => ({
                url: `/tickets/${updatedTicket.id}`,
                method: "PUT",
                body: updatedTicket,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/tickets/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetTicketsQuery,
    useGetTicketByIdQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
} = ticketApi;
export { ticketApi };