import { useAppDispatch } from "../../app/hooks";
import { reactionAdded } from "./postsSlice";
import { PostState, ReactionPayloadType } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍🏿",
  wow: "😲",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export type ReactionEmojisProps = {
  post: PostState;
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
        {emoji} {post.reactions[name as keyof PostState["reactions"]]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};
