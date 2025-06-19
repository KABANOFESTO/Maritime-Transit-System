import { apiSlice } from "./ApiSlice";

const scheduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSchedules: builder.query({
            query: () => ({
                url: "/schedules",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        getScheduleById: builder.query({
            query: (id) => ({
                url: `/schedules/${id}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        createSchedule: builder.mutation({
            query: (newSchedule) => ({
                url: "/schedules",
                method: "POST",
                body: newSchedule,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        updateSchedule: builder.mutation({
            query: (updatedSchedule) => ({
                url: `/schedules/${updatedSchedule.id}`,
                method: "PUT",
                body: updatedSchedule,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
        deleteSchedule: builder.mutation({
            query: (id) => ({
                url: `/schedules/${id}`,
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }),
        }),
    }),
});

export const {
    useGetSchedulesQuery,
    useGetScheduleByIdQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
} = scheduleApi;

export { scheduleApi };