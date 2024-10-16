import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

export type PostState = {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
};

export type ReactionPayloadType = {
  postId: string;
  reaction: "thumbsUp" | "wow" | "heart" | "rocket" | "coffee" ;
};

const initialState: PostState[] = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard goof things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
  {
    id: "2",
    title: "Slices ...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), { minutes: 15 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
];

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<PostState>) {
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
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
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const { postAdded, reactionAdded } = postsSlice.actions;

export const selectAllPosts = (state: { posts: PostState[] }) => state.posts;

export default postsSlice.reducer;
