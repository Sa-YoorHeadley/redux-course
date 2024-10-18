import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useAppSelector } from "../../app/hooks";
import {
  useDeletePostMutation,
  selectPostById,
  useUpdatePostMutation,
} from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useParams, useNavigate } from "react-router-dom";

export const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const users = useAppSelector(selectAllUsers);
  const post = useAppSelector((state) => selectPostById(state, String(postId)));
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [title, setTitle] = useState<string>(post?.title || "");
  const [body, setBody] = useState<string>(post?.body || "");
  const [userId, setUserId] = useState<string>(String(post?.userId) || "");

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

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
        await updatePost({
          title,
          body,
          id: post.id,
          userId: Number(userId),
        }).unwrap();

        setTitle("");
        setBody("");
        setUserId("");

        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to save the post", error);
      }
    }
  };

  const onDeletePostClicked = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (canSave) {
      try {
        await deletePost({ id: post.id }).unwrap();

        setTitle("");
        setBody("");
        setUserId("");

        navigate(`/`);
      } catch (error) {
        console.error("Failed to delete the post", error);
      }
    }
  };

  const userOptions = users.map((user) => {
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
          defaultValue={userId}
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
        <button type="button" onClick={onDeletePostClicked}>
          Delete Post
        </button>
      </form>
    </section>
  );
};
