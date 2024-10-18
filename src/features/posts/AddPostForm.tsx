import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useAddNewPostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

export const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const {data: users} = useGetUsersQuery(undefined)
  console.log(users)

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);
  const onBodyChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setBody(event.target.value);
  const onAuthorChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setUserId(event.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (canSave) {
      try {
        await addNewPost({ title, body, userId: Number(userId) }).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate(`/`);
      } catch (error) {
        console.error("Failed to save the post", error);
      }
    }
  };

  const userOptions = users?.map((user) => {
    return (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    );
  });

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="author">Post Author:</label>
        <select
          name="author"
          id="author"
          value={userId}
          onChange={onAuthorChange}
          required={true}
        >
          <option value=""></option>
          {userOptions}
        </select>

        <label htmlFor="title">Post Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={onTitleChange}
          required={true}
        />

        <label htmlFor="body">Post Body:</label>
        <textarea
          name="body"
          id="body"
          value={body}
          onChange={onBodyChange}
          required={true}
        />

        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
