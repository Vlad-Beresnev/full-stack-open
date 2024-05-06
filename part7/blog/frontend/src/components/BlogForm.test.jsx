import { render, screen, waitFor } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createNote = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createNote} />);

  const title = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");
  const likes = screen.getByPlaceholderText("likes");
  const sendButton = screen.getByText("create blog");

  await user.type(title, "test title");
  await user.type(author, "test author");
  await user.type(url, "test url");
  await user.type(likes, "0");

  user.click(sendButton);

  await waitFor(() => {
    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].title).toBe("test title");
  });
});
