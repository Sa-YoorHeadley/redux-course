import { apiSlice } from "../api/apiSlice";

export type User = {
  id: string;
  name: string;
};
export const extendedApiSliceUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], undefined>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = extendedApiSliceUsers;

export const selectAllUsers = (state: { users: User[] }) => state.users;

export const selectUserById = (state: { users: User[] }, userId: string) => {
  return state.users.find((user) => String(user.id) === userId);
};
