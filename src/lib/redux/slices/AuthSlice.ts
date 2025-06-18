import { apiSlice } from "./ApiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "users/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "users/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
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
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getUserByEmail: builder.query({
      query: (email) => ({
        url: `users/${encodeURIComponent(email)}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
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
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;