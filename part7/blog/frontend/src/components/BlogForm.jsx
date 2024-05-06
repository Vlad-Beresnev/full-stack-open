import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { useField } from "../hooks/index";

const BlogForm = ({ togglableRef }) => {
  const { reset: resetTitle, ...title } = useField("text");
  const { reset: resetAuthor, ...author } = useField("text");
  const { reset: resetUrl, ...url } = useField("text");
  const { reset: resetComments, ...comments } = useField("text");

  const dispatch = useDispatch();

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    togglableRef.current.toggleVisibility();

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
      comments: comments.value
    };

    resetTitle();
    resetAuthor();
    resetUrl();

    dispatch(createBlog(newBlog));
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <input label="title" {...title} />
        </div>
        <div>
          <input label="author" {...author} />
        </div>
        <div>
          <input label="url" {...url} />
        </div>
        <button type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;