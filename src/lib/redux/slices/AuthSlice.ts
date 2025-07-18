import { apiSlice } from "./ApiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "users/signup",
        method: "POST",
        body: data,
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `users/update/${data.email}`,
        method: "PUT", 
        body: data,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `users/change-password/${data.email}`,
        method: "PUT", 
        body: data,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "users/all", // Added "/all" to match your controller endpoint
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

    getUserByEmail: builder.query({
      query: (email) => ({
        url: `users/${encodeURIComponent(email)}`,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;