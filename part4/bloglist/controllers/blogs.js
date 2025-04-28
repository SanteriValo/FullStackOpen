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
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();

        response.status(201).json(savedBlog);
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
        console.log('Updating blog with ID:', request.params.id);
        console.log('Update data:', blog);
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
        console.log('Updated blog before populate:', updatedBlog);
        const populatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 });
        console.log('Populated blog:', populatedBlog);
        if (!populatedBlog) {
            return response.status(404).json({ error: 'blog not found' });
        }
        const blogToReturn = populatedBlog.toJSON();
        console.log('Blog to return:', blogToReturn);
        response.json(blogToReturn);
    } catch (error) {
        console.error('Error updating blog:', error.message);
        response.status(500).json({ error: 'server error', details: error.message });
    }
});

module.exports = blogsRouter;