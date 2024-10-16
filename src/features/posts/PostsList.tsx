import { useAppSelector } from "../../app/hooks";
import { PostsExcerpt } from "./PostsExcerpt";
import { selectAllPosts, getPostsStatus, getPostsError } from "./postsSlice";

export const PostsList = () => {
  const posts = useAppSelector(selectAllPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const error = useAppSelector(getPostsError);

  let content;

  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => {
      return <PostsExcerpt key={post.id} post={post} />;
    });
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
