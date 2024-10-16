import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  id: string;
  name: string;
};

const initialState: UserState[] = [
  { id: "0", name: "Serina Headley" },
  { id: "1", name: "Sa-Yoor Headley" },
];

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const {} = UsersSlice.actions;

export const selectAllUsers = (state: { users: UserState[] }) => state.users;

export default UsersSlice.reducer;
