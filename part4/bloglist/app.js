const express = require('express')
const blogController = require("./controllers/blogs");
const app = express();

app.use(express.json());

app.get('/api/blogs', blogController.getAllBlogs)
app.post('/api/blogs', blogController.createBlog)
app.delete('/api/blogs/:id', blogController.deleteBlog)

module.exports = app;