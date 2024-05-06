import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import Comments from "./Comments";

const Blog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blog = useSelector((state) => state.blogs.find((b) => String(b.id) === id));
  const user = useSelector((state) => state.login);

  const state = useSelector((state) => state);
console.log('blogs', state.blogs);
console.log('id', id);

  console.log("blog", blog)

  if (!blog) return null;

  const handleLike = () => {
    const { id } = blog;
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    dispatch(likeBlog(id, blogToUpdate));
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
      navigate("/");
    }
  };

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <div className="blog-details">
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="blog-details">
        {blog.likes} likes{" "}
        <button
         
          onClick={handleLike}
        >
          like
        </button>{" "}
        {user.username === blog.user.username && (
          <button
            onClick={handleDelete}
          >
            delete
          </button>
        )}
      </div>
      <div className="blog-details">
        added by <strong>{blog.user.name}</strong>
      </div>
      <Comments blog={blog} />
    </div>
  );
};

export default Blog;