import { useAppDispatch } from "../../app/hooks";
import { reactionAdded } from "./postsSlice";
import { Post, ReactionPayloadType } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍🏿",
  wow: "😲",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export type ReactionEmojisProps = {
  post: Post;
};

export const ReactionButtons = ({ post }: ReactionEmojisProps) => {
  const dispatch = useAppDispatch();
  const reactionButtons = (
    Object.entries(reactionEmoji) as [ReactionPayloadType["reaction"], string][]
  ).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name as keyof Post["reactions"]]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};
