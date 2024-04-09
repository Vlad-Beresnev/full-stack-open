import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'
import serviceBlog from '../services/blogs'
import { vi } from 'vitest'

test('renders blog title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }

  render(<Blog blog={blog} />)

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  const divInfo = container.querySelector('.blog-info')

  expect(div).toHaveTextContent('test title', { exact: false })
  expect(screen.queryByText('test url')).not.toBeInTheDocument()
  expect(screen.queryByText('likes 0')).not.toBeInTheDocument()
})

test('shows blog URL and likes when view button is clicked', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }

  render(<Blog blog={blog} />)

  // Check that URL and likes are not present by default
  expect(screen.queryByText('test url'), { exact: false }).not.toBeInTheDocument()
  expect(screen.queryByText('likes 0'), { exact: false }).not.toBeInTheDocument()

  // Simulate a click on the 'view' button
  fireEvent.click(screen.getByText('view'))

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  const divInfo = container.querySelector('.blog-info')

  // Now check that URL and likes are present
  expect(divInfo).toHaveTextContent('test url', { exact: false })
  expect(divInfo).toHaveTextContent('likes', { exact: false })

})

serviceBlog.increaseLikes = vi.fn().mockImplementation(() => Promise.resolve({
  title: 'test title',
  author: 'test author',
  url: 'test url',
  likes: 1
}))

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }
  const { container } = render(<Blog blog={blog}/>)

  const divInfo = container.querySelector('.blog-info')

  const mockHandler = vi.fn()

  render(<Blog blog={blog} increaseLikes={mockHandler} />)

  const openView = screen.getAllByText('view')

  fireEvent.click(openView[0])

  const user = userEvent.setup()
  const button = divInfo.querySelector('#like-btn')
  await user.click(button)
  await user.click(button)
  expect(serviceBlog.increaseLikes.mock.calls.length).toBe(2)


})