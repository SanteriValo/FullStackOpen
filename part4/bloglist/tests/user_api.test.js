require('dotenv').config();
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

async function runTests() {
    console.log('Starting user creation tests...');

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.TEST_MONGODB_URI, {
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 60000
        });
        console.log('Connected to MongoDB');

        console.log('Attempting to clear database...');
        await User.deleteMany({}).maxTimeMS(60000);
        console.log('Database cleared');

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });
        await user.save();

        console.log('Test 1: Creating a new user with valid data');
        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'password123'
        };
        let response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        let users = await User.find({});
        if (users.length !== 2 || !users.some(u => u.username === 'testuser')) {
            throw new Error('Test 1 failed: User was not created');
        }
        console.log('Test 1 passed');

        console.log('Test 2: Non-unique username');
        response = await api
            .post('/api/users')
            .send({ username: 'root', name: 'Duplicate User', password: 'password123' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        if (!response.body.error.includes('username must be unique')) {
            throw new Error('Test 2 failed: Incorrect error message for non-unique username');
        }
        console.log('Test 2 passed');

        console.log('Test 3: Short username');
        response = await api
            .post('/api/users')
            .send({ username: 'te', name: 'Test User', password: 'password123' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        if (!response.body.error.includes('username must be at least 3 characters long')) {
            throw new Error('Test 3 failed: Incorrect error message for short username');
        }
        console.log('Test 3 passed');

        console.log('Test 4: Short password');
        response = await api
            .post('/api/users')
            .send({ username: 'testuser2', name: 'Test User', password: 'pa' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        if (!response.body.error.includes('password must be at least 3 characters long')) {
            throw new Error('Test 4 failed: Incorrect error message for short password');
        }
        console.log('Test 4 passed');

        console.log('Test 5: Missing username');
        response = await api
            .post('/api/users')
            .send({ name: 'Test User', password: 'password123' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        if (!response.body.error.includes('username must be at least 3 characters long')) {
            throw new Error('Test 5 failed: Incorrect error message for missing username');
        }
        console.log('Test 5 passed');

        console.log('Test 6: Missing password');
        response = await api
            .post('/api/users')
            .send({ username: 'testuser3', name: 'Test User' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        if (!response.body.error.includes('password must be at least 3 characters long')) {
            throw new Error('Test 6 failed: Incorrect error message for missing password');
        }
        console.log('Test 6 passed');

        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error.message);
        throw error;
    }
}

runTests()
    .catch(error => {
        console.error('Test failed:', error.message);
        process.exit(1);
    })
    .finally(async () => {
        await mongoose.connection.close();
    });