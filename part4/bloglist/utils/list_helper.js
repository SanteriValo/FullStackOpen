const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    return blogs.reduce((max, current) => {
        return current.likes > max.likes ? current : max;
    }, blogs[0]);
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const authorCounts = _.countBy(blogs, 'author');

    const topAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author]);

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor],
    };
};

const mostLikesBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const likesByAuthor = _.reduce(blogs, (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes;
        return result;
    }, {});

    const topAuthor = _.maxBy(Object.keys(likesByAuthor), (author) => likesByAuthor[author]);

    return {
        author: topAuthor,
        likes: likesByAuthor[topAuthor]
    };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikesBlogs
}