const mongoose = require('mongoose');
require('dotenv').config()
const config = require('./utils/config');
const app = require('./app');

const mongoUrl = config.MONGODB_URI
if (!mongoUrl) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
}

mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
})
    .then(() => {
        console.log('Connected to MongoDB Atlas')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})