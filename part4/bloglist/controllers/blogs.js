const Blog = require('../models/blog')

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'something went wrong'});
    }
};

const createBlog = async (req, res) => {
    try {
        const blog = new Blog(req.body);
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({error: 'failed to save blog'});
    }
};

module.exports = {
    getAllBlogs,
    createBlog,
}