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
        await mongoose.connection.close();
    } catch (error) {
        console.error('Test failed:', error.message);
        console.error('Full error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

runTests();