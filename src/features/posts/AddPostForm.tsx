import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { postAdded } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";

export const AddPostForm = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectAllUsers);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);
  const onContentChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setContent(event.target.value);
  const onAuthorChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setUserId(event.target.value);

  const onSavePostClicked = (event: SyntheticEvent) => {
    event.preventDefault();
    if (canSave) {
      dispatch(postAdded(title, content, userId));
      setTitle("");
      setContent("");
    }
  };

  const userOptions = users.map((user) => {
    return (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    );
  });

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="author">Post Author:</label>
        <select
          name="author"
          title="author"
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

        <label htmlFor="content">Post Content:</label>
        <textarea
          name="content"
          id="content"
          value={content}
          onChange={onContentChange}
          required={true}
        />

        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
