import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Blogform from './Blogform'

test('renders blog title', () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
        username: "kayttaja",
        name: "M. Meikäläinen"
    }
  }

  const user = ''

  const { container } = render(<Blog blog={blog} user={user}/>)

  const blog_div = container.querySelector('.blog')
  expect(blog_div).toHaveTextContent('React patterns')
  expect(blog_div).toHaveTextContent('Michael Chan')

  const url = container.querySelector('.url')
  expect(url).not.toBeVisible()

  const likes = container.querySelector('.url')
  expect(likes).not.toBeVisible()
})

test('url and likes shown when button clicked', async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "kayttaja",
            name: "M. Meikäläinen"
        }
    }
    
    const usser = ""
  
    const component = render(<Blog blog={blog} user={usser} />)
  
    const user = userEvent.setup()
    const button = component.getByText('show')
    await user.click(button)

    const url = component.container.querySelector('.url')
    expect(url).toBeVisible()

    const likes = component.container.querySelector('.url')
    expect(likes).toBeVisible()

  })

test('clicking likes button twice calls event handler twice', async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "kayttaja",
            name: "M. Meikäläinen"
        }
    }
    
    const usser = ""
  
    const mockHandler = jest.fn()
  
    const component = render(<Blog blog={blog} user={usser} updateLikes={mockHandler}/>)
  
    const user = userEvent.setup()
    const button = component.getByText('show')
    await user.click(button)

    const lbutton = component.getByText('Like')
    await user.click(lbutton)
    await user.click(lbutton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('Adding a blog with blogformworks', async () => {
  const user = userEvent.setup()
  const addBlog = jest.fn()

  const { container } = render(<Blogform addBlog={addBlog} />)

  const input_t = container.querySelector('#title')
  const input_a = container.querySelector('#author')
  const input_u = container.querySelector('#url')
  const sendButton = screen.getByText('save')

  await user.type(input_t, 'React patterns')
  await user.type(input_a, 'Michael Chan')
  await user.type(input_u, 'https://reactpatterns.com/')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)

  expect(addBlog.mock.calls[0][0]["title"]).toBe('React patterns')
  expect(addBlog.mock.calls[0][0]["author"]).toBe('Michael Chan')
  expect(addBlog.mock.calls[0][0]["url"]).toBe('https://reactpatterns.com/')
})