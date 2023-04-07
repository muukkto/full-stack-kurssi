import { useState } from 'react'
import PropTypes from 'prop-types'

const Blogform = ({ addBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const newBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: '',
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={newBlog}>
        <div>
        title: <input value={newBlogTitle} onChange={handleBlogTitleChange} id='title'/>
        </div>
        <div>
        author: <input value={newBlogAuthor} onChange={handleBlogAuthorChange} id='author'/>
        </div>
        <div>
        url: <input value={newBlogUrl} onChange={handleBlogUrlChange} id='url'/>
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )}

Blogform.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default Blogform