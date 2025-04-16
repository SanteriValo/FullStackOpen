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
        const { title, author, url, likes } = req.body;
        const blog = new Blog({
            title,
            author,
            url,
            likes,
        });
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(400).json({ error: 'failed to save blog' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        console.log('Deleting blog with ID:', req.params.id);
        const blog = await Blog.findByIdAndDelete(req.params.id);
        console.log('Deleted blog:', blog);
        if (!blog) {
            return res.status(404).json({ error: 'blog not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error in deleteBlog:', error);
        res.status(400).json({ error: 'invalid id' });
    }
};

const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ error: 'blog not found' });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(400).json({ error: 'invalid id or data' });
    }
};

module.exports = {
    getAllBlogs,
    createBlog,
    deleteBlog,
    updateBlog,
}