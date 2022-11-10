// Helper functions for testing

const groupBy = require('lodash/groupBy')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((x,y) => x+y)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((x,y) => {
        if (x.likes > y.likes) {
            return x
        } else {
            return y
        }
    })
}

const mostBlogs = (blogs) => {
    const grouped = groupBy(blogs, 'author')
    const putIntoArray = Object.values(grouped)
    const reduced = putIntoArray.reduce((x,y) => {
        if (x.length > y.length) {
            return x
        } else {
            return y
        }
    })
    return {
        "author": reduced[0].author,
        "blogs": reduced.length
    }
}

const mostLikes = (blogs) => {
    const grouped = groupBy(blogs, 'author')
    const putIntoArray = Object.values(grouped)
    const mapped = putIntoArray.map(arr => [arr[0].author, totalLikes(arr)])
    const reduced = mapped.reduce((x,y) => {
        if (x[1] > y[1]) {
            return x
        } else {
            return y
        }
    })
    return {
        "author": reduced[0],
        "likes": reduced[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}