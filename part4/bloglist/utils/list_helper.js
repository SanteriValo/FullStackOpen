const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    return blogs.reduce((max, current) => {
        return current.likes > max.likes ? current : max;
    }, blogs[0]);
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}