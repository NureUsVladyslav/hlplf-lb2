export default function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="muted">Коментарів поки немає.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>
          <small>{new Date(comment.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
