import { useAppSelector } from "../../app/hooks";
import { PostsExcerpt } from "./PostsExcerpt";
import { selectPostIds, useGetPostsQuery } from "./postsSlice";

export const PostsList = () => {
  const { isError, isLoading, isSuccess, error } = useGetPostsQuery(undefined);
  const orderedPostsIds = useAppSelector(selectPostIds);

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPostsIds.map((postId) => {
      return <PostsExcerpt key={postId} postId={postId} />;
    });
  } else if (isError) {
    // Safely handle the error object
    let errorMessage = 'An unknown error occurred.';
    if (error) {
      // Handle known error structures
      if ('status' in error) {
        errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
      } else {
        errorMessage = error.toString();
      }
    }
    
    content = <p>{errorMessage}</p>;
  }

  return <section>{content}</section>;
};
