import { useAppSelector } from "../../app/hooks";
import { PostsExcerpt } from "./PostsExcerpt";
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice";

export const PostsList = () => {
  const orderedPostsIds = useAppSelector(selectPostIds);
  const postsStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostsError);

  let content;

  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    content = orderedPostsIds.map((postId) => {
      return <PostsExcerpt key={postId} postId={postId} />;
    });
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
