const Blog = require('../models/blog')

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'something went wrong'});
    }
};

const createBlog = (req, res) => {
    const blog = new Blog(req.body)
    blog.save().then((result) => {
        res.status(201).json(result)
    })
}

module.exports = {
    getAllBlogs,
    createBlog,
}