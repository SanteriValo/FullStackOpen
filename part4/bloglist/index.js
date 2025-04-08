require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogController = require('./controllers/blogs')

const app = express()

const mongoUrl = process.env.MONGODB_URI
if (!mongoUrl) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
}

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB Atlas')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })

app.use(express.json())

app.get('/api/blogs', blogController.getAllBlogs)
app.post('/api/blogs', blogController.createBlog)

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})