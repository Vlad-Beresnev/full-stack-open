import { useField } from "../hooks/index";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../reducers/blogReducer";

const Comments = ({ blog }) => {
  const { reset: resetComment, ...comment } = useField("text");

  const comments = useSelector((state) => state.blogs.find((b) => b.id === blog.id).comments);
  // const comments = blog && blog.comments ? blog.comments : [];
  const dispatch = useDispatch();

  const { id } = blog;
  console.log('comments', comments)


  const handleComment = (event) => {
    event.preventDefault();

    if (!comment.value.trim()) return;

    const result = dispatch(createComment(id, comment.value.trim()));
    
    if (result.success) resetComment();
  };

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={handleComment}>
            <textarea label="write your thoughts" size="small" {...comment} />
            <button type="submit">
              add comment
            </button>
      </form>
      {blog && blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>no comments yet...</p>
      )}
    </div>
  );
};

export default Comments;