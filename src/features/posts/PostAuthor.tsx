import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";

type PostAuthorProps = {
  userId?: number;
};

export const PostAuthor = ({ userId }: PostAuthorProps) => {
  const users = useAppSelector(selectAllUsers);

  const author = users.find((user) => Number(user.id) === userId);

  return <span>by {author ? author.name : "Unknown author"}</span>;
};
