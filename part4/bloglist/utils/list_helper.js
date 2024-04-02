var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let likes = 0
    let favorite = null
    
    blogs.forEach(blog => {
        if (blog.likes > likes) {
            likes = blog.likes
            favorite = blog
        }
    })
    return favorite
} 

const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs, 'author')
    const mostBlogs = _.max(Object.values(authors))
    const author = _.findKey(authors, (value) => value === mostBlogs)
    return {
        author,
        blogs: mostBlogs
    }
}

const mostLikes = (blogs) => {
    const maxLikesBlog = _.maxBy(blogs, 'likes')
    return {
        author: maxLikesBlog.author,
        likes: maxLikesBlog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}