import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { useGetUserByIdQuery } from "./usersSlice";

export const UserPage = () => {
  const { userId } = useParams();
  const { data: user } = useGetUserByIdQuery(String(userId));

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => {
      return (
        <li key={id}>
          <Link to={`/post/${id}`}>{entities[id].title}</Link>
        </li>
      );
    });
  } else if (isError) {
    // Safely handle the error object
    let errorMessage = "An unknown error occurred.";
    if (error) {
      // Handle known error structures
      if ("status" in error) {
        errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
      } else {
        errorMessage = error.toString();
      }
    }

    content = <p>{errorMessage}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};
