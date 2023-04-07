import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author} <button onClick={() => setBlogVisible(!blogVisible)}>{ blogVisible ? 'hide' : 'show' }</button>
      <div style={showWhenVisible}>
        <div className="url">{blog.url}</div>
        <div className="likes">likes {blog.likes} <button onClick={() => updateLikes(blog.id)}>Like</button></div>
        <div className="user">{blog.user.name}</div>
        { user.username === blog.user.username ?
          <button onClick={() => removeBlog(blog.id)}>remove</button> : <></>
        }
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog