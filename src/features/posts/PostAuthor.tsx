import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

type PostAuthorProps = {
  userId?: number;
};

export const PostAuthor = ({ userId }: PostAuthorProps) => {
  const { data: users } = useGetUsersQuery(undefined);

  const author = users?.find((user) => Number(user.id) === userId);

  return (
    <span>
      by
      {author ? (
        <Link to={`/users/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};
