const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');

const api = supertest(app);

const initialBlogs = [
    {
        title: 'Test Blog 1',
        author: 'Test Author 1',
        url: 'https://testblog1.com/',
        likes: 7,
    },
    {
        title: 'Test Blog 2',
        author: 'Test Author 2',
        url: 'https://testblog2.com/',
        likes: 12,
    },
];

async function setup() {
    console.log('Setting up test database...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Blog.deleteMany({});
    await User.deleteMany({});
    console.log('Database cleared');

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash,
    });
    await user.save();
    console.log('Test user created:', user.username);

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'password123',
        })
        .expect(200);
    const token = loginResponse.body.token;
    console.log('Token received:', token);

    const blogsWithUser = initialBlogs.map(blog => ({
        ...blog,
        user: user._id,
    }));
    await Blog.insertMany(blogsWithUser);
    console.log('Initial blogs inserted');

    const blogsInDb = await Blog.find({}).populate('user', { username: 1 });
    console.log('Blogs in database after setup:', blogsInDb);

    return token;
}

async function runTests() {
    let token;

    try {
        token = await setup();

        console.log('Sending GET request to /api/blogs...');
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        console.log('Response body:', response.body);

        if (response.body.length !== initialBlogs.length) {
            throw new Error(`Expected ${initialBlogs.length} blogs, but got ${response.body.length}`);
        }
        console.log('Test passed: Correct amount of blogs returned in JSON format');

        console.log('Checking if blog identifier is named id...');
        response.body.forEach(blog => {
            if (!blog.id) {
                throw new Error('Blog id is missing');
            }
            if (blog._id) {
                throw new Error('Blog identifier _id should not be present');
            }
        });
        console.log('Test passed: Blog identifier is named id');

        console.log('Testing POST request to /api/blogs...');
        const newBlog = {
            title: 'Test Blog Title',
            author: 'Test Author',
            url: 'https://testblog.com/',
            likes: 93,
        };

        const postResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAfterPost = await Blog.find({}).populate('user', { username: 1 });
        if (blogsAfterPost.length !== initialBlogs.length + 1) {
            throw new Error(`Expected ${initialBlogs.length + 1} blogs after POST, but got ${blogsAfterPost.length}`);
        }

        const titles = blogsAfterPost.map(blog => blog.title);
        if (!titles.includes(newBlog.title)) {
            throw new Error(`Blog with title "${newBlog.title}" was not found in database`);
        }
        console.log('Test passed: POST request successfully creates a new blog');

        console.log('Testing POST request for blog without likes...');
        const blogWithoutLikes = {
            title: 'No Likes Blog',
            author: 'Unhappy Author',
            url: 'https://sadness.com/',
        };
        const postResponse2 = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        if (postResponse2.body.likes !== 0) {
            throw new Error(`Expected likes to default to 0, but got ${postResponse2.body.likes}`);
        }
        console.log('Test passed: Blog without likes defaults to 0');

        console.log('Testing POST request with missing title...');
        const blogWithoutTitle = {
            author: 'Test Author',
            url: 'https://notitle.com/',
            likes: 5,
        };
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutTitle)
            .expect(400);
        console.log('Test passed: Missing title returns 400 Bad Request');

        console.log('Testing POST request with missing url...');
        const blogWithoutUrl = {
            title: 'No URL Blog',
            author: 'Test Author',
            likes: 5,
        };
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutUrl)
            .expect(400);
        console.log('Test passed: Missing url returns 400 Bad Request');

        console.log('Testing POST request without token...');
        const blogWithoutToken = {
            title: 'Blog Without Token',
            author: 'No Token Author',
            url: 'https://notoken.com/',
            likes: 1,
        };
        await api
            .post('/api/blogs')
            .send(blogWithoutToken)
            .expect(401)
            .expect('Content-Type', /application\/json/);
        const blogsAfterNoToken = await Blog.find({});
        if (blogsAfterNoToken.length !== blogsAfterPost.length + 1) {
            throw new Error(`Expected ${blogsAfterPost.length + 1} blogs after failed POST, but got ${blogsAfterNoToken.length}`);
        }
        console.log('Test passed: POST request without token returns 401 Unauthorized');

        console.log('Testing DELETE request to /api/blogs/:id...');
        const blogToDeleteResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201);
        const blogsBeforeDelete = await Blog.find({});
        await api
            .delete(`/api/blogs/${blogToDeleteResponse.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
        const blogsAfterDelete = await Blog.find({});
        if (blogsAfterDelete.length !== blogsBeforeDelete.length - 1) {
            throw new Error(`Expected ${blogsBeforeDelete.length - 1} blogs after DELETE, but got ${blogsAfterDelete.length}`);
        }
        const deletedBlog = await Blog.findById(blogToDeleteResponse.body.id);
        if (deletedBlog) {
            throw new Error('Blog was not deleted');
        }
        console.log('Test passed: DELETE request successfully removes a blog');

        console.log('Testing PUT request to /api/blogs/:id...');
        const blogToUpdate = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201);
        const updatedData = {
            likes: blogToUpdate.body.likes + 1,
        };
        const updatedResponse = await api
            .put(`/api/blogs/${blogToUpdate.body.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        if (updatedResponse.body.likes !== updatedData.likes) {
            throw new Error(`Expected likes to be ${updatedData.likes}, but got ${updatedResponse.body.likes}`);
        }
        if (updatedResponse.body.title !== newBlog.title) {
            throw new Error(`Expected title to remain ${newBlog.title}, but got ${updatedResponse.body.title}`);
        }
        if (updatedResponse.body.author !== newBlog.author) {
            throw new Error(`Expected author to remain ${newBlog.author}, but got ${updatedResponse.body.author}`);
        }
        if (updatedResponse.body.url !== newBlog.url) {
            throw new Error(`Expected url to remain ${newBlog.url}, but got ${updatedResponse.body.url}`);
        }
        console.log('Test passed: PUT request successfully updates blog likes');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Test failed:', error.message);
        console.error('Full error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

runTests();