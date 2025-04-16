const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
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
    console.log('Database cleared');
    await Blog.insertMany(initialBlogs);
    console.log('Initial blogs inserted');
    const blogsInDb = await Blog.find({});
    console.log('Blogs in database after setup:', blogsInDb);
}

async function runTests() {
    try {
        await setup();
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
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAfterPost = await Blog.find({});
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
            .send(blogWithoutUrl)
            .expect(400);
        console.log('Test passed: Missing url returns 400 Bad Request');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Test failed:', error.message);
        console.error('Full error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

runTests();