import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

export const UsersList = () => {
  const { data: users } = useGetUsersQuery(undefined);

  const renderedUsers = users?.map((user) => (
    <li key={user.id}>
      <Link to={`/user/${user.id}`}>{user.name}</Link>
    </li>
  ));
  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};
