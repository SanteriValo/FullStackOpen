const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    });

    try {
        const savedBlog = await blog.save();
        const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 });
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        response.status(201).json(populatedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message });
        }
        throw error;
    }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const userId = typeof body.user === 'object' ? body.user.id || body.user._id : body.user;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: userId
    };

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
        const populatedBlog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
        if (!populatedBlog) {
            return response.status(404).json({ error: 'blog not found' });
        }
        const blogToReturn = populatedBlog.toJSON();
        response.json(blogToReturn);
    } catch (error) {
        response.status(500).json({ error: 'server error', details: error.message });
    }
});

module.exports = blogsRouter;