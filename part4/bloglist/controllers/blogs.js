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
        throw error; // Если это не ошибка валидации, пусть Express обработает её как 500
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

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(updatedBlog);
});

module.exports = blogsRouter;