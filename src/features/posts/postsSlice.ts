import {
  createSlice,
  nanoid,
  PayloadAction,
  createAsyncThunk,
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

export type PostState = {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: null | string;
};

export type ReactionPayloadType = {
  postId: string;
  reaction: "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";
};

const initialState: PostState = {
  posts: [],
  status: "idle",
  error: null,
};

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
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title: string, body: string, userId: number) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action: PayloadAction<ReactionPayloadType>) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
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

        state.posts = state.posts.concat(loadedPosts);
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
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not be completed");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not be completed");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

export const { postAdded, reactionAdded } = postsSlice.actions;

export const selectAllPosts = (state: { posts: PostState }) =>
  state.posts.posts;

export const selectPostById = (state: { posts: PostState }, postId: string) => {
  return state.posts.posts.find((post) => String(post.id) === postId);
};

export const getPostsStatus = (state: { posts: PostState }) =>
  state.posts.status;

export const getPostsError = (state: { posts: PostState }) => state.posts.error;

export default postsSlice.reducer;
