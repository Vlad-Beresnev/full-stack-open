import { useSelector } from "react-redux";
import { orderBy } from "lodash";
import { Link } from "react-router-dom";



const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  const sortedBlogs = orderBy(blogs, ["likes"], ["desc"]);

  return (
    <div>
      <h2>Blogs</h2>
      <div id="bloglist">
        <div>
          <div>
            {sortedBlogs.map((blog) => (
              <div key={blog.id}>
                <div>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} - {blog.author}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;