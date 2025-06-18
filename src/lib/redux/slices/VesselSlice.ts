import {apiSlice} from './ApiSlice';

const vesselApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVessels: builder.query({
      query: () => '/vessels',
    }),
    getVesselById: builder.query({
      query: (id) => `/vessels/${id}`,
    }),
    createVessel: builder.mutation({
      query: (newVessel) => ({
        url: '/vessels',
        method: 'POST',
        body: newVessel,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    updateVessel: builder.mutation({
      query: (updatedVessel) => ({
        url: `/vessels/${updatedVessel.id}`,
        method: 'PUT',
        body: updatedVessel,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    deleteVessel: builder.mutation({
      query: (id) => ({
        url: `/vessels/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetVesselsQuery,
  useGetVesselByIdQuery,
  useCreateVesselMutation,
  useUpdateVesselMutation,
  useDeleteVesselMutation,
} = vesselApi;
export {vesselApi};