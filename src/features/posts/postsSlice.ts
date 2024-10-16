import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export type Post = {
  id: string;
  title: string;
  body: string;
  userId?: number;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
};

export interface PostState extends EntityState<Post, string> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: null | string;
  count: number;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export type ReactionPayloadType = {
  postId: string;
  reaction: "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";
};

const initialState: PostState = postsAdapter.getInitialState({
  status: "idle",
  error: null,
  count: 0,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: { title: string; body: string; userId: string }) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: {
    id: string;
    title: string;
    body: string;
    reactions: Post["reactions"];
    userId: number;
  }) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // return error.message;
        // Only for this specific use case
        return initialPost;
      }
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost: { id: string }) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response.status}: ${response.statusText}`;
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action: PayloadAction<ReactionPayloadType>) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Add date and reactions
        let min = 1;
        const loadedPosts = action.payload.map((post: Post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };

          return post;
        });

        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not be completed");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not be completed");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

export const { increaseCount, reactionAdded } = postsSlice.actions;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostsById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: { posts: PostState }) => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_, userId: string) => userId],
  (posts, userId) => posts.filter((post) => String(post.userId) === userId)
);

export const getPostsStatus = (state: { posts: PostState }) =>
  state.posts.status;

export const getPostsError = (state: { posts: PostState }) => state.posts.error;

export const getCount = (state: { posts: PostState }) => state.posts.count;

export default postsSlice.reducer;
