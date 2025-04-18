const express = require('express')
const blogController = require("./controllers/blogs");
const userController = require("./controllers/users");
const app = express();

app.use(express.json());

app.get('/api/blogs', blogController.getAllBlogs);
app.post('/api/blogs', blogController.createBlog);
app.delete('/api/blogs/:id', blogController.deleteBlog);
app.put('/api/blogs/:id', blogController.updateBlog);

app.post('/api/users', userController.createUser);
app.get('/api/users', userController.getAllUsers);


module.exports = app;