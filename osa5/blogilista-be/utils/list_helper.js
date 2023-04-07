const _ = require("lodash")

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
    
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, item) => {
    return (prev.likes > item.likes) ? prev : item
  }
    
  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs, "author")
  return  { "author": _.max(Object.keys(count), o => count[o]), "blogs": _.max(Object.values(count)) }
}

const mostLikesAuthor = (blogs) => {

  const groupedLikes = _(blogs)
    .groupBy("author")
    .map((blog_production, author) => ({
      author: author,
      likes: _.sumBy(blog_production, "likes")
    })).value()

  return  _.maxBy(groupedLikes, "likes")
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesAuthor
}