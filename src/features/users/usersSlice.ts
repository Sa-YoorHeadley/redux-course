import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type UserState = {
  id: string;
  name: string;
};

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(USERS_URL);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
});

const initialState: UserState[] = [];

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

// export const {} = UsersSlice.actions;

export const selectAllUsers = (state: { users: UserState[] }) => state.users;

export default UsersSlice.reducer;
