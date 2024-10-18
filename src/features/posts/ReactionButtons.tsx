import {
  Post,
  ReactionPayloadType,
  useAddReactionMutation,
} from "./postsSlice";

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
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = (
    Object.entries(reactionEmoji) as [ReactionPayloadType["reaction"], string][]
  ).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => {
          const newValue = post.reactions[name] + 1;
          addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [name]: newValue },
          });
        }}
      >
        {emoji} {post.reactions[name as keyof Post["reactions"]]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};
