import { apiSlice } from "./ApiSlice";

const paymentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: (paymentData) => ({
                url: "/payments",
                method: "POST",
                body: paymentData,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),

        confirmPayment: builder.mutation({
            query: (paymentIntentId) => ({
                url: `/payments/confirm?paymentIntentId=${paymentIntentId}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),

        getPaymentsByUserId: builder.query({
            query: (userId) => ({
                url: `/payments/user/${userId}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),

        getPaymentById: builder.query({
            query: (paymentId) => ({
                url: `/payments/${paymentId}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
    }),
});

export const {
    useCreatePaymentMutation,
    useConfirmPaymentMutation,
    useGetPaymentsByUserIdQuery,
    useGetPaymentByIdQuery
} = paymentApi;

export { paymentApi };