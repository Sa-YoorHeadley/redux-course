import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
import { RootState } from "../../app/store";

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

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData: Post[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        if (result) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post" as const, id })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData: Post[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        console.log(result);
        if (result) {
          return [...result.ids.map((id) => ({ type: "Post" as const, id }))];
        } else {
          return [];
        }
      },
    }),
    addNewPost: builder.mutation({
      query: (initialPost: {
        userId: number;
        title: string;
        body: string;
      }) => ({
        url: "/post",
        method: "POST",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost: {
        id: string;
        userId: number;
        title: string;
        body: string;
      }) => ({
        url: `/post/${initialPost.id}`,
        method: "PUT",
        body: { ...initialPost, date: new Date().toISOString() },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: "/post",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

export const selectPostsResult =
  extendedApiSlice.endpoints.getPosts.select(undefined);

const selectPostsData = createSelector(
  selectPostsResult,
  (postResult) => postResult?.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState
);
